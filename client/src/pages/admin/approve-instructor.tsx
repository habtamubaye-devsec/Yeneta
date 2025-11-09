import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  Input,
  Table,
  Space,
  Button,
  Popconfirm,
  message,
  Avatar,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  fetchInstructorRequests,
  approveInstructor,
  rejectInstructorRequest,
} from "@/features/user/userThunks";
import type { RootState, AppDispatch } from "@/app/store";

export default function ApproveInstructor() {
  const dispatch = useDispatch<AppDispatch>();
  const { requests, loading } = useSelector((state: RootState) => state.users);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch instructor requests
  useEffect(() => {
    dispatch(fetchInstructorRequests());
  }, [dispatch]);

  // ✅ Filter requests by name or email
  const filtered = requests.filter(
    (user: any) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Approve
  const handleApprove = async (id: string) => {
    try {
      await dispatch(approveInstructor(id)).unwrap();
      message.success("Instructor approved successfully!");
    } catch (err) {
      message.error("Failed to approve instructor");
    }
  };

  // ❌ Reject
  const handleReject = async (id: string) => {
    try {
      await dispatch(rejectInstructorRequest(id)).unwrap();
      message.success("Instructor request rejected.");
    } catch (err) {
      message.error("Failed to reject instructor request");
    }
  };

  // ✅ Columns (no status column)
  const columns = [
    {
      title: "Profile",
      dataIndex: "profileImage",
      key: "profileImage",
      render: (img: string) => <Avatar src={img} />,
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <b>{text}</b>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Requested At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) =>
        new Date(createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, user: any) => (
        <Space>
          <Popconfirm
            title="Approve this instructor?"
            onConfirm={() => handleApprove(user._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" icon={<CheckOutlined />} />
          </Popconfirm>
          <Popconfirm
            title="Reject this instructor request?"
            onConfirm={() => handleReject(user._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<CloseOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Approve Instructor Requests</h1>
        <p className="text-gray-500">
          Review and manage instructor requests from students.
        </p>

        <Card>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: 300, marginBottom: 20 }}
          />

          <Table
            rowKey="_id"
            columns={columns}
            dataSource={filtered}
            loading={loading}
            pagination={{ pageSize: 7 }}
            bordered
            scroll={{
              y: 900, // vertical scroll height
              x: 800, // horizontal scroll if many columns (optional)
            }}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
