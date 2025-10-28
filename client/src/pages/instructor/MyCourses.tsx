import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  Star,
  Edit,
  Trash2,
  Plus,
  UploadCloud,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchCourses,
  deleteCourse,
  updateCourse,
  togglePublishCourse,
} from "@/features/courses/courseThunks";
import { message, Spin, Modal, Form, Input, Select, Upload, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { fetchCategories } from "@/features/categories/categoryThunks";

const { Option } = Select;

export default function MyCourses() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading } = useSelector((state: RootState) => state.courses);
  const { categories, loading: categoryLoading } = useSelector(
    (state: RootState) => state.categories
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Delete Course
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteCourse(id)).unwrap();
      message.success("✅ Course deleted successfully");
      dispatch(fetchCourses());
    } catch {
      message.error("❌ Failed to delete course");
    }
  };

  // Open Edit Modal
  const openEditModal = (course: any) => {
    setSelectedCourse(course);
    setSelectedCategory(course.category?._id || course.category);
    setPreview(course.thumbnailUrl || "");
    setFile(null); // reset previously selected file

    form.setFieldsValue({
      title: course.title,
      description: course.description,
      category: course.category?._id || course.category,
      subCategories: course.subCategories || [],
      level: course.level,
      price: course.price,
    });

    setIsEditModalOpen(true);
  };

  const handleBeforeUpload = (file: File) => {
    setFile(file);
    setPreview(URL.createObjectURL(file));
    return false;
  };

  // Update Course
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(`${key}[]`, v)); // <-- ensures array is sent
        } else {
          formData.append(key, value as string);
        }
      });

      if (file) formData.append("thumbnail", file);

      await dispatch(
        updateCourse({ id: selectedCourse._id, formData })
      ).unwrap();
      message.success("✅ Course updated successfully");
      setIsEditModalOpen(false);
      dispatch(fetchCourses());
    } catch (err: any) {
      message.error(err?.message || "❌ Failed to update course");
    }
  };

  // Publish / Unpublish
  const handleTogglePublish = async (course: any) => {
    try {
      await dispatch(togglePublishCourse(course._id)).unwrap();
      console.log(course.published);

      message.success(
        course.published
          ? "Course unpublished successfully"
          : "Course published successfully"
      );

      dispatch(fetchCourses());
    } catch (error: any) {
      message.error(error?.message || "Failed to change publish status");
    }
  };

  const selectedCategoryObj = categories.find(
    (cat) => cat._id === selectedCategory
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Courses</h1>
            <p className="text-muted-foreground">
              Manage, edit, and publish your courses
            </p>
          </div>
          <Link to="/instructor/create-course" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create New Course
            </Button>
          </Link>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses.map((course) => (
              <Card
                key={course._id}
                className="flex flex-col gap-4 p-4 bg-white border-0 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <img
                  src={course.thumbnailUrl || "/placeholder.png"}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="font-bold text-lg line-clamp-2">
                      {course.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <Badge
                      variant={course.published ? "default" : "secondary"}
                      className="w-fit"
                    >
                      {course.published ? (
                        <p className=" text-green-400 text-sm">
                          Published
                        </p>
                      ) : (
                        <p className=" text-red-400">
                          Unpublished
                        </p>
                      )}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />{" "}
                      {course.lessons?.length || 0} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />{" "}
                      {course.students?.length || 0} students
                    </span>
                    {course.status === "published" && (
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />{" "}
                        {course.rating || 0}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-3">
                    <Button
                      variant="outline"
                      className="flex-1 min-w-[100px]"
                      onClick={() => openEditModal(course)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Link
                      to={`/instructor/courses/${course._id}`}
                      className="flex-1 min-w-[100px]"
                    >
                      <Button variant="secondary" className="w-full">
                        Manage Lessons
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="flex-1 min-w-[100px]"
                      onClick={() => handleTogglePublish(course)}
                    >
                      <UploadCloud className="h-4 w-4 mr-1" />
                      {course.published
                        ? "Unpublish"
                        : "Publish"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(course._id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No courses found
            </p>
          )}
        </div>
      </div>

      {/* Inline Edit Modal */}
      <Modal
        title="Edit Course"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleUpdate}
        okText="Save Changes"
        width={800}
        centered
      >
        {categoryLoading ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <Form layout="vertical" form={form}>
            <Form.Item
              name="title"
              label="Course Title"
              rules={[{ required: true, message: "Please enter course title" }]}
            >
              <Input placeholder="Enter course title" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Course Description"
              rules={[
                { required: true, message: "Please enter course description" },
              ]}
            >
              <Input.TextArea rows={3} placeholder="Enter course description" />
            </Form.Item>

            <Form.Item name="category" label="Category">
              <Select
                placeholder="Select category"
                value={selectedCategory}
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
              name="subCategory"
              label="Subcategory"
              rules={[
                { required: true, message: "Please select a subcategory" },
              ]}
            >
              <Select
                placeholder="Select subcategory"
                disabled={!selectedCategory}
              >
                {selectedCategoryObj?.subCategories?.length ? (
                  selectedCategoryObj.subCategories.map((sub) => (
                    <Option key={sub} value={sub}>
                      {sub}
                    </Option>
                  ))
                ) : (
                  <Option value="" disabled>
                    No subcategories available
                  </Option>
                )}
              </Select>
            </Form.Item>

            <Form.Item name="thumbnail" label="Thumbnail">
              {preview && (
                <div className="mb-2">
                  <Image src={preview} width={120} height={80} />
                </div>
              )}
              <Upload
                beforeUpload={handleBeforeUpload}
                maxCount={1}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
              </Upload>
            </Form.Item>

            <Form.Item name="level" label="Level">
              <Select placeholder="Select course level">
                <Option value="beginner">Beginner</Option>
                <Option value="intermediate">Intermediate</Option>
                <Option value="advanced">Advanced</Option>
              </Select>
            </Form.Item>

            <Form.Item name="price" label="Price">
              <Input type="number" placeholder="Enter price" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </DashboardLayout>
  );
}
