import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Card,
  Input,
  Switch,
  Button,
  Form,
  message,
  Typography,
  Space,
  Divider,
  List,
} from 'antd';
import {
  SaveOutlined,
  DatabaseOutlined,
  DownloadOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function SystemSettings() {
  const [form] = Form.useForm();

  const handleSave = () => {
    message.success('Settings saved successfully');
  };

  const handleBackup = () => {
    message.success('Backup initiated');
  };

  const handleRestore = () => {
    message.info('Restore functionality (simulated)');
  };

  const backups = [
    { date: '2024-03-15 14:30', size: '245 MB' },
    { date: '2024-03-14 14:30', size: '243 MB' },
    { date: '2024-03-13 14:30', size: '240 MB' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <Title level={2}>System Settings</Title>
          <Text type="secondary">Configure platform settings</Text>
        </div>

        {/* General Settings */}
        <Card title="General Settings" bordered>
          <Form
            layout="vertical"
            form={form}
            initialValues={{
              siteName: 'LearnHub',
              siteDescription: 'Learn new skills with expert-led online courses',
              contactEmail: 'contact@learnhub.com',
            }}
            onFinish={handleSave}
          >
            <Form.Item
              label="Site Name"
              name="siteName"
              rules={[{ required: true, message: 'Please enter site name' }]}
            >
              <Input placeholder="Enter site name" />
            </Form.Item>

            <Form.Item
              label="Site Description"
              name="siteDescription"
              rules={[{ required: true, message: 'Please enter description' }]}
            >
              <Input.TextArea rows={3} placeholder="Enter site description" />
            </Form.Item>

            <Form.Item
              label="Contact Email"
              name="contactEmail"
              rules={[{ type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input placeholder="contact@example.com" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Save Settings
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Feature Toggles */}
        <Card title="Feature Toggles" bordered>
          <Space direction="vertical" size="large" className="w-full">
            <div className="flex items-center justify-between">
              <div>
                <Text strong>Course Reviews</Text>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  Allow students to review courses
                </Paragraph>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Text strong>Discussion Forums</Text>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  Enable course discussion boards
                </Paragraph>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Text strong>Certificates</Text>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  Issue certificates upon completion
                </Paragraph>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Text strong>New User Registration</Text>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  Allow new users to register
                </Paragraph>
              </div>
              <Switch defaultChecked />
            </div>
          </Space>
        </Card>

        {/* Backup & Restore */}
        <Card
          title={
            <span className="flex items-center gap-2">
              <DatabaseOutlined />
              Backup & Restore
            </span>
          }
          bordered
        >
          <Paragraph type="secondary">
            Create backups of your database and restore from previous backups
          </Paragraph>

          <Space>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleBackup}
            >
              Create Backup
            </Button>
            <Button onClick={handleRestore}>Restore from Backup</Button>
          </Space>

          <Divider />

          <Title level={5}>Recent Backups</Title>

          <List
            itemLayout="horizontal"
            dataSource={backups}
            renderItem={(backup) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    icon={<DownloadOutlined />}
                    key="download"
                  />,
                ]}
              >
                <List.Item.Meta
                  title={backup.date}
                  description={<Text type="secondary">{backup.size}</Text>}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
