import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import { fetchCourses } from "@/features/courses/courseThunks";
import { fetchReviewSummaryForCourses } from "@/features/review/reviewThunks";
import { fetchCategories } from "@/features/categories/categoryThunks";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Input, Select, Typography, Spin, Alert, Slider, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { CourseCard } from "@/components/course/CourseCard";

const { Title, Text } = Typography;

export default function BrowseCourses() {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const { courses, loading: coursesLoading, error } = useSelector((state: RootState) => state.courses);
  const { summary: coursesSummary, loading: summaryLoading } = useSelector((state: RootState) => state.reviews);
  const { categories, loading: categoriesLoading } = useSelector((state: RootState) => state.categories);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [priceTouched, setPriceTouched] = useState(false);

  // Fetch courses, review summary, and categories
  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchReviewSummaryForCourses());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Map courseId to review summary for quick lookup
  const reviewMap: Record<string, { averageRating: number; reviewCount: number }> = {};
  coursesSummary.forEach((summary) => {
    reviewMap[summary.courseId] = { averageRating: summary.averageRating, reviewCount: summary.reviewCount };
  });

  const loading = coursesLoading || summaryLoading || categoriesLoading;

  const maxCoursePrice = useMemo(() => {
    const values = (courses || []).map((c) => Number((c as any)?.price) || 0);
    return values.length ? Math.max(...values) : 0;
  }, [courses]);

  const sliderMax = Math.max(1000, maxCoursePrice);

  // Ensure the default price range shows all courses (including expensive ones).
  useEffect(() => {
    if (priceTouched) return;
    setPriceRange([0, sliderMax]);
  }, [sliderMax, priceTouched]);

  // Filtered & normalized courses
  const filteredCourses = courses
    .filter((course) => {
      // Search
      const term = searchQuery.toLowerCase();
      if (term && !course.title.toLowerCase().includes(term) && !course.instructor?.name?.toLowerCase().includes(term)) {
        return false;
      }

      // Category
      if (categoryFilter !== "all") {
        const courseCategory = (course.category?.name || course.category || "").toLowerCase();
        if (courseCategory !== categoryFilter.toLowerCase()) return false;
      }

      // Level
      if (levelFilter !== "all") {
        const courseLevel = (course.level || "beginner").toLowerCase();
        if (courseLevel !== levelFilter.toLowerCase()) return false;
      }

      // Price
      if (course.price < priceRange[0] || course.price > priceRange[1]) return false;

      return true;
    });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Title level={2}>Browse Courses</Title>
          <Text type="secondary">Discover your next learning adventure</Text>
        </div>

        {/* Filters */}
        <Card>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Search courses..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="large"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                value={categoryFilter}
                onChange={setCategoryFilter}
                size="large"
                style={{ width: "100%" }}
              >
                <Select.Option value="all">All Categories</Select.Option>
                {categories.map((cat) => (
                  <Select.Option key={cat._id} value={cat.name.toLowerCase()}>
                    {cat.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                value={levelFilter}
                onChange={setLevelFilter}
                size="large"
                style={{ width: "100%" }}
              >
                <Select.Option value="all">All Levels</Select.Option>
                <Select.Option value="beginner">Beginner</Select.Option>
                <Select.Option value="intermediate">Intermediate</Select.Option>
                <Select.Option value="advanced">Advanced</Select.Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div>
                <Text type="secondary" className="mb-1">
                  Price: ${priceRange[0]}–${priceRange[1]}
                </Text>
                <Slider
                  range
                  min={0}
                  max={sliderMax}
                  step={10}
                  value={priceRange}
                  onChange={(val) => {
                    setPriceTouched(true);
                    setPriceRange(val as [number, number]);
                  }}
                />
              </div>
            </Col>
          </Row>
        </Card>

        {/* Loading & Error */}
        {loading && <Spin tip="Loading courses..." />}
        {error && <Alert type="error" message={error} />}

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => {
              const summary = reviewMap[course._id || course.id] || { averageRating: 0, reviewCount: 0 };
              return (
                <CourseCard
                  key={course._id || course.id}
                  id={course._id || course.id}
                  title={course.title}
                  instructor={course.instructor?.name || course.instructor || course.author || "Unknown"}
                  thumbnail={course.thumbnailUrl || course.thumbnail || "/placeholder.png"}
                  rating={summary.averageRating}
                  students={course.students?.length ?? course.enrolledCount ?? 0}
                  duration={course.duration || "0h"}
                  price={course.price ?? 0}
                  level={course.level || "Beginner"}
                  category={course.category?.name || course.category || "General"}
                />
              );
            })
          ) : (
            !loading && <Text>No courses found.</Text>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
