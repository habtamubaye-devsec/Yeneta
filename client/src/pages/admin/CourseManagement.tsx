import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getAllCoursesForAdmin,
  approveCourse,
  rejectCourse,
  deleteCourse,
} from "@/features/courses/courseThunks";
import { RootState, AppDispatch } from "@/app/store";
import { Input, Select, Slider, Row, Col, Collapse, List } from "antd";

const { Search } = Input;
const { Option } = Select;
const { Panel } = Collapse;

export default function CourseManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading } = useSelector((state: RootState) => state.courses);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Dynamic max price based on courses
  const maxPrice = useMemo(() => {
    if (!courses || courses.length === 0) return 1000;
    return Math.max(...courses.map(c => c.price || 0));
  }, [courses]);

  // Update priceRange if maxPrice changes and current max is less
  useEffect(() => {
    if (maxPrice > priceRange[1]) {
      setPriceRange([priceRange[0], maxPrice]);
    }
  }, [maxPrice, priceRange[0], priceRange[1]]);

  const [sortBy, setSortBy] = useState("createdAt-desc");

  useEffect(() => {
    dispatch(getAllCoursesForAdmin());
  }, [dispatch]);

  // === Actions ===
  const handleApprove = async (id: string) => {
    try {
      await dispatch(approveCourse(id)).unwrap();
      toast.success("✅ Course approved successfully");
      dispatch(getAllCoursesForAdmin());
    } catch (err: any) {
      toast.error(err || "Failed to approve course");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await dispatch(rejectCourse(id)).unwrap();
      toast.error("🚫 Course rejected");
      dispatch(getAllCoursesForAdmin());
    } catch (err: any) {
      toast.error(err || "Failed to reject course");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteCourse(id)).unwrap();
      toast.success("🗑️ Course deleted successfully");
      dispatch(getAllCoursesForAdmin());
    } catch (err: any) {
      toast.error(err || "Failed to delete course");
    }
  };

  // === Badge Color ===
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "published":
      case "approved":
        return "bg-green-600";
      case "pending":
        return "bg-blue-500";
      case "unpublished":
        return "bg-yellow-500";
      case "rejected":
      default:
        return "bg-red-600";
    }
  };

  // === Filter & Sort ===
  const filteredCourses = useMemo(() => {
    let result = [...(courses || [])];

    result = result.filter((course) => {
      const term = search.toLowerCase();
      return (
        course.title.toLowerCase().includes(term) ||
        course.instructor?.name?.toLowerCase().includes(term)
      );
    });
    console.log("After search filter:", result.length);

    if (categoryFilter !== "all") {
      result = result.filter(
        (course) => course.category?.name === categoryFilter
      );
    }
    if (levelFilter !== "all") {
      result = result.filter((course) => course.level === levelFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((course) => course.status === statusFilter);
    }
    result = result.filter(
      (course) => course.price >= priceRange[0] && course.price <= priceRange[1]
    );

    result.sort((a, b) => {
      if (sortBy === "name-asc") return a.title.localeCompare(b.title);
      if (sortBy === "name-desc") return b.title.localeCompare(a.title);
      if (sortBy === "createdAt-asc")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      if (sortBy === "createdAt-desc")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      return 0;
    });

    return result;
  }, [
    courses,
    search,
    categoryFilter,
    levelFilter,
    priceRange,
    sortBy,
    statusFilter,
  ]);

  const categories = Array.from(
    new Set(courses?.map((c) => c.category?.name).filter(Boolean))
  );
  const levels = Array.from(
    new Set(courses?.map((c) => c.level).filter(Boolean))
  );
  const statuses = ["pending", "published", "unpublished", "rejected"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Course Management</h1>
          <p className="text-muted-foreground">
            Search, filter, sort, approve, reject, or delete courses.
          </p>
        </div>

        {/* === Filters === */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Search
                placeholder="Search by course or instructor"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                value={categoryFilter}
                onChange={setCategoryFilter}
                style={{ width: "100%" }}
              >
                <Option value="all">All Categories</Option>
                {categories.map((cat) => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                value={levelFilter}
                onChange={setLevelFilter}
                style={{ width: "100%" }}
              >
                <Option value="all">All Levels</Option>
                {levels.map((lvl) => (
                  <Option key={lvl} value={lvl}>
                    {lvl}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: "100%" }}
              >
                <Option value="all">All Statuses</Option>
                {statuses.map((st) => (
                  <Option key={st} value={st}>
                    {st.charAt(0).toUpperCase() + st.slice(1)}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={3}>
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: "100%" }}
              >
                <Option value="createdAt-desc">Newest First</Option>
                <Option value="createdAt-asc">Oldest First</Option>
                <Option value="name-asc">Name (A–Z)</Option>
                <Option value="name-desc">Name (Z–A)</Option>
              </Select>
            </Col>
            <Col xs={24} sm={24} md={3}>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Price: ${priceRange[0]}–${priceRange[1]} (max: ${maxPrice})
                </p>
                <Slider
                  range
                  min={0}
                  max={maxPrice}
                  step={10}
                  value={priceRange}
                  onChange={(val) => setPriceRange(val as [number, number])}
                />
              </div>
            </Col>
          </Row>
        </div>

        {/* === Course List === */}
        {loading && <p className="text-center">Loading courses...</p>}
        <div className="space-y-4">
          {!loading && filteredCourses.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No matching courses found.
            </p>
          ) : (
            filteredCourses.map((course) => (
              
              <Card key={course._id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    {/* === Thumbnail === */}
                    <div className="relative">
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                      <span
                        className={`mt-1 text-xs font-semibold px-2 py-1 rounded-md text-white shadow-md ${getBadgeColor(
                          course.status
                        )}`}
                      >
                        {course.status.toUpperCase()}
                      </span>
                    </div>

                    {/* === Info === */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        by {course.instructor?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Created:{" "}
                        {new Date(course.createdAt).toLocaleDateString()}
                      </p>

                      {/* === Actions === */}
                      <div className="mt-3">
                        {/* Approve + Reject buttons (flex together) */}
                        {course.status === "pending" && (
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              onClick={() => handleApprove(course._id!)}
                              className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1"
                            >
                              <Check className="h-4 w-4 mr-2" /> Approve
                            </Button>
                            <Button
                              onClick={() => handleReject(course._id!)}
                              className="border border-gray-400 text-sm px-3 py-1"
                            >
                              <X className="h-4 w-4 mr-2" /> Reject
                            </Button>
                          </div>
                        )}

                        {/* Delete button (drops below on mobile) */}
                        <div className="mt-2">
                          <Button
                            onClick={() => handleDelete(course._id!)}
                            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 w-full sm:w-auto"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* === Dropdown === */}
                  <Collapse ghost className="mt-4">
                    <Panel header="View More Details" key="1">
                      <p>
                        <strong>Category:</strong>{" "}
                        {course.category?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Level:</strong> {course.level || "N/A"}
                      </p>
                      <p>
                        <strong>Price:</strong> ${course.price}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {course.description || "No description."}
                      </p>

                      {/* === Lessons === */}
                      {Array.isArray(course.lessons) &&
                      course.lessons.length > 0 ? (
                        <>
                          <h4 className="font-semibold mt-2">Lessons:</h4>
                          <List
                            size="small"
                            bordered
                            dataSource={course.lessons}
                            renderItem={(lesson, idx) => (
                              <List.Item>
                                Lesson {idx + 1}: {lesson.title || "Untitled"}
                                {lesson.videoDuration && (
                                  <span className="text-sm text-gray-500 ml-1">
                                    ({lesson.videoDuration})
                                  </span>
                                )}
                              </List.Item>
                            )}
                          />
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-2">
                          No lessons available.
                        </p>
                      )}
                    </Panel>
                  </Collapse>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
