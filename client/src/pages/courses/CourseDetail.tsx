import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  Button,
  Badge,
  Tabs,
  Avatar,
  Typography,
  Spin,
  Alert,
  message,
} from "antd";
import {
  StarFilled,
  UserOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { DiscussionThread } from "@/components/discussion/DiscussionThread";
import { CourseReview } from "../../components/review/reviewThread";
import { getCourseById } from "@/features/courses/courseThunks";
import {
  createCheckoutSession,
  enrollInCourse,
  fetchEnrollmentByCourse,
  getEnrollmentsLengthByCourse,
} from "@/features/enrollment/enrollmentThunks";
import { fetchCategoryById } from "@/features/categories/categoryThunks";

const { Title, Text, Paragraph } = Typography;

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    selectedCourse: course,
    loading,
    error,
  } = useSelector((state: RootState) => state.courses);
  const { selectedCategory: category } = useSelector(
    (state: RootState) => state.categories
  );
  const { currentEnrollment, enrollmentsCount, enrollments } = useSelector(
    (state: RootState) => state.enrollment
  );

  // Single enrollment for this course
  const myEnrollment = currentEnrollment;
  const progress =  myEnrollment?.progress || 0;

  // Fetch course and related data
  useEffect(() => {
    if (id) dispatch(getCourseById(id));
  }, [dispatch, id]);

  // Fetch category once course is loaded
  useEffect(() => {
    const categoryId = course?.category;
    if (categoryId) {
      dispatch(fetchCategoryById(categoryId));
    }
  }, [dispatch, course?.category]);

  // Fetch enrollment and total students
  useEffect(() => {
    const courseId = course?._id;
    if (courseId) {
      dispatch(fetchEnrollmentByCourse(courseId));
      dispatch(getEnrollmentsLengthByCourse(courseId));
    }
  }, [dispatch, course?._id]);

  const lessons = Array.isArray(course?.lessons) ? course.lessons : [];

  const handleBuy = async () => {
    try {
      // Free course -> enroll directly
      if (!course.price || Number(course.price) === 0) {
        await dispatch(enrollInCourse(course._id)).unwrap();
        message.success("Enrolled successfully");
        return;
      }

      // Paid course -> redirect to Stripe checkout
      const url = await dispatch(createCheckoutSession(course._id)).unwrap();
      if (url) window.location.href = url;
    } catch (err: any) {
      console.error("Checkout/enroll error", err);
      message.error(err?.message || "Payment failed");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: 32, textAlign: "center" }}>
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div style={{ padding: 32 }}>
          <Alert type="error" message={String(error)} />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div style={{ padding: 32 }}>
          <Text>Course not found.</Text>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Course Header */}
        <div className="relative h-80 rounded-lg overflow-hidden">
          <img
            src={course.thumbnailUrl || course.thumbnail || "/placeholder.png"}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 to-background/20" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <Badge
              count={category?.name}
              style={{ background: "hsl(221 83% 53%)" }}
              className="mb-4"
            />
            <Title
              level={1}
              style={{ color: "white", marginBottom: 8 }}
              className="text-outline"
            >
              {course.title}
            </Title>
            <div className="flex items-center gap-6 text-sm">
              <div
                className="flex items-center gap-1"
                style={{ color: "white" }}
              >
                <StarFilled style={{ color: "#faad14" }} />
                <span className="font-medium">{course.rating || 0}</span>
              </div>
              <div
                className="flex items-center gap-1 font-bold"
                style={{ color: "white" }}
              >
                <UserOutlined />
                <span>
                  {enrollmentsCount ?? 0} student
                  {(enrollmentsCount ?? 0) === 1 ? "" : "s"}
                </span>
              </div>
              <div
                className="flex items-center gap-1"
                style={{ color: "white" }}
              >
                <ClockCircleOutlined />
                <span>{course.duration || "0h"}</span>
              </div>
              <Badge
                count={course.level || "Beginner"}
                style={{ background: "transparent", border: "1px solid white" }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: "overview",
                  label: "Overview",
                  children: (
                    <div className="space-y-4">
                      <Card>
                        <Title level={4}>What you'll learn</Title>
                        <p>{course.description}</p>
                      </Card>
                      <Card>
                        <Title level={4}>About the instructor</Title>
                        <div className="flex items-start gap-4 mt-4">
                          <Avatar
                            size={64}
                            src={
                              course.instructor?.profileImage ||
                              course.instructor?.photo
                            }
                          />
                          <div>
                            <Title level={5} style={{ marginBottom: 4 }}>
                              {course.instructor?.name || "Instructor"}
                            </Title>
                            <Text type="secondary">
                              {course.instructor?.title || ""}
                            </Text>
                            <Paragraph style={{ marginTop: 8 }}>
                              {course.instructor?.bio}
                            </Paragraph>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ),
                },
                {
                  key: "curriculum",
                  label: "Curriculum",
                  children: (
                    <Card>
                      <Title level={4}>Course Curriculum</Title>
                      <div className="space-y-2 mt-4">
                        {lessons.map((lesson: any, i: number) => (
                          <div
                            key={lesson._id || lesson.id || i}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-smooth"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                                style={{
                                  background: "hsla(221, 83%, 53%, 0.2)",
                                  color: "hsl(221 83% 53%)",
                                }}
                              >
                                {i + 1}
                              </div>
                              <div>
                                <Text strong>{lesson.title}</Text>
                                <div className="flex items-center gap-2 text-sm">
                                  <PlayCircleOutlined />
                                  <Text type="secondary">
                                    {lesson.duration || "0:00"}
                                  </Text>
                                  {lesson.free && (
                                    <Badge
                                      count="Free"
                                      style={{ background: "hsl(215 28% 17%)" }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            {(lesson.free || myEnrollment) && (
                              <Button type="text" size="small">
                                Preview
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  ),
                },
                {
                  key: "discussion",
                  label: "Discussion",
                  children: <DiscussionThread courseId={course._id || id} />,
                },
                {
                  key: 'review',
                  label: "Review",
                  children: <CourseReview courseId={course._id || id} />
                }
              ]}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              {myEnrollment ? (
                <div className="space-y-4 text-center">
                  {progress === 100 ? (
                    <>
                      <Title
                        level={2}
                        style={{ color: "hsl(120, 60%, 40%)", marginBottom: 8 }}
                      >
                        Completed
                      </Title>
                      <Text type="secondary">
                        You have completed this course
                      </Text>
                      <Button
                        type="primary"
                        block
                        size="large"
                        onClick={() => navigate("/student/certificates")}
                      >
                        Get Certificate
                      </Button>
                    </>
                  ) : (
                    <>
                      <Title
                        level={2}
                        style={{ color: "hsl(120, 60%, 40%)", marginBottom: 8 }}
                      >
                        Enrolled
                      </Title>
                      <Text type="secondary">
                        You are enrolled in this course
                      </Text>
                      <Button
                        type="primary"
                        block
                        size="large"
                        onClick={() => {
                          const firstLessonId = course.lessons?.[0]?._id;
                          firstLessonId
                            ? navigate(
                                `/courses/${course._id}/lesson/${firstLessonId}`
                              )
                            : message.warning(
                                "No lessons available for this course"
                              );
                        }}
                      >
                        Continue Learning
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <Title
                    level={2}
                    style={{ color: "hsl(120, 60%, 40%)", marginBottom: 8 }}
                  >
                    ${course.price ?? 0}
                  </Title>
                  <Text type="secondary">One-time purchase</Text>
                  <div className="mt-4">
                    <Button
                      type="primary"
                      block
                      size="large"
                      onClick={handleBuy}
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              )}

              <div className="pt-4 mt-4 border-t space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <Text type="secondary">Lessons</Text>
                  <Text strong>{course?.lessons?.length ?? 0}</Text>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text type="secondary">Duration</Text>
                  <Text strong>{course.duration || "0h"}</Text>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text type="secondary">Level</Text>
                  <Text strong>{course.level || "Beginner"}</Text>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text type="secondary">Certificate</Text>
                  <Text strong>{course.certificate ? "Yes" : "No"}</Text>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text type="secondary">Progress</Text>
                  <Text strong>{progress}%</Text>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text type="secondary">Status</Text>
                  <Text strong>{myEnrollment?.status ?? "Not Enrolled"}</Text>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Text type="secondary">Price Paid</Text>
                  <Text strong>${myEnrollment?.pricePaid ?? 0}</Text>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
