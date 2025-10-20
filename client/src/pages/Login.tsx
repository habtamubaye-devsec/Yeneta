import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, Form, message, Divider, Space } from 'antd';
import { GithubOutlined, GoogleOutlined } from '@ant-design/icons';
import { GraduationCap } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { loginUser } from '@/features/auth/authThunks';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`); // auto-route based on role
    }
  }, [user, navigate]);

  const handleSubmit = async () => {
    if (!email || !password) return message.warning('Please fill all fields!');
    const res = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(res)) message.success('Login successful!');
    else message.error('Invalid credentials');
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
          <p className="text-gray-500">Sign in to continue your learning journey</p>
        </div>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Email" required>
            <Input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} size="large" />
          </Form.Item>

          <Form.Item label="Password" required>
            <Input.Password placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Sign In
            </Button>
          </Form.Item>

          <Divider plain>Or continue with</Divider>
          <Space direction="vertical" className="w-full" size="middle">
            <Button icon={<GoogleOutlined />} block size="large" onClick={() => message.info('Google authentication coming soon')}>
              Sign in with Google
            </Button>
            <Button icon={<GithubOutlined />} block size="large" onClick={() => message.info('GitHub authentication coming soon')}>
              Sign in with GitHub
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
