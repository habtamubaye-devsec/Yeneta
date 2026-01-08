import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Card, Form, Input, Button, Typography, Alert, message } from "antd";
import { ShieldCheck } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { verifyOtp, resendOtp } from "@/features/auth/authThunks";
import { setPendingVerification } from "@/features/auth/authSlice";

interface LocationState {
  email?: string;
  userId?: string;
}

const VerifyAccount = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { pendingVerification, loading } = useAppSelector((state) => state.auth);
  const [userId, setUserId] = useState<string | null>(pendingVerification?.userId || null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendInfo, setResendInfo] = useState<string | null>(null);

  const locationState = useMemo(() => location.state as LocationState | null, [location.state]);

  useEffect(() => {
    const resolvedEmail = locationState?.email || pendingVerification?.email || null;
    const resolvedUserId = locationState?.userId || pendingVerification?.userId || null;

    if (resolvedEmail) {
      form.setFieldsValue({ email: resolvedEmail });
    }
    setUserId(resolvedUserId);

    // Sync any incoming location data back to redux for persistence
    if (resolvedEmail || resolvedUserId) {
      dispatch(setPendingVerification({ email: resolvedEmail, userId: resolvedUserId }));
    }
  }, [dispatch, form, locationState, pendingVerification?.email, pendingVerification?.userId]);

  const handleVerify = async (values: { email: string; otp: string }) => {
    if (!values.email) return message.error("Please enter your email");
    if (!values.otp) return message.error("Please enter the OTP code");

    try {
      await dispatch(
        verifyOtp({
          email: values.email,
          userId: userId || undefined,
          otp: values.otp,
        })
      ).unwrap();

      message.success("Email verified successfully. You can sign in now.");
      dispatch(setPendingVerification(null));
      navigate("/login", { replace: true });
    } catch (err: any) {
      message.error(err?.message || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    const email = form.getFieldValue("email");
    if (!email) return message.error("Enter your email to resend the code");

    try {
      setResendInfo(null);
      setResendLoading(true);
      const res = await dispatch(resendOtp({ email })).unwrap();
      const msg = res?.message || "A new OTP has been sent to your email";
      setResendInfo(msg);
      message.success(msg);
    } catch (err: any) {
      message.error(err?.message || "Could not resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="space-y-1 text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-600">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
          </div>
          <Typography.Title level={3} style={{ marginBottom: 0 }}>
            Verify your account
          </Typography.Title>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Enter the code we sent to your email to activate your account.
          </Typography.Paragraph>
        </div>

        <Alert
          message="Haven't received the code?"
          description="Check your spam folder or resend a fresh code."
          type="info"
          showIcon
          className="mb-4"
        />

        {resendInfo ? (
          <Alert
            message={resendInfo}
            type="success"
            showIcon
            className="mb-4"
          />
        ) : null}

        <Form layout="vertical" form={form} onFinish={handleVerify}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input type="email" placeholder="you@example.com" size="large" />
          </Form.Item>

          <Form.Item
            label="OTP Code"
            name="otp"
            rules={[{ required: true, message: "Please enter the OTP code" }]}
          >
            <Input
              placeholder="6-digit code"
              size="large"
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            className="mb-2"
          >
            Verify and Continue
          </Button>

          <Button
            block
            size="large"
            onClick={handleResend}
            disabled={loading || resendLoading}
            loading={resendLoading}
          >
            Resend OTP
          </Button>
        </Form>

        <p className="text-sm text-center mt-4 text-gray-500">
          Already verified? <Link to="/login" className="text-blue-600">Go to login</Link>
        </p>
      </Card>
    </div>
  );
};

export default VerifyAccount;
