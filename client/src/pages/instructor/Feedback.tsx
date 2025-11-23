import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, Card, Avatar, Spin, Button } from "antd";
import { fetchInstructorReviews, fetchReviewSummaryForCourses } from "../../features/review/reviewThunks";
import type { RootState, AppDispatch } from "../../app/store";
import { StarFilled } from "@ant-design/icons";

// Custom fractional star component
const FractionalRate = ({ value, max = 5, size = 14 }: { value: number; max?: number; size?: number }) => {
  const stars = [];
  for (let i = 1; i <= max; i++) {
    let fillPercent = 0;
    if (i <= Math.floor(value)) fillPercent = 100;
    else if (i === Math.ceil(value)) fillPercent = (value % 1) * 100;
    stars.push(
      <span key={i} style={{ display: "inline-block", position: "relative", width: size, height: size, marginRight: 2 }}>
        <StarFilled style={{ color: "#e6e6e6", fontSize: size }} />
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${fillPercent}%`,
            overflow: "hidden",
            color: "#faad14",
          }}
        >
          <StarFilled style={{ fontSize: size }} />
        </span>
      </span>
    );
  }
  return <span>{stars}</span>;
};

export default function Feedback() {
  const dispatch = useDispatch<AppDispatch>();
  const { instructorReviews, summary: coursesSummary, loading } = useSelector(
    (state: RootState) => state.reviews
  );

  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchInstructorReviews());
    dispatch(fetchReviewSummaryForCourses());
  }, [dispatch]);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  // Group reviews by course
  const groupedByCourse: Record<string, any[]> = instructorReviews.reduce(
    (acc: any, review: any) => {
      const courseId = review.course?._id;
      if (!acc[courseId]) acc[courseId] = [];
      acc[courseId].push(review);
      return acc;
    },
    {}
  );

  return (
    <DashboardLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: "bold" }}>Student Feedback</h1>
          <p style={{ color: "#666" }}>Reviews from your students</p>
        </div>

        <Tabs defaultActiveKey="reviews">
          <Tabs.TabPane tab="Reviews" key="reviews">
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 20 }}>
              {coursesSummary.map((course) => {
                const allReviews = groupedByCourse[course.courseId] || [];
                const showAll = expandedCourse === course.courseId;
                const displayedReviews = showAll ? allReviews : allReviews.slice(0, 2);

                return (
                  <Card key={course.courseId} style={{ borderRadius: 10 }}>
                    {/* Course thumbnail and summary */}
                    <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 10 }}>
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        style={{ width: 80, height: 80, borderRadius: 8, objectFit: "cover" }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0 }}>{course.title}</h3>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                          <FractionalRate value={course.averageRating} size={14} />
                          <span style={{ fontSize: 12, color: "#555" }}>
                            {course.averageRating.toFixed(1)} ({course.reviewCount} {course.reviewCount === 1 ? "review" : "reviews"})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Reviews */}
                    {displayedReviews.length > 0 && (
                      <div
                        style={{
                          maxHeight: showAll ? 300 : "auto",
                          overflowY: showAll ? "scroll" : "visible",
                          paddingRight: showAll ? 10 : 0,
                        }}
                      >
                        {displayedReviews.map((review) => (
                          <Card key={review._id} style={{ marginBottom: 15, borderRadius: 8 }}>
                            <div style={{ display: "flex", gap: 15 }}>
                              <Avatar size={45} src={review.user?.profileImage}>
                                {review.user?.name?.charAt(0)}
                              </Avatar>
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 6,
                                  }}
                                >
                                  <div>
                                    <h4 style={{ margin: 0 }}>{review.user?.name}</h4>
                                  </div>
                                  <div style={{ textAlign: "right" }}>
                                    <FractionalRate value={review.rating} size={12} />
                                    <span style={{ fontSize: 10, color: "#888", marginLeft: 4 }}>
                                      {review.rating.toFixed(1)}
                                    </span>
                                    <br />
                                    <small style={{ color: "#888" }}>
                                      {new Date(review.createdAt).toLocaleDateString()}
                                    </small>
                                  </div>
                                </div>
                                <p style={{ color: "#555", marginTop: 5 }}>{review.comment}</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}

                    {allReviews.length > 2 && (
                      <div style={{ textAlign: "center", marginTop: 8 }}>
                        <Button
                          type="link"
                          onClick={() =>
                            setExpandedCourse(showAll ? null : course.courseId)
                          }
                        >
                          {showAll ? "Show Less" : `Show More (${allReviews.length - 2})`}
                        </Button>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
