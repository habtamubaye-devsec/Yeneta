import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button, Input, Card, Select, Form, message, Divider, Space } from 'antd';
import { GithubOutlined, GoogleOutlined } from '@ant-design/icons';
import { GraduationCap } from 'lucide-react';

const { Option } = Select;

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}`);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      message.error('Password must be at least 6 characters');
      return;
    }

    try {
      await register(email, password, name, role);
      message.success('Registration successful! Please verify your email.');
    } catch (error) {
      message.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="space-y-1 text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full" style={{ background: 'hsl(221 83% 53%)' }}>
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Create your account</h2>
          <p style={{ color: 'hsl(215 16% 47%)' }}>Start your learning journey today</p>
        </div>
        
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Full Name" required>
            <Input
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="large"
            />
          </Form.Item>

          <Form.Item label="Email" required>
            <Input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="large"
            />
          </Form.Item>

          <Form.Item label="I want to" required>
            <Select value={role} onChange={(value: UserRole) => setRole(value)} size="large">
              <Option value="student">Learn (Student)</Option>
              <Option value="instructor">Teach (Instructor)</Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="Password" required>
            <Input.Password
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="large"
            />
          </Form.Item>
          
          <Form.Item label="Confirm Password" required>
            <Input.Password
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Create Account
            </Button>
          </Form.Item>

          <Divider plain>Or continue with</Divider>

          <Space direction="vertical" className="w-full" size="middle">
            <Button 
              icon={<GoogleOutlined />} 
              block 
              size="large"
              onClick={() => message.info('Google authentication will be configured')}
            >
              Sign up with Google
            </Button>
            <Button 
              icon={<GithubOutlined />} 
              block 
              size="large"
              onClick={() => message.info('GitHub authentication will be configured')}
            >
              Sign up with GitHub
            </Button>
          </Space>
          
          <p className="text-sm text-center mt-4" style={{ color: 'hsl(215 16% 47%)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'hsl(221 83% 53%)' }} className="hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </Form>
      </Card>
    </div>
  );
}
