import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Card,
  Button,
  Input,
  Modal,
  Typography,
  List,
  Space,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function CategoryManagement() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Web Development', courses: 45, slug: 'web-development' },
    { id: 2, name: 'Mobile Development', courses: 23, slug: 'mobile-development' },
    { id: 3, name: 'Data Science', courses: 34, slug: 'data-science' },
    { id: 4, name: 'UI/UX Design', courses: 18, slug: 'ui-ux-design' },
    { id: 5, name: 'Business', courses: 27, slug: 'business' },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });

  const openAddModal = () => {
    setNewCategory({ name: '', slug: '' });
    setIsAddModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.slug) {
      message.warning('Please fill all fields');
      return;
    }
    setCategories([
      ...categories,
      {
        id: categories.length + 1,
        name: newCategory.name,
        slug: newCategory.slug,
        courses: 0,
      },
    ]);
    setIsAddModalOpen(false);
    message.success('Category added successfully');
  };

  const handleEditCategory = () => {
    setCategories(
      categories.map((c) =>
        c.id === selectedCategory.id ? selectedCategory : c
      )
    );
    setIsEditModalOpen(false);
    message.success('Category updated successfully');
  };

  const deleteCategory = (id: number) => {
    setCategories(categories.filter((c) => c.id !== id));
    message.success('Category deleted');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Title level={2}>Category Management</Title>
            <Text type="secondary">Organize courses into categories</Text>
          </div>

          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            Add Category
          </Button>
        </div>

        <Card title="All Categories" bordered>
          <List
            dataSource={categories}
            renderItem={(category) => (
              <List.Item
                actions={[
                  <Button
                    key="edit"
                    icon={<EditOutlined />}
                    type="text"
                    onClick={() => openEditModal(category)}
                  />,
                  <Button
                    key="delete"
                    danger
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => deleteCategory(category.id)}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <FolderOutlined style={{ fontSize: 20, color: '#1677ff' }} />
                  }
                  title={<Text strong>{category.name}</Text>}
                  description={
                    <Text type="secondary">
                      {category.courses} courses • {category.slug}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        {/* Add Category Modal */}
        <Modal
          title="Add New Category"
          open={isAddModalOpen}
          onCancel={() => setIsAddModalOpen(false)}
          onOk={handleAddCategory}
          okText="Create Category"
        >
          <Space direction="vertical" className="w-full" size="large">
            <div>
              <Text strong>Category Name</Text>
              <Input
                placeholder="e.g. Web Development"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
            </div>
            <div>
              <Text strong>Slug</Text>
              <Input
                placeholder="e.g. web-development"
                value={newCategory.slug}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, slug: e.target.value })
                }
              />
            </div>
          </Space>
        </Modal>

        {/* Edit Category Modal */}
        <Modal
          title="Edit Category"
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          onOk={handleEditCategory}
          okText="Save Changes"
        >
          {selectedCategory && (
            <Space direction="vertical" className="w-full" size="large">
              <div>
                <Text strong>Category Name</Text>
                <Input
                  value={selectedCategory.name}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Text strong>Slug</Text>
                <Input
                  value={selectedCategory.slug}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      slug: e.target.value,
                    })
                  }
                />
              </div>
            </Space>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
