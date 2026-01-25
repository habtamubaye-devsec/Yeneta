import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Progress, Button, Tag, Spin, Empty } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchMyEnrollments } from "@/features/enrollment/enrollmentThunks"; // adjust path
import type { RootState, AppDispatch } from "@/app/store"; // adjust your store path

export default function MyCourses() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const courseId = useParams();

  const { enrollments, loading, error } = useSelector((state: RootState) => state.enrollment);

  useEffect(() => {
    dispatch(fetchMyEnrollments());
  }, [dispatch, courseId]);

  if (loading) return (
    <DashboardLayout>
      <div style={{ padding: 32, textAlign: "center" }}><Spin /></div>
    </DashboardLayout>
  );

  if (error) return (
    <DashboardLayout>
      <div style={{ padding: 32 }}><p style={{ color: "red" }}>{error}</p></div>
    </DashboardLayout>
  );

  if (!enrollments.length) return (
    <DashboardLayout>
      <div style={{ padding: 32 }}><Empty description="You have no courses yet" /></div>
    </DashboardLayout>
  );

  // Filter courses by progress
  const inProgress = enrollments.filter((e: any) => e.progress < 100);
  const completed = enrollments.filter((e: any) => e.progress >= 100);

  return (
    <DashboardLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div>
          <h1 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "8px" }}>My Courses</h1>
          <p style={{ color: "hsl(215 16% 47%)" }}>Track your learning progress</p>
        </div>

        {/* In Progress */}
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
            In Progress ({inProgress.length})
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
            {inProgress.map((e: any) => {
              const { course, lessons } = e;
              const firstLessonId = lessons?.[0]?._id || lessons?.[0];

              return (
                <Card
                  key={course._id || course.id}
                  hoverable
                  cover={
                    <img
                      alt={course.title}
                      src={course.thumbnailUrl || course.thumbnail || ""}
                      style={{ height: "192px", objectFit: "cover" }}
                    />
                  }
                >
                  <Card.Meta
                    title={course.title}
                    description={course.instructor?.name || course.instructor || ""}
                    style={{ marginBottom: "16px" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "8px" }}>
                    <span style={{ color: "hsl(215 16% 47%)" }}>Progress</span>
                    <span style={{ fontWeight: 500 }}>{e.progress}%</span>
                  </div>
                  <Progress percent={e.progress} size="small" />
                  <div style={{ marginTop: 16 }}>
                    {firstLessonId ? (
                      <Button
                        type="primary"
                        block
                        onClick={() => navigate(`/courses/${course._id || course.id}/lesson/${firstLessonId}`)}
                      >
                        Continue Learning
                      </Button>
                    ) : (
                      <Link to={`/courses/${course._id || course.id}`}>
                        <Button type="primary" block>View Course</Button>
                      </Link>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Completed */}
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
            Completed ({completed.length})
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
            {completed.map((e: any) => {
              const { course } = e;
              return (
                <Card
                  key={course._id || course.id}
                  hoverable
                  cover={
                    <img
                      alt={course.title}
                      src={course.thumbnailUrl || course.thumbnail || ""}
                      style={{ height: "192px", objectFit: "cover" }}
                    />
                  }
                >
                  <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginBottom: "16px" }}>
                    <Card.Meta
                      title={course.title}
                      description={course.instructor?.name || course.instructor || ""}
                    />
                    <Tag color="success">Completed</Tag>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link to={`/courses/${course._id || course.id}`} style={{ flex: 1 }}>
                      <Button block>Review</Button>
                    </Link>
                    <Link to="/student/certificates" style={{ flex: 1 }}>
                      <Button type="primary" block>Certificate</Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
