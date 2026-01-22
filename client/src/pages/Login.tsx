import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Card, Form, message, Divider, Space } from "antd";
import { GithubOutlined, GoogleOutlined } from "@ant-design/icons";
import { GraduationCap } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { loginUser } from "@/features/auth/authThunks";
import { setPendingVerification } from "@/features/auth/authSlice";
import type { RootState } from "../app/store";
// import { useAuthCheck } from "@/hooks/useAuthCheck";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state: RootState) => state.auth);
  const API_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  // // 🔔 Redirect if already authenticated
  // useAuthCheck();

  // Show login errors
  useEffect(() => {
    if (error) message.error(error);
  }, [error]);

  // Local login
  const handleSubmit = async () => {
    if (!email || !password) return message.warning("Please fill all fields!");
    try {
      const res = await dispatch(loginUser({ email, password })).unwrap();
      message.success("Login successful!");
      // Redirect based on role
      if (res.user.role === "student") navigate("/student");
      else if (res.user.role === "instructor") navigate("/instructor");
      else if (res.user.role === "admin") navigate("/admin");
      else if (res.user.role === "superadmin") navigate("/superadmin");
    } catch (err: any) {
      if (err?.needsVerification) {
        dispatch(
          setPendingVerification({
            userId: err.userId,
            email: err.email || email,
          }),
        );
        message.warning(
          err?.message || "Please verify your email before signing in.",
        );
        navigate("/verify", {
          state: { email: err.email || email, userId: err.userId },
          replace: true,
        });
        return;
      }

      message.error(err?.message || err || "Invalid credentials");
    }
  };

  // OAuth login
  const handleOAuthLogin = (provider: "google" | "github") => {
    // Opens full page OAuth login
    window.location.href = `${API_ORIGIN}/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-600">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Welcome to LearnHub</h2>
          <p className="text-gray-500">
            Sign in to continue your learning journey
          </p>
        </div>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Email" required>
            <Input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="large"
            />
          </Form.Item>

          <Form.Item label="Password" required>
            <Input.Password
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>Or continue with</Divider>

        <Space direction="vertical" className="w-full" size="middle">
          <Button
            icon={<GoogleOutlined />}
            block
            size="large"
            onClick={() => handleOAuthLogin("google")}
          >
            Sign in with Google
          </Button>
          <Button
            icon={<GithubOutlined />}
            block
            size="large"
            onClick={() => handleOAuthLogin("github")}
          >
            Sign in with GitHub
          </Button>
        </Space>

        <p
          className="text-sm text-center mt-4"
          style={{ color: "hsl(215 16% 47%)" }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ color: "hsl(221 83% 53%)" }}
            className="hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </Card>
    </div>
  );
}
