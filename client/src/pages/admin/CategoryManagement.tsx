import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Spin,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
} from '@ant-design/icons';

import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
} from '../../features/categories/categoryThunks';
import { clearSelectedCategory, setSelectedCategory } from '../../features/categories/categorySlice';
import type { RootState, AppDispatch } from '@/app/store';

const { Title, Text } = Typography;

export default function CategoryManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, selectedCategory, loading, error } = useSelector(
    (state: RootState) => state.categories
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({ name: '', description: '', subCategories: [] });
  const [subCategoryInput, setSubCategoryInput] = useState('');
  const [editSubCategoryInput, setEditSubCategoryInput] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) message.error(error);
  }, [error]);

  // Add Category
  const handleAddCategory = async () => {
    if (!newCategory.name) {
      message.warning('Please enter a category name');
      return;
    }
    try {
      await dispatch(createCategory(newCategory as Category)).unwrap();
      setIsAddModalOpen(false);
      setNewCategory({ name: '', description: '', subCategories: [] });
      setSubCategoryInput('');
      message.success('Category added successfully');
    } catch (err) {
      console.error(err);
    }
  };

  // Edit Category
  const handleEditCategory = async () => {
    if (!selectedCategory?.name) {
      message.warning('Category name cannot be empty');
      return;
    }
    try {
      await dispatch(updateCategory({ id: selectedCategory._id!, updates: selectedCategory })).unwrap();
      setIsEditModalOpen(false);
      dispatch(clearSelectedCategory());
      setEditSubCategoryInput('');
      message.success('Category updated successfully');
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
      message.success('Category deleted successfully');
    } catch (err) {
      console.error(err);
    }
  };

  // Open modals
  const openAddModal = () => {
    setNewCategory({ name: '', description: '', subCategories: [] });
    setSubCategoryInput('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    dispatch(setSelectedCategory(category));
    setEditSubCategoryInput('');
    setIsEditModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
          <div>
            <Title level={2}>Category Management</Title>
            <Text type="secondary">Organize courses into categories</Text>
          </div>

          <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
            Add Category
          </Button>
        </div>

        <Card title="All Categories" bordered>
          {loading ? (
            <Spin tip="Loading categories..." />
          ) : (
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
                      onClick={() => handleDeleteCategory(category._id!)}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<FolderOutlined style={{ fontSize: 20, color: '#1677ff' }} />}
                    title={<Text strong>{category.name}</Text>}
                    description={
                      <Text type="secondary">
                        <div className='text-justify'>
                          <b>Subcategories: </b>{(category.subCategories || []).map((sub: string) => sub).join(', ') || 'None'}
                        </div>
                        <div className='text-justify'><b>Description: </b>{category.description || 'No description'}</div>
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          )}
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
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </div>

            <div>
              <Text strong>Description</Text>
              <Input.TextArea
                placeholder="Add category description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Text strong>Subcategories</Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                {(newCategory.subCategories || []).map((sub, idx) => (
                  <Tag
                    key={idx}
                    closable
                    onClose={() =>
                      setNewCategory({
                        ...newCategory,
                        subCategories: (newCategory.subCategories || []).filter((s) => s !== sub),
                      })
                    }
                  >
                    {sub}
                  </Tag>
                ))}
              </div>
              <Input
                placeholder="Type and press comma or Enter"
                value={subCategoryInput}
                onChange={(e) => setSubCategoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    const val = subCategoryInput.trim();
                    if (val && !(newCategory.subCategories || []).includes(val)) {
                      setNewCategory({
                        ...newCategory,
                        subCategories: [...(newCategory.subCategories || []), val],
                      });
                    }
                    setSubCategoryInput('');
                  }
                }}
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
                    dispatch(setSelectedCategory({ ...selectedCategory, name: e.target.value }))
                  }
                />
              </div>

              <div>
                <Text strong>Description</Text>
                <Input.TextArea
                  value={selectedCategory.description}
                  onChange={(e) =>
                    dispatch(setSelectedCategory({ ...selectedCategory, description: e.target.value }))
                  }
                  rows={3}
                />
              </div>

              <div>
                <Text strong>Subcategories</Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                  {(selectedCategory.subCategories || []).map((sub, idx) => (
                    <Tag
                      key={idx}
                      closable
                      onClose={() =>
                        dispatch(
                          setSelectedCategory({
                            ...selectedCategory,
                            subCategories: selectedCategory.subCategories!.filter((s) => s !== sub),
                          })
                        )
                      }
                    >
                      {sub}
                    </Tag>
                  ))}
                </div>
                <Input
                  placeholder="Type and press comma or Enter"
                  value={editSubCategoryInput}
                  onChange={(e) => setEditSubCategoryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      const val = editSubCategoryInput.trim();
                      if (val && !(selectedCategory.subCategories || []).includes(val)) {
                        dispatch(
                          setSelectedCategory({
                            ...selectedCategory,
                            subCategories: [...selectedCategory.subCategories!, val],
                          })
                        );
                      }
                      setEditSubCategoryInput('');
                    }
                  }}
                />
              </div>
            </Space>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
