import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Button,
  Input,
  Avatar,
  Typography,
  Space,
  Rate,
  App,
  Spin,
  Empty,
} from "antd";
import { SendOutlined } from "@ant-design/icons";
import { fetchCourseReviews, addReview } from "@/features/review/reviewThunks";
import type { RootState } from "@/app/store";

const { TextArea } = Input;
const { Title, Text } = Typography;

interface CourseReviewProps {
  courseId: string;
}

export const CourseReview = ({ courseId }: CourseReviewProps) => {
  const dispatch = useDispatch<any>();
  const { message } = App.useApp();

  const { courseReviews, loading } = useSelector((state: RootState) => ({
    courseReviews: state.reviews.courseReviews ?? [],
    loading: state.reviews.loading,
  }));

  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [localReviews, setLocalReviews] = useState<any[]>([]);

  const guestUser = {
    name: "Guest User",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=guest",
  };

  // Fetch course reviews
  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseReviews(courseId)).then((res: any) => {
        if (res.meta.requestStatus === "fulfilled") {
          setLocalReviews(res.payload); // store locally for instant UI updates
        }
      });
    }
  }, [courseId, dispatch]);

  // Submit new review
  const handlePostReview = async () => {
    if (newReview.rating === 0 || !newReview.comment.trim()) {
      return message.error("Rating and comment are required");
    }

    const result = await dispatch(
      addReview({
        courseId,
        rating: newReview.rating,
        comment: newReview.comment,
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      message.success("Review added successfully");

      // Add new review locally for instant UI update
      setLocalReviews((prev) => [result.payload, ...prev]);
      setNewReview({ rating: 0, comment: "" });
    } else {
      message.error(result.payload || "Failed to add review");
    }
  };

  return (
    <div className="space-y-6">
      <Title level={3}>Course Reviews</Title>

      {/* REVIEW LIST */}
      {loading ? (
        <Spin size="large" />
      ) : localReviews.length === 0 ? (
        <Empty description="No reviews yet" />
      ) : (
        <div className="space-y-4">
          {localReviews.map((review: any) => (
            <Card key={review._id}>
              <div className="flex gap-3">
                <Avatar
                  src={review.user?.profileImage || guestUser.avatar}
                  size={45}
                />

                <div className="flex-1">
                  <Text strong style={{ fontSize: 16 }}>
                    {review.user?.name || guestUser.name}
                  </Text>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Rate
                      disabled
                      allowHalf
                      value={review.rating}
                      style={{ fontSize: 16 }}
                    />
                    <Text type="secondary">{review.rating.toFixed(1)}</Text>
                  </div>

                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleString()
                      : ""}
                  </Text>

                  <Text style={{ display: "block", marginTop: 8, fontSize: 15 }}>
                    {review.comment}
                  </Text>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* REVIEW FORM */}
      <Card>
        <Title level={4}>Write a Review</Title>

        <Space
          direction="vertical"
          className="w-full"
          size="middle"
          style={{ marginTop: 16 }}
        >
          <Rate
            allowHalf
            value={newReview.rating}
            onChange={(value) =>
              setNewReview({ ...newReview, rating: value })
            }
          />

          <TextArea
            rows={4}
            placeholder="Write your comment..."
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
          />

          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handlePostReview}
          >
            Submit Review
          </Button>
        </Space>
      </Card>
    </div>
  );
};
