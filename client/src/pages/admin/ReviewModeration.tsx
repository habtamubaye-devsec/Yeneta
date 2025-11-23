import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Tabs,
  Card,
  Avatar,
  Spin,
  Button,
  Popconfirm,
  Tag,
  Input,
  Select,
} from "antd";

import {
  fetchReviewForAdmin,
  deleteReviewAdmin,
  fetchReviewSummaryForCourses,
} from "../../features/review/reviewThunks";

import type { RootState, AppDispatch } from "../../app/store";
import { StarFilled, DeleteOutlined, FlagFilled } from "@ant-design/icons";

// ⭐ Fractional star rating component
const FractionalRate = ({ value, max = 5, size = 14 }) => {
  const stars = [];
  for (let i = 1; i <= max; i++) {
    let fillPercent = 0;
    if (i <= Math.floor(value)) fillPercent = 100;
    else if (i === Math.ceil(value)) fillPercent = (value % 1) * 100;

    stars.push(
      <span
        key={i}
        style={{
          display: "inline-block",
          position: "relative",
          width: size,
          height: size,
          marginRight: 2,
        }}
      >
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

export default function ReviewModeration() {
  const dispatch = useDispatch<AppDispatch>();

  const { adminReviews, summary, loading } = useSelector(
    (state: RootState) => state.reviews
  );

  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  // ----- NEW STATE -----
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchReviewForAdmin());
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

  // ----------------------------------------------------------
  // ⭐ APPLY SEARCH + FILTER BEFORE GROUPING
  // ----------------------------------------------------------

  const filteredReviews = adminReviews.filter((r) => {
    const courseName = r.course?.title?.toLowerCase() || "";
    const studentName = r.user?.name?.toLowerCase() || "";

    const searchMatch =
      courseName.includes(search.toLowerCase()) ||
      studentName.includes(search.toLowerCase());

    // ⭐ Rating range filtering (3 → 3.0–3.9)
    const ratingMatch = ratingFilter
      ? r.rating >= ratingFilter && r.rating < ratingFilter + 1
      : true;

    return searchMatch && ratingMatch;
  });

  // ----------------------------------------------------------
  // ⭐ Group reviews by course AFTER filtering
  // ----------------------------------------------------------
  const groupedByCourse: Record<string, any[]> = filteredReviews.reduce(
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
        <h1 style={{ fontSize: 28, fontWeight: "bold" }}>Review Moderation</h1>
        <p style={{ color: "#666" }}>
          Manage and moderate reviews from all users
        </p>

        <Tabs defaultActiveKey="reviews">
          <Tabs.TabPane tab="All Reviews" key="reviews">
            {/* 🔍 SEARCH + FILTER BAR */}
            <div
              style={{
                display: "flex",
                gap: 15,
                marginBottom: 20,
                alignItems: "center",
              }}
            >
              <Input
                placeholder="Search by course or student"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 260 }}
              />

              <Select
                allowClear
                placeholder="Filter by rating"
                style={{ width: 160 }}
                onChange={(val) => setRatingFilter(val ?? null)}
                options={[1, 2, 3, 4, 5].map((n) => ({
                  value: n,
                  label: `${n} Star${n > 1 ? "s" : ""}`,
                }))}
              />
            </div>

            <div
              style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {Object.keys(groupedByCourse).length === 0 && (
                <p
                  style={{ color: "#888", textAlign: "center", marginTop: 40 }}
                >
                  No reviews match your search/filter.
                </p>
              )}

              {Object.keys(groupedByCourse).map((courseId) => {
                const courseReviews = groupedByCourse[courseId];
                const courseInfo = courseReviews[0]?.course;

                const courseSummary = summary.find(
                  (x) => x.courseId === courseId
                );

                const avgRating = courseSummary?.averageRating || 0;
                const reviewCount =
                  courseSummary?.reviewCount || courseReviews.length;

                const showAll = expandedCourse === courseId;
                const displayedReviews = showAll
                  ? courseReviews
                  : courseReviews.slice(0, 2);

                return (
                  <Card key={courseId} style={{ borderRadius: 10 }}>
                    {/* ⭐ COURSE HEADER + AVERAGE RATING */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 15,
                        marginBottom: 10,
                      }}
                    >
                      <img
                        src={courseInfo?.thumbnailUrl}
                        alt={courseInfo?.title}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 8,
                          objectFit: "cover",
                        }}
                      />

                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0 }}>{courseInfo?.title}</h3>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginTop: 4,
                          }}
                        >
                          <FractionalRate value={avgRating} size={14} />
                          <span style={{ fontSize: 12, color: "#555" }}>
                            {avgRating.toFixed(1)} ({reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ⭐ REVIEW LIST */}
                    {displayedReviews.map((review) => (
                      <Card
                        key={review._id}
                        size="small"
                        style={{
                          marginBottom: 15,
                          borderRadius: 8,
                          background: review.flagged ? "#fff2f0" : "white",
                        }}
                      >
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
                                <h4 style={{ margin: 0 }}>
                                  {review.user?.name}
                                </h4>
                                <small style={{ color: "#888" }}>
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </small>
                              </div>

                              <div style={{ textAlign: "right" }}>
                                <FractionalRate
                                  value={review.rating}
                                  size={12}
                                />
                                <span
                                  style={{
                                    fontSize: 10,
                                    color: "#888",
                                    marginLeft: 4,
                                  }}
                                >
                                  {review.rating.toFixed(1)}
                                </span>
                              </div>
                            </div>

                            <p style={{ color: "#555", marginTop: 5 }}>
                              {review.comment}
                            </p>

                            {review.flagged && (
                              <Tag color="red" icon={<FlagFilled />}>
                                Flagged
                              </Tag>
                            )}
                          </div>

                          <Popconfirm
                            title="Delete this review?"
                            okText="Delete"
                            cancelText="Cancel"
                            onConfirm={() =>
                              dispatch(deleteReviewAdmin(review._id))
                            }
                          >
                            <Button danger icon={<DeleteOutlined />} />
                          </Popconfirm>
                        </div>
                      </Card>
                    ))}

                    {/* SHOW MORE / LESS */}
                    {courseReviews.length > 2 && (
                      <div style={{ textAlign: "center", marginTop: 8 }}>
                        <Button
                          type="link"
                          onClick={() =>
                            setExpandedCourse(showAll ? null : courseId)
                          }
                        >
                          {showAll
                            ? "Show Less"
                            : `Show More (${courseReviews.length - 2})`}
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
