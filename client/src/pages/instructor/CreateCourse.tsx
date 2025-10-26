import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, Form, Input, Select, Button, Upload, message, Image, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { createCourse } from "@/features/courses/courseThunks";
import { fetchCategories } from "@/features/categories/categoryThunks";

const { Option } = Select;

export default function CreateCourse() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loading: courseLoading } = useSelector((state: RootState) => state.courses);
  const { categories, loading: categoryLoading } = useSelector(
    (state: RootState) => state.categories
  );

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [form] = Form.useForm();

  // ✅ Load categories from backend
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // ✅ Handle file manually
  const handleBeforeUpload = (file: File) => {
    setFile(file);
    setPreview(URL.createObjectURL(file));
    return false;
  };

  // ✅ Submit form
  const handleSubmit = async (values: any) => {
    if (!file) {
      message.error("Please upload a thumbnail image");
      return;
    }

    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      formData.append(key, value as string);
    }
    formData.append("thumbnail", file);

    try {
      await dispatch(createCourse(formData)).unwrap();
      message.success("✅ Course created successfully!");
      navigate("/instructor/courses");
    } catch (error: any) {
      message.error(error || "❌ Failed to create course.");
    }
  };

  if (categoryLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  // ✅ Find selected category from list
  const selectedCategoryObj = categories.find((cat) => cat._id === selectedCategory);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
          <p className="text-gray-500">Share your knowledge with students worldwide.</p>
        </div>

        <Card title="Course Details" bordered>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark="optional"
          >
            {/* Title */}
            <Form.Item
              label="Course Title"
              name="title"
              rules={[{ required: true, message: "Please enter the course title" }]}
            >
              <Input placeholder="e.g., Complete Web Development Bootcamp" />
            </Form.Item>

            {/* Description */}
            <Form.Item
              label="Course Description"
              name="description"
              rules={[{ required: true, message: "Please enter a description" }]}
            >
              <Input.TextArea placeholder="Describe what students will learn..." rows={5} />
            </Form.Item>

            {/* Category + Subcategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: "Please select a category" }]}
              >
                <Select
                  placeholder="Select category"
                  onChange={(value) => setSelectedCategory(value)}
                >
                  {categories.map((cat) => (
                    <Option key={cat._id} value={cat._id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Subcategory"
                name="subCategories"
                rules={[{ required: true, message: "Please select a subcategory" }]}
              >
                <Select placeholder="Select subcategory" disabled={!selectedCategory}>
                  {selectedCategoryObj?.subCategories?.length ? (
                    selectedCategoryObj.subCategories.map((sub) => (
                      <Option key={sub} value={sub}>
                        {sub}
                      </Option>
                    ))
                  ) : (
                    <Option value="none" disabled>
                      No subcategories available
                    </Option>
                  )}
                </Select>
              </Form.Item>
            </div>

            {/* Level */}
            <Form.Item
              label="Difficulty Level"
              name="level"
              rules={[{ required: true, message: "Please select difficulty level" }]}
            >
              <Select placeholder="Select level">
                <Option value="beginner">Beginner</Option>
                <Option value="intermediate">Intermediate</Option>
                <Option value="advanced">Advanced</Option>
              </Select>
            </Form.Item>

            {/* Price + Thumbnail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <Form.Item
                label="Price (USD)"
                name="price"
                rules={[{ required: true, message: "Please enter course price" }]}
              >
                <Input type="number" placeholder="49.99" min="0" step="0.01" />
              </Form.Item>

              <Form.Item
                label="Course Thumbnail"
                required
                tooltip="Upload an image for your course"
              >
                <div className="flex items-center gap-4">
                  <Upload
                    beforeUpload={handleBeforeUpload}
                    accept="image/*"
                    showUploadList={false}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>

                  {preview && (
                    <Image
                      src={preview}
                      alt="Thumbnail Preview"
                      width={80}
                      height={80}
                      style={{
                        borderRadius: "8px",
                        objectFit: "cover",
                        border: "1px solid #ddd",
                      }}
                    />
                  )}
                </div>
              </Form.Item>
            </div>

            <Form.Item>
              <div className="flex justify-end gap-4 mt-6">
                <Button onClick={() => navigate("/instructor")}>Cancel</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={courseLoading}
                  disabled={!file}
                >
                  Create Course
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
