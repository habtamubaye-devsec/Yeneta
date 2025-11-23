import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  Button,
  Modal,
  Typography,
  Rate,
  Input,
  Spin,
  message,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { fetchMyReviews, updateReview, deleteReview } from "@/features/review/reviewThunks";
import { RootState, AppDispatch } from "@/store";

const { Text, Title } = Typography;
const { TextArea } = Input;

export default function Reviews() {
  const dispatch = useDispatch<AppDispatch>();
  const { myReviews, loading } = useSelector((state: RootState) => state.reviews);

  const [editingReview, setEditingReview] = useState<any>(null);
  const [localReviews, setLocalReviews] = useState<any[]>([]);

  // Fetch my reviews once
  useEffect(() => {
    dispatch(fetchMyReviews()).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setLocalReviews(res.payload); // store locally for instant updates
      }
    });
  }, [dispatch]);

  const handleDelete = async (reviewId: string) => {
    const result = await dispatch(deleteReview(reviewId));

    if (result.meta.requestStatus === "fulfilled") {
      message.success("Review deleted successfully");
      setLocalReviews((prev) => prev.filter((r) => r._id !== reviewId));
      if (editingReview?._id === reviewId) setEditingReview(null);
    } else {
      message.error(result.payload || "Failed to delete review");
    }
  };

  const handleUpdate = async () => {
    if (!editingReview) return;

    const result = await dispatch(
      updateReview({
        id: editingReview._id,
        rating: editingReview.rating,
        comment: editingReview.comment,
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      message.success("Review updated successfully");
      setLocalReviews((prev) =>
        prev.map((r) => (r._id === editingReview._id ? editingReview : r))
      );
      setEditingReview(null);
    } else {
      message.error(result.payload || "Failed to update review");
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <Spin size="large" style={{ marginTop: 50, display: "block" }} />
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Title level={2}>My Reviews</Title>
          <Text type="secondary">Manage your reviews for your courses</Text>
        </div>

        {localReviews.length === 0 && (
          <Card style={{ textAlign: "center", padding: 30 }}>
            <Title level={4}>You haven't written any reviews yet</Title>
            <Text type="secondary">Complete a course to leave a review.</Text>
          </Card>
        )}

        {localReviews.map((review) => (
          <Card key={review._id} style={{ borderRadius: 10 }} bodyStyle={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 16 }}>
              <img
                src={review.course?.thumbnailUrl}
                alt={review.course?.title}
                style={{
                  width: 100,
                  height: 70,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <Title level={5}>{review.course?.title}</Title>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Rate
                        disabled
                        allowHalf
                        value={review.rating}
                        style={{ fontSize: 16 }}
                      />
                      <Text type="secondary">{review.rating.toFixed(1)}</Text>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => setEditingReview(review)}
                      />
                      <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(review._id)} />
                    </div>

                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Text>
                  </div>
                </div>

                <Text type="secondary">{review.comment}</Text>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* EDIT MODAL */}
      <Modal
        title="Edit Review"
        open={!!editingReview}
        onCancel={() => setEditingReview(null)}
        onOk={handleUpdate}
        okText="Update Review"
      >
        {editingReview && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <Text strong>Rating</Text>
              <Rate
                allowHalf
                value={editingReview.rating}
                onChange={(value) =>
                  setEditingReview({ ...editingReview, rating: value })
                }
              />
            </div>

            <div>
              <Text strong>Comment</Text>
              <TextArea
                rows={4}
                value={editingReview.comment}
                onChange={(e) =>
                  setEditingReview({ ...editingReview, comment: e.target.value })
                }
              />
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
