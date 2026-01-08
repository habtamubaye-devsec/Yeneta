import { useEffect, useMemo, useState } from "react";
import { App as AntApp, Button, Card, List, Space, Tag, Typography } from "antd";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  selectNotifications,
  selectNotificationError,
  selectNotificationLoading,
  selectNotificationPage,
} from "@/features/notifications/notificationSelectors";
import {
  fetchNotifications,
  markAllAsRead,
  markNotificationAsRead,
} from "@/features/notifications/notificationThunks";

const { Title, Text } = Typography;

const PAGE_SIZE = 10;

export default function Notifications() {
  const { message } = AntApp.useApp();
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectNotifications);
  const loading = useAppSelector(selectNotificationLoading);
  const error = useAppSelector(selectNotificationError);
  const page = useAppSelector(selectNotificationPage);

  const [hasMore, setHasMore] = useState(true); // UI-only

  useEffect(() => {
    dispatch(fetchNotifications(1))
      .unwrap()
      .then((res) => setHasMore(res.items.length >= PAGE_SIZE))
      .catch(() => setHasMore(true));
  }, [dispatch]);

  useEffect(() => {
    if (error) message.error(error);
  }, [error, message]);

  const unreadCount = useMemo(() => items.filter((n) => !n.isRead).length, [items]);

  return (
    <DashboardLayout>
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Notifications
            </Title>
            <Text type="secondary">{unreadCount} unread</Text>
          </div>

          <Space>
            <Button
              disabled={!unreadCount || loading}
              onClick={() => {
                dispatch(markAllAsRead())
                  .unwrap()
                  .then(() => message.success("All notifications marked as read"))
                  .catch((e) => message.error(String(e)));
              }}
            >
              Mark all as read
            </Button>
          </Space>
        </div>

        <Card>
          <List
            loading={loading && items.length === 0}
            dataSource={items}
            locale={{ emptyText: "No notifications" }}
            renderItem={(item) => (
              <List.Item
                style={{
                  background: item.isRead ? "transparent" : "rgba(22, 119, 255, 0.06)",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 8,
                }}
                actions={[
                  <Button
                    key="read"
                    type="link"
                    disabled={item.isRead}
                    onClick={() => dispatch(markNotificationAsRead(item._id))}
                  >
                    Mark as read
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <Text strong={!item.isRead}>{item.title}</Text>
                      <Tag color={item.type === "error" ? "red" : item.type}>
                        {item.type}
                      </Tag>
                    </Space>
                  }
                  description={<Text type="secondary">{item.message}</Text>}
                />
              </List.Item>
            )}
          />

          <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
            <Button
              disabled={loading || !hasMore}
              onClick={() => {
                const nextPage = page + 1;
                dispatch(fetchNotifications(nextPage))
                  .unwrap()
                  .then((res) => {
                    if (!res.items.length) {
                      setHasMore(false);
                      return;
                    }
                    setHasMore(res.items.length >= PAGE_SIZE);
                  })
                  .catch((e) => message.error(String(e)));
              }}
            >
              {hasMore ? "Load more" : "No more notifications"}
            </Button>
          </div>
        </Card>
      </Space>
    </DashboardLayout>
  );
}
