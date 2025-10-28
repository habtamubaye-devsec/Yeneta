import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Card, Form, message, Divider, Space } from "antd";
import { GithubOutlined, GoogleOutlined } from "@ant-design/icons";
import { GraduationCap } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { registerUser, verifyOtp } from "@/features/auth/authThunks";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { resendOtp } from "../features/auth/authThunks";

export default function Register() {
  const [form] = Form.useForm();
  const [otp, setOtp] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    userId,
    loading,
    message: successMessage,
    error,
  } = useAppSelector((state) => state.auth);

  // // 🔔 Redirect if already authenticated
  // useAuthCheck();

  // Show messages from Redux
  useEffect(() => {
    if (successMessage) message.success(successMessage);
    if (error) message.error(error);
  }, [successMessage, error]);

  // 🟢 Register
  const handleRegister = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    if (values.password.length < 6) {
      message.error("Password must be at least 6 characters");
      return;
    }
    try {
      await dispatch(registerUser(values)).unwrap();
    } catch {}
  };

  // 🟢 Verify OTP
  const handleVerifyOtp = async () => {
    if (!userId) return message.error("Missing user ID");
    try {
      await dispatch(verifyOtp({ userId, otp })).unwrap();
      message.success("OTP verified successfully!");
      navigate("/login");
    } catch {}
  };

  // 🟡 Resend OTP
const handleResendOtp = async () => {
  const email = form.getFieldValue("email"); // ✅ get email from form data
  if (!email) return message.error("Please enter your email first.");

  try {
    await dispatch(resendOtp({ email })).unwrap();
    message.success("OTP has been resent to your email!");
  } catch (err) {
    message.error("Failed to resend OTP. Please try again.");
  }
};

  // OAuth login
  const handleOAuthLogin = (provider: "google" | "github") => {
    window.location.href = `http://localhost:8000/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="space-y-1 text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-600">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">
            {userId ? "Verify Your Email" : "Create your account"}
          </h2>
          <p className="text-gray-500">
            {userId
              ? "Enter the OTP sent to your email to activate your account."
              : "Start your learning journey today"}
          </p>
        </div>

        {!userId ? (
          <Form layout="vertical" form={form} onFinish={handleRegister}>
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input placeholder="John Doe" size="large" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input type="email" placeholder="john@example.com" size="large" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password placeholder="••••••••" size="large" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Create Account
            </Button>

            <Divider plain>Or continue with</Divider>

            <Space direction="vertical" className="w-full" size="middle">
              <Button
                icon={<GoogleOutlined />}
                block
                size="large"
                onClick={() => handleOAuthLogin("google")}
              >
                Sign up with Google
              </Button>
              <Button
                icon={<GithubOutlined />}
                block
                size="large"
                onClick={() => handleOAuthLogin("github")}
              >
                Sign up with GitHub
              </Button>
            </Space>

            <p className="text-sm text-center mt-4 text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="hover:underline font-medium text-blue-600"
              >
                Sign in
              </Link>
            </p>
          </Form>
        ) : (
          <Form layout="vertical" onFinish={handleVerifyOtp}>
            <Form.Item label="OTP Code" required>
              <Input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                size="large"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Verify OTP
            </Button>
            <Button
              type="link"
              block
              onClick={handleResendOtp}
              disabled={loading}
              className="mt-2"
            >
              Resend OTP
            </Button>
          </Form>
        )}
      </Card>
    </div>
  );
}
