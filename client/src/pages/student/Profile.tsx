import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Avatar, Form, message } from 'antd';
import { CameraOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';

const { TextArea } = Input;

export default function Profile() {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const handleSave = () => {
    message.success('Profile updated successfully!');
  };

  const handlePasswordChange = () => {
    message.success('Password updated successfully!');
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '768px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '8px' }}>Profile Settings</h1>
          <p style={{ color: 'hsl(215 16% 47%)' }}>Manage your account information</p>
        </div>

        <Card title="Profile Information">
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
            <Avatar size={96} style={{ background: 'hsl(221 83% 53%)' }}>{user?.name?.[0]}</Avatar>
            <div>
              <Button icon={<CameraOutlined />}>Change Avatar</Button>
              <p style={{ fontSize: '14px', color: 'hsl(215 16% 47%)', marginTop: '8px' }}>
                JPG, PNG or GIF. Max 2MB
              </p>
            </div>
          </div>

          <Form form={form} layout="vertical" onFinish={handleSave} initialValues={{ name: user?.name, email: user?.email }}>
            <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
              <Input size="large" type="email" />
            </Form.Item>

            <Form.Item label="Bio" name="bio">
              <TextArea rows={4} placeholder="Tell us about yourself..." />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} block size="large">
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="Change Password">
          <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange}>
            <Form.Item label="Current Password" name="current" rules={[{ required: true }]}>
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item label="New Password" name="new" rules={[{ required: true, min: 6 }]}>
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item 
              label="Confirm Password" 
              name="confirm" 
              dependencies={['new']}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('new') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
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
