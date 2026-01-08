import { useMemo } from "react";
import { App as AntApp, Button, Card, Form, Input, Select, Space, Typography } from "antd";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import type { AdminSendPayload } from "@/features/notifications/types";
import { sendRoleNotification } from "@/features/notifications/notificationThunks";

const { Title, Text } = Typography;

type Role = "superadmin" | "admin" | "instructor" | "student";

export default function AdminSendNotification() {
  const { message } = AntApp.useApp();
  const dispatch = useAppDispatch();

  const userRole = useAppSelector((s) => (s.auth.user as any)?.role as Role | undefined);

  const allowedTargetRoles = useMemo<Role[]>(() => {
    if (userRole === "superadmin") return ["admin", "instructor", "student"];
    if (userRole === "admin") return ["instructor", "student"];
    return [];
  }, [userRole]);

  const [form] = Form.useForm<AdminSendPayload>();

  return (
    <DashboardLayout>
      <Space direction="vertical" size={16} style={{ width: "100%", maxWidth: 720 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Send Notification
          </Title>
          <Text type="secondary">
            Send an announcement to users by role.
          </Text>
        </div>

        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={async (values) => {
              try {
                if (!allowedTargetRoles.length) {
                  message.error("You are not allowed to send notifications");
                  return;
                }

                await dispatch(sendRoleNotification(values)).unwrap();
                message.success("Notification sent");
                form.resetFields();
              } catch (e: any) {
                message.error(String(e));
              }
            }}
            initialValues={{ type: "info" }}
          >
            <Form.Item
              label="Target roles"
              name="targetRoles"
              rules={[{ required: true, message: "Select at least one role" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select roles"
                options={allowedTargetRoles.map((r) => ({ label: r, value: r }))}
              />
            </Form.Item>

            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input placeholder="Notification title" />
            </Form.Item>

            <Form.Item
              label="Message"
              name="message"
              rules={[{ required: true, message: "Message is required" }]}
            >
              <Input.TextArea rows={5} placeholder="Write your message..." />
            </Form.Item>

            <Form.Item label="Type" name="type">
              <Select
                options={[
                  { label: "info", value: "info" },
                  { label: "success", value: "success" },
                  { label: "warning", value: "warning" },
                  { label: "error", value: "error" },
                ]}
              />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Send
            </Button>
          </Form>
        </Card>
      </Space>
    </DashboardLayout>
  );
}
