import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  Input,
  Table,
  Tag,
  Space,
  Popconfirm,
  message,
} from "antd";
import {
  SearchOutlined,
  StopOutlined,
  SafetyOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { fetchUsers, banAndUnbanUser, deleteUser } from "../../features/user/userThunks";
import type { RootState, AppDispatch } from "../../app/store";

export default function UserManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((state: RootState) => state.users);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // ✅ Action handlers
  const handleBanUnban = async (user: any) => {
    try {
      await dispatch(
        banAndUnbanUser({
          userId: user._id,
          status: user.status === "banned" ? "active" : "banned",
        })
      ).unwrap();

      message.success(
        `User ${user.status === "banned" ? "unbanned" : "banned"} successfully`
      );
    } catch (err) {
      message.error("Action failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      message.success("User deleted successfully");
    } catch (err) {
      message.error("Failed to delete user");
    }
  };

  // ✅ Search filtering
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 120,
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      render: (text: string) => <b>{text}</b>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      sorter: (a: any, b: any) => a.email.localeCompare(b.email),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      filters: [
        { text: "Student", value: "student" },
        { text: "Instructor", value: "instructor" },
      ],
      onFilter: (value: any, record: any) => record.role === value,
      render: (role: string) => {
        const color = role === "instructor" ? "blue" : "green";
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      filters: [
        { text: "Active", value: "active" },
        { text: "Banned", value: "banned" },
      ],
      onFilter: (value: any, record: any) => record.status === value,
      render: (status: string) => {
        const color = status === "active" ? "green" : "gold";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Joined",
      key: "createdAt",
      width: 180,
      sorter: (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (_: any, user: any) =>
        user.createdAt
          ? new Date(user.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, user: any) => (
        <Space>
          <Popconfirm
            title={`Are you sure you want to ${user.status === "banned" ? "unban" : "ban"} this user?`}
            onConfirm={() => handleBanUnban(user)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            {user.status === "active" ? (
              <StopOutlined style={{ color: "red", fontSize: 20, cursor: "pointer" }} />
            ) : (
              <SafetyOutlined style={{ color: "green", fontSize: 24, cursor: "pointer" }} />
            )}
          </Popconfirm>

          <Popconfirm
            title="Are you sure you want to permanently delete this user?"
            onConfirm={() => handleDelete(user._id)}
            okText="Yes"
            cancelText="No"
            placement="topRight"
          >
            <DeleteOutlined style={{ color: "red", fontSize: 20, cursor: "pointer" }} />
          </Popconfirm>
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
            Manage students and instructors — ban, unban, or delete accounts.
          </p>
        </div>

        <Card title="All Users">
          <div className="flex gap-4 mb-6 flex-wrap">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: 300 }}
            />
          </div>

          <Table
            rowKey="_id"
            columns={columns}
            dataSource={filteredUsers}
            loading={loading}
            pagination={{ pageSize: 7 }}
            scroll={{ x: 1000, y: 400 }}
            bordered
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
