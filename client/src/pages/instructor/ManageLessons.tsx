import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Button, Input, Select, Modal, Form, Upload, Typography, Space, Tooltip, App, Table } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HolderOutlined, PlayCircleOutlined, FileTextOutlined, LinkOutlined, FileOutlined, UploadOutlined } from '@ant-design/icons';
import { useParams, Link } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface Resource {
  id: string;
  name: string;
  type: 'file' | 'link';
  url: string;
  size?: string;
}

interface Lesson {
  id: number;
  title: string;
  type: string;
  duration: string;
  order: number;
  resources?: Resource[];
}

const SortableResourceItem = ({ resource, onDelete }: { resource: Resource; onDelete: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: resource.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-background border rounded-lg"
    >
      <HolderOutlined {...attributes} {...listeners} className="cursor-move text-muted" />
      {resource.type === 'file' ? <FileOutlined /> : <LinkOutlined />}
      <div className="flex-1">
        <Text strong>{resource.name}</Text>
        {resource.size && <Text type="secondary" className="text-xs ml-2">({resource.size})</Text>}
      </div>
      <Button type="text" danger icon={<DeleteOutlined />} onClick={onDelete} />
    </div>
  );
};

const SortableLessonItem = ({ lesson, onEdit, onDelete }: { lesson: Lesson; onEdit: () => void; onDelete: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 bg-card border rounded-lg"
    >
      <HolderOutlined {...attributes} {...listeners} className="cursor-move text-muted" />
      {lesson.type === 'video' ? <PlayCircleOutlined className="text-primary text-lg" /> : <FileTextOutlined className="text-primary text-lg" />}
      <div className="flex-1">
        <Text strong>{lesson.title}</Text>
        <br />
        <Text type="secondary" className="text-sm">
          {lesson.type} • {lesson.duration}
          {lesson.resources && lesson.resources.length > 0 && ` • ${lesson.resources.length} resources`}
        </Text>
      </div>
      <Space>
        <Button type="text" icon={<EditOutlined />} onClick={onEdit} />
        <Button type="text" danger icon={<DeleteOutlined />} onClick={onDelete} />
      </Space>
    </div>
  );
};

export default function ManageLessons() {
  const { courseId } = useParams();
  const { message } = App.useApp();
  const [lessons, setLessons] = useState<Lesson[]>([
    { id: 1, title: 'Introduction to React', type: 'video', duration: '15:30', order: 1, resources: [] },
    { id: 2, title: 'JSX and Components', type: 'video', duration: '20:15', order: 2, resources: [] },
    { id: 3, title: 'Props and State', type: 'video', duration: '18:45', order: 3, resources: [] },
    { id: 4, title: 'Hooks Overview', type: 'article', duration: '10 min', order: 4, resources: [] },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourceLink, setResourceLink] = useState('');
  const [resourceName, setResourceName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLessons((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleResourceDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setResources((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const deleteLesson = (id: number) => {
    setLessons(lessons.filter((l) => l.id !== id));
    message.success('Lesson deleted');
  };

  const handleAddLesson = () => {
    addForm.validateFields().then((values) => {
      const newLesson: Lesson = {
        id: Date.now(),
        title: values.title,
        type: values.type,
        duration: values.duration,
        order: lessons.length + 1,
        resources: resources,
      };
      setLessons([...lessons, newLesson]);
      message.success('Lesson added');
      setIsAddModalOpen(false);
      addForm.resetFields();
      setResources([]);
    });
  };

  const handleEditLesson = () => {
    if (!currentLesson) return;
    editForm.validateFields().then((values) => {
      setLessons(
        lessons.map((l) =>
          l.id === currentLesson.id
            ? { ...l, title: values.title, type: values.type, duration: values.duration, resources: resources }
            : l
        )
      );
      message.success('Lesson updated');
      setIsEditModalOpen(false);
      setCurrentLesson(null);
      setResources([]);
    });
  };

  const openEditModal = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setResources(lesson.resources || []);
    editForm.setFieldsValue({
      title: lesson.title,
      type: lesson.type,
      duration: lesson.duration,
    });
    setIsEditModalOpen(true);
  };

  const addResourceLink = () => {
    if (!resourceLink || !resourceName) {
      message.warning('Please enter both name and URL');
      return;
    }
    const newResource: Resource = {
      id: `resource-${Date.now()}`,
      name: resourceName,
      type: 'link',
      url: resourceLink,
    };
    setResources([...resources, newResource]);
    setResourceLink('');
    setResourceName('');
    message.success('Resource added');
  };

  const handleFileUpload = (file: File) => {
    const newResource: Resource = {
      id: `resource-${Date.now()}`,
      name: file.name,
      type: 'file',
      url: URL.createObjectURL(file),
      size: `${(file.size / 1024).toFixed(2)} KB`,
    };
    setResources([...resources, newResource]);
    message.success('File uploaded');
    return false;
  };

  const deleteResource = (id: string) => {
    setResources(resources.filter((r) => r.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/instructor/courses" className="text-sm text-muted-foreground hover:underline">
              ← Back to Courses
            </Link>
            <Title level={2} className="mt-2">Manage Lessons</Title>
            <Text type="secondary">React Fundamentals</Text>
          </div>

          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
            Add Lesson
          </Button>
        </div>

        <Card title={`Course Lessons (${lessons.length})`}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={lessons.map((l) => l.id)} strategy={verticalListSortingStrategy}>
              <Space direction="vertical" className="w-full" size="middle">
                {lessons.map((lesson) => (
                  <SortableLessonItem
                    key={lesson.id}
                    lesson={lesson}
                    onEdit={() => openEditModal(lesson)}
                    onDelete={() => deleteLesson(lesson.id)}
                  />
                ))}
              </Space>
            </SortableContext>
          </DndContext>
        </Card>

        {/* Add Lesson Modal */}
        <Modal
          title="Add New Lesson"
          open={isAddModalOpen}
          onOk={handleAddLesson}
          onCancel={() => {
            setIsAddModalOpen(false);
            addForm.resetFields();
            setResources([]);
          }}
          width={700}
        >
          <Form form={addForm} layout="vertical" className="mt-4">
            <Form.Item name="title" label="Lesson Title" rules={[{ required: true, message: 'Please enter lesson title' }]}>
              <Input placeholder="Introduction to..." />
            </Form.Item>

            <Form.Item name="type" label="Lesson Type" rules={[{ required: true, message: 'Please select lesson type' }]}>
              <Select placeholder="Select type">
                <Select.Option value="video">Video</Select.Option>
                <Select.Option value="article">Article</Select.Option>
                <Select.Option value="lab">Lab</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="duration" label="Duration" rules={[{ required: true, message: 'Please enter duration' }]}>
              <Input placeholder="15:30 or 10 min" />
            </Form.Item>

            <div className="mb-4">
              <Text strong>Resources</Text>
              <div className="mt-2 space-y-3">
                <Space.Compact style={{ width: '100%' }}>
                  <Input placeholder="Resource name" value={resourceName} onChange={(e) => setResourceName(e.target.value)} />
                  <Input placeholder="URL" value={resourceLink} onChange={(e) => setResourceLink(e.target.value)} />
                  <Button icon={<LinkOutlined />} onClick={addResourceLink}>Add Link</Button>
                </Space.Compact>

                <Upload beforeUpload={handleFileUpload} showUploadList={false}>
                  <Button icon={<UploadOutlined />} block>
                    Upload File
                  </Button>
                </Upload>

                {resources.length > 0 && (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleResourceDragEnd}>
                    <SortableContext items={resources.map((r) => r.id)} strategy={verticalListSortingStrategy}>
                      <Space direction="vertical" className="w-full" size="small">
                        {resources.map((resource) => (
                          <SortableResourceItem key={resource.id} resource={resource} onDelete={() => deleteResource(resource.id)} />
                        ))}
                      </Space>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>
          </Form>
        </Modal>

        {/* Edit Lesson Modal */}
        <Modal
          title="Edit Lesson"
          open={isEditModalOpen}
          onOk={handleEditLesson}
          onCancel={() => {
            setIsEditModalOpen(false);
            setCurrentLesson(null);
            setResources([]);
          }}
          width={700}
        >
          <Form form={editForm} layout="vertical" className="mt-4">
            <Form.Item name="title" label="Lesson Title" rules={[{ required: true, message: 'Please enter lesson title' }]}>
              <Input placeholder="Introduction to..." />
            </Form.Item>

            <Form.Item name="type" label="Lesson Type" rules={[{ required: true, message: 'Please select lesson type' }]}>
              <Select placeholder="Select type">
                <Select.Option value="video">Video</Select.Option>
                <Select.Option value="article">Article</Select.Option>
                <Select.Option value="lab">Lab</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="duration" label="Duration" rules={[{ required: true, message: 'Please enter duration' }]}>
              <Input placeholder="15:30 or 10 min" />
            </Form.Item>

            <div className="mb-4">
              <Text strong>Resources</Text>
              <div className="mt-2 space-y-3">
                <Space.Compact style={{ width: '100%' }}>
                  <Input placeholder="Resource name" value={resourceName} onChange={(e) => setResourceName(e.target.value)} />
                  <Input placeholder="URL" value={resourceLink} onChange={(e) => setResourceLink(e.target.value)} />
                  <Button icon={<LinkOutlined />} onClick={addResourceLink}>Add Link</Button>
                </Space.Compact>

                <Upload beforeUpload={handleFileUpload} showUploadList={false}>
                  <Button icon={<UploadOutlined />} block>
                    Upload File
                  </Button>
                </Upload>

                {resources.length > 0 && (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleResourceDragEnd}>
                    <SortableContext items={resources.map((r) => r.id)} strategy={verticalListSortingStrategy}>
                      <Space direction="vertical" className="w-full" size="small">
                        {resources.map((resource) => (
                          <SortableResourceItem key={resource.id} resource={resource} onDelete={() => deleteResource(resource.id)} />
                        ))}
                      </Space>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>
          </Form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
