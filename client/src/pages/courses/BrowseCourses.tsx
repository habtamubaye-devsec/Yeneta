import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import { fetchCourses } from "@/features/courses/courseThunks";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Input, Select, Typography, Spin, Alert } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { CourseCard } from "../../components/course/CourseCard";

const { Title, Text } = Typography;

export default function BrowseCourses() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error } = useSelector((state: RootState) => state.courses);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  // Fetch courses on mount or when filters change
  useEffect(() => {
    const filters: any = {};

    if (searchQuery) filters.search = searchQuery;
    if (categoryFilter !== "all") filters.category = categoryFilter;
    if (levelFilter !== "all") filters.level = levelFilter;
    if (priceFilter === "free") {
      filters.maxPrice = 0;
    } else if (priceFilter === "paid") {
      filters.minPrice = 0.01;
    }

    dispatch(fetchCourses(filters));
  }, [dispatch, searchQuery, categoryFilter, levelFilter, priceFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Title level={2}>Browse Courses</Title>
          <Text type="secondary">Discover your next learning adventure</Text>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search courses..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="large"
            />
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              size="large"
              style={{ width: "100%" }}
            >
              <Select.Option value="all">All Categories</Select.Option>
              <Select.Option value="Web Development">Web Development</Select.Option>
              <Select.Option value="Mobile Development">Mobile Development</Select.Option>
              <Select.Option value="Design">Design</Select.Option>
              <Select.Option value="Data Science">Data Science</Select.Option>
            </Select>
            <Select
              value={levelFilter}
              onChange={setLevelFilter}
              size="large"
              style={{ width: "100%" }}
            >
              <Select.Option value="all">All Levels</Select.Option>
              <Select.Option value="Beginner">Beginner</Select.Option>
              <Select.Option value="Intermediate">Intermediate</Select.Option>
              <Select.Option value="Advanced">Advanced</Select.Option>
            </Select>
            <Select
              value={priceFilter}
              onChange={setPriceFilter}
              size="large"
              style={{ width: "100%" }}
            >
              <Select.Option value="all">All Prices</Select.Option>
              <Select.Option value="free">Free</Select.Option>
              <Select.Option value="paid">Paid</Select.Option>
            </Select>
          </div>
        </Card>

        {/* Loading & Error */}
        {loading && <Spin tip="Loading courses..." />}
        {error && <Alert type="error" message={error} />}

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses.map((course: any) => (
              <CourseCard
                key={course._id || course.id}
                id={course._id || course.id}
                title={course.title}
                instructor={course.instructor?.name || course.instructor || course.author || "Unknown"}
                thumbnail={course.thumbnailUrl || course.thumbnail || "/placeholder.png"}
                rating={course.rating || 0}
                students={course.students?.length ?? course.enrolledCount ?? 0}
                duration={course.duration || "0h"}
                price={course.price ?? 0}
                level={course.level || "Beginner"}
                category={course.category?.name || course.category || "General"}
              />
            ))
          ) : (
            !loading && <Text>No courses found.</Text>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
