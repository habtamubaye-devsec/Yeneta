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

import {
  fetchMyReview,
  updateReview,
  deleteReview,
} from "@/features/review/reviewThunks";
import { RootState, AppDispatch } from "@/store";

const { Text, Title } = Typography;
const { TextArea } = Input;

export default function Reviews() {
  const dispatch = useDispatch<AppDispatch>();

  const { myReview, loading } = useSelector(
    (state: RootState) => state.reviews
  );

  const [editingReview, setEditingReview] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchMyReview());
  }, [dispatch]);

  const handleDelete = async () => {
    if (!myReview?._id) return;

    const result = await dispatch(deleteReview(myReview._id));

    if (result.meta.requestStatus === "fulfilled") {
      message.success("Review deleted successfully");
    } else {
      message.error(result.payload || "Failed to delete review");
    }
  };

  const handleUpdate = () => {
    dispatch(
      updateReview({
        id: editingReview.id,
        rating: editingReview.rating,
        comment: editingReview.comment,
      })
    );
    setEditingReview(null);
  };

  if (loading)
    return (
      <DashboardLayout>
        <Spin size="large" style={{ marginTop: 50 }} />
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Title level={2}>My Review</Title>
          <Text type="secondary">Manage your review for this course</Text>
        </div>

        {!myReview && (
          <Card style={{ textAlign: "center", padding: 30 }}>
            <Title level={4}>You haven't written a review yet</Title>
            <Text type="secondary">Complete a course to leave a review.</Text>
          </Card>
        )}

        {myReview && (
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 16 }}>
              <img
                src={myReview.course?.thumbnailUrl}
                alt={myReview.course?.title}
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
                    <Title level={5}>{myReview.course?.title}</Title>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Rate disabled defaultValue={myReview.rating} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => setEditingReview(myReview)}
                      />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleDelete}
                      />
                    </div>

                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      {new Date(myReview.createdAt).toLocaleDateString()}
                    </Text>
                  </div>
                </div>

                <Text type="secondary">{myReview.comment}</Text>
              </div>
            </div>
          </Card>
        )}
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
                  setEditingReview({
                    ...editingReview,
                    comment: e.target.value,
                  })
                }
              />
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
