import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Typography,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DragOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import AddLessonModal from "@/components/lesson/AddLessonModal";
import {
  fetchLessons,
  createLesson,
  updateLesson,
  deleteLesson,
} from "@/features/lesson/lessonThunks";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useParams } from "react-router-dom";

const { Title } = Typography;

interface Lesson {
  _id: string;
  title: string;
  resources?: { type: string; content: string }[];
  position?: number;
}

/** 🧩 Sortable row wrapper */
function SortableRow(props: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props["data-row-key"] });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </tr>
  );
}

export default function ManageLessons() {
  const dispatch = useDispatch<AppDispatch>();
  const { lessons, loading } = useSelector((state: RootState) => state.lessons);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // ⏳ Load all lessons from backend
const { courseId } = useParams();
useEffect(() => {
  if (courseId) dispatch(fetchLessons(courseId));
}, [dispatch, courseId]);

  /** 🟢 Add new lesson */
  const handleAddLesson = async (formData: FormData) => {
    if (courseId) {
    formData.append("courseId", courseId);
  }
    const res = await dispatch(createLesson(formData));
    if (createLesson.fulfilled.match(res)) {
      message.success("✅ Lesson added successfully");
      setIsModalVisible(false);
    } else {
      message.error(res.payload as string);
    }
  };

  /** ✏️ Edit lesson */
  const handleEditLesson = async (formData: FormData) => {
    if (!editingLesson) return;
    const res = await dispatch(
      updateLesson({ id: editingLesson._id, lessonData: formData })
    );
    if (updateLesson.fulfilled.match(res)) {
      message.success("✏️ Lesson updated successfully");
      setIsModalVisible(false);
    } else {
      message.error(res.payload as string);
    }
  };

  /** 🗑️ Delete lesson */
  const handleDeleteLesson = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this lesson?",
      okText: "Yes, delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        const res = await dispatch(deleteLesson(id));
        if (deleteLesson.fulfilled.match(res)) {
          message.success("🗑️ Lesson deleted");
        } else {
          message.error(res.payload as string);
        }
      },
    });
  };

  /** ✨ DnD setup */
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = lessons.findIndex((l) => l._id === active.id);
    const newIndex = lessons.findIndex((l) => l._id === over.id);
    const reordered = arrayMove(lessons, oldIndex, newIndex);

    // optimistic update
    const updatedOrder = reordered.map((l, i) => ({
      ...l,
      position: i + 1,
    }));

    message.info("⏳ Updating lesson order...");
    for (const lesson of updatedOrder) {
      await dispatch(
        updateLesson({
          id: lesson._id,
          lessonData: Object.assign(new FormData(), {
            position: String(lesson.position),
          }) as any,
        })
      );
    }

    message.success("✅ Lessons reordered!");
  };

  const columns = [
    {
      title: "Drag",
      dataIndex: "drag",
      width: 60,
      render: () => <DragOutlined style={{ cursor: "grab" }} />,
    },
    { title: "Title", dataIndex: "title", key: "title" },
    
    {
      title: "Resources",
      key: "resources",
      render: (lesson: Lesson) => (
        <div>
          {lesson.resources && lesson.resources.length > 0 ? (
            lesson.resources.map((r, idx) => (
              <div key={idx}>
                {r.type === "image" && (
                  <img
                    src={r.content}
                    alt=""
                    style={{ width: 60, height: 60, objectFit: "cover" }}
                  />
                )}
                {r.type === "video" && (
                  <video src={r.content} controls width={100} height={60} />
                )}
                {r.type === "text" && <span>{r.content}</span>}
              </div>
            ))
          ) : (
            <span>-</span>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Lesson) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(record)}>
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteLesson(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const openModal = (lesson?: Lesson) => {
    setEditingLesson(lesson || null);
    setIsModalVisible(true);
  };

  const handleSave = (formData: FormData) => {
    if (editingLesson) handleEditLesson(formData);
    else handleAddLesson(formData);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>📚 Manage Lessons</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
        >
          Add Lesson
        </Button>
      </div>

      {loading ? (
        <Spin />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={lessons.map((l) => l._id)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              dataSource={lessons}
              columns={columns}
              rowKey="_id"
              pagination={false}
              components={{
                body: {
                  row: SortableRow,
                },
              }}
              bordered
            />
          </SortableContext>
        </DndContext>
      )}

      {isModalVisible && (
        <AddLessonModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSubmit={handleSave}
          editingLesson={editingLesson}
        />
      )}
    </div>
  );
}
