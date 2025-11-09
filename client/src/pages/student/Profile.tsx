import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Button, Input, Avatar, Form, Upload, message } from "antd";
import { CameraOutlined, SaveOutlined } from "@ant-design/icons";
import {
  updateUserPassword,
  updateUserProfile,
  requestInstructor,
} from "@/features/user/userThunks";
import {fetchCurrentUser} from  '../../features/auth/authThunks'
import { RootState } from "@/app/store";

const { TextArea } = Input;

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (user && !initialized.current) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        bio: user.bio,
      });
      setPreview(user.profileImage || null);
      initialized.current = true;
    }
  }, [user, form]);

   const handleRequestInstructor = async () => {
    try {
      if (user.role !== "student") {
        return message.warning("Only students can request to become instructors.");
      }

      await dispatch(requestInstructor() as any).unwrap();
      message.success("Instructor request updated successfully!");
    } catch (err: any) {
      message.error(err || "Failed to send instructor request");
    }
  };


  // ✅ Update profile
  const handleProfileSave = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("bio", values.bio || "");
      if (imageFile) formData.append("profileImage", imageFile);

      const updatedUser = await dispatch(updateUserProfile(formData) as any).unwrap();
      message.success("Profile updated successfully!");

      if (updatedUser?.profileImage) {
        setPreview(updatedUser.profileImage);
      }

      setImageFile(null);
    } catch (err: any) {
      message.error(err || "Failed to update profile");
    }
  };

  // ✅ Update password
  const handlePasswordChange = (values: any) => {
    dispatch(updateUserPassword(values) as any)
      .unwrap()
      .then(() => {
        message.success("Password updated successfully!");
        passwordForm.resetFields();
      })
      .catch((err) => message.error(err));
  };

  if (!user) return <p>Loading...</p>;

  return (
    <DashboardLayout>
      <div
        style={{
          maxWidth: "768px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* ✅ Header + Request Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Profile Settings
            </h1>
            <p style={{ color: "hsl(215 16% 47%)" }}>
              Manage your account information
            </p>

            {/* ✅ Instructor Request Button */}
            {user.role === "student" && (
              <Button
                type={
                  user.requestedToBeInstructor === "requested"
                    ? "default"
                    : "primary"
                }
                className="mt-2"
                onClick={handleRequestInstructor}
              >
                {user.requestedToBeInstructor === "requested"
                  ? "Cancel Instructor Request"
                  : "Request to Be Instructor"}
              </Button>
            )}
          </div>
        </div>

        {/* ✅ Profile Info */}
        <Card title="Profile Information">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginBottom: "24px",
            }}
          >
            <Avatar
              size={96}
              src={preview || undefined}
              style={{ background: "hsl(221 83% 53%)" }}
            >
              {!preview && user?.name?.[0]}
            </Avatar>
            <div>
              <Upload
                beforeUpload={(file) => {
                  setImageFile(file);
                  const reader = new FileReader();
                  reader.onload = (e) => setPreview(e.target?.result as string);
                  reader.readAsDataURL(file);
                  return false; // Prevent auto-upload
                }}
                showUploadList={false}
              >
                <Button icon={<CameraOutlined />}>Change Avatar</Button>
              </Upload>
              <p
                style={{
                  fontSize: "14px",
                  color: "hsl(215 16% 47%)",
                  marginTop: "8px",
                }}
              >
                JPG, PNG or GIF. Max 5MB
              </p>
            </div>
          </div>

          <Form form={form} layout="vertical" onFinish={handleProfileSave}>
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input size="large" disabled />
            </Form.Item>

            <Form.Item label="Bio" name="bio">
              <TextArea rows={4} placeholder="Tell us about yourself..." />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                block
                size="large"
              >
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* ✅ Password Update */}
        <Card title="Change Password">
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordChange}
          >
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[{ required: true }]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[{ required: true, min: 6 }]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value)
                      return Promise.resolve();
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Update Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
