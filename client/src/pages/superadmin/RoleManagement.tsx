import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Card,
  Avatar,
  Tag,
  Select,
  Typography,
  message,
  Space,
  List,
  Divider,
} from 'antd';
import { UserSwitchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

export default function RoleManagement() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'instructor',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    },
    {
      id: 3,
      name: 'Mike Admin',
      email: 'mike@example.com',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    },
  ]);

  const updateRole = (id: number, newRole: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    message.success(`User role updated to ${newRole}`);
  };

  const roleColors: Record<string, string> = {
    student: 'blue',
    instructor: 'green',
    admin: 'orange',
    superadmin: 'red',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <Title level={2}>Role Management</Title>
          <Text type="secondary">Manage user roles and permissions</Text>
        </div>

        {/* User List */}
        <List
          dataSource={users}
          split
          renderItem={(user) => (
            <Card key={user.id} style={{ marginBottom: 16 }}>
              <Space align="center" className="w-full" wrap>
                <Avatar size={48} src={user.avatar}>
                  {user.name[0]}
                </Avatar>

                <div style={{ flex: 1, minWidth: 150 }}>
                  <Text strong>{user.name}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {user.email}
                  </Text>
                </div>

                <Tag
                  color={roleColors[user.role] || 'default'}
                  style={{ textTransform: 'capitalize' }}
                >
                  Current: {user.role}
                </Tag>

                <Select
                  defaultValue={user.role}
                  style={{ width: 160 }}
                  onChange={(value) => updateRole(user.id, value)}
                >
                  <Option value="student">Student</Option>
                  <Option value="instructor">Instructor</Option>
                  <Option value="admin">Admin</Option>
                  <Option value="superadmin">SuperAdmin</Option>
                </Select>
              </Space>
            </Card>
          )}
        />

        {/* Role Hierarchy */}
        <Card style={{ background: '#fafafa' }}>
          <Space align="start" size="large">
            <UserSwitchOutlined style={{ fontSize: 24, color: '#1677ff' }} />
            <div>
              <Title level={4}>Role Hierarchy</Title>
              <Divider style={{ margin: '8px 0' }} />
              <ul style={{ listStyle: 'disc', paddingLeft: 20 }}>
                <li>
                  <Text strong>SuperAdmin:</Text> Full system access and user
                  management
                </li>
                <li>
                  <Text strong>Admin:</Text> User and course management,
                  moderation
                </li>
                <li>
                  <Text strong>Instructor:</Text> Create and manage own courses
                </li>
                <li>
                  <Text strong>Student:</Text> Enroll in courses and participate
                </li>
              </ul>
            </div>
          </Space>
        </Card>
      </div>
    </DashboardLayout>
  );
}
