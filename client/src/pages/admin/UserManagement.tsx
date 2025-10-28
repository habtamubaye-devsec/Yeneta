import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from 'antd';
import { Button, Input, Select, Table, Tag, Space, message } from 'antd';
import { SearchOutlined, UserAddOutlined, StopOutlined, SafetyOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student', status: 'active', joinedDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'instructor', status: 'pending', joinedDate: '2024-01-14' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'student', status: 'active', joinedDate: '2024-01-14' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'instructor', status: 'active', joinedDate: '2024-01-13' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'student', status: 'banned', joinedDate: '2024-01-12' },
  ];

  const handleApprove = (userId: number) => {
    message.success('User approved successfully');
  };

  const handleBan = (userId: number) => {
    message.success('User banned successfully');
  };

  const handleUnban = (userId: number) => {
    message.success('User unbanned successfully');
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <b>{text}</b>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color =
          status === 'active' ? 'green' : status === 'pending' ? 'gold' : 'red';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Joined',
      dataIndex: 'joinedDate',
      key: 'joinedDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, user: any) => (
        <Space>
          {user.status === 'pending' && (
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => handleApprove(user.id)}
            />
          )}
          {user.status === 'active' && (
            <Button
              danger
              icon={<StopOutlined />}
              onClick={() => handleBan(user.id)}
            />
          )}
          {user.status === 'banned' && (
            <Button
              type="default"
              icon={<SafetyOutlined />}
              onClick={() => handleUnban(user.id)}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, approve instructors, and moderate accounts
          </p>
        </div>

        <Card title="All Users" bordered={true}>
          <div className="flex gap-4 mb-6">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: 300 }}
            />
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: 200 }}
            >
              <Option value="all">All Roles</Option>
              <Option value="student">Student</Option>
              <Option value="instructor">Instructor</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </div>

          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredUsers}
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
