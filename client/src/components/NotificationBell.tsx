import { Badge, Button, Divider, List, Typography } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "antd";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  selectNotifications,
  selectUnreadCount,
} from "@/features/notifications/notificationSelectors";
import { markNotificationAsRead } from "@/features/notifications/notificationThunks";

const { Text } = Typography;

export default function NotificationBell({ size = 20 }: { size?: number }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const unreadCount = useAppSelector(selectUnreadCount);
  const notifications = useAppSelector(selectNotifications);

  const [open, setOpen] = useState(false); // UI-only

  const latest = useMemo(() => notifications.slice(0, 5), [notifications]);

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      trigger={["click"]}
      popupRender={() => (
        <div style={{ width: 360, background: "#fff", borderRadius: 8, padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Text strong>Notifications</Text>
            <Button
              type="link"
              size="small"
              onClick={() => {
                setOpen(false);
                navigate("/notifications");
              }}
            >
              View all
            </Button>
          </div>

          <Divider style={{ margin: "8px 0" }} />

          <List
            dataSource={latest}
            locale={{ emptyText: "No notifications" }}
            renderItem={(item) => (
              <List.Item
                style={{
                  cursor: "pointer",
                  background: item.isRead ? "transparent" : "rgba(22, 119, 255, 0.06)",
                  borderRadius: 6,
                  padding: 10,
                }}
                onClick={() => {
                  if (!item.isRead) dispatch(markNotificationAsRead(item._id));
                  setOpen(false);
                }}
              >
                <List.Item.Meta
                  title={<Text strong={!item.isRead}>{item.title}</Text>}
                  description={<Text type="secondary">{item.message}</Text>}
                />
              </List.Item>
            )}
          />
        </div>
      )}
    >
      <Badge count={unreadCount} size="small" overflowCount={99}>
        <Button type="text" icon={<BellOutlined style={{ color: "#1e293b", fontSize: size, }} />} />
      </Badge>
    </Dropdown>
  );
}
