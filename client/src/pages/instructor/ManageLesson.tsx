import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button, List, Card, Modal, Typography, message, Spin } from "antd";
import { Trash2, Plus } from "lucide-react";
import AddLessonModal from "@/components/lesson/AddLessonModal";
import type { AppDispatch, RootState } from "@/app/store";
import { fetchLessons, createLesson, deleteLesson } from "@/features/lesson/lessonThunks";

const { Title, Text } = Typography;

export default function ManageLessonsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { courseId } = useParams<{ courseId: string }>();
  const { lessons, loading } = useSelector((state: RootState) => state.lessons);
  const { courses } = useSelector((state: RootState) => state.courses);

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (courseId) dispatch(fetchLessons(courseId));
  }, [dispatch, courseId]);

  const course = courses.find((c: any) => c._id === courseId);

  const handleAddLesson = async (courseIdParam: string, formData: FormData) => {
    try {
      const res = await dispatch(createLesson({ courseId: courseIdParam, formData }));
      if (createLesson.fulfilled.match(res)) {
        message.success("Lesson added");
        setIsModalVisible(false);
      } else {
        message.error(res.payload as string);
      }
    } catch (err) {
      message.error("Failed to add lesson");
    }
  };

  const handleDelete = async (id: string) => {
    if (!courseId) return;
    Modal.confirm({
      title: "Delete lesson?",
      onOk: async () => {
        const res = await dispatch(deleteLesson({ courseId, id }));
        if (deleteLesson.fulfilled.match(res)) message.success("Lesson deleted");
        else message.error(res.payload as string);
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-white min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <div>
            <Title level={3}>{course ? course.title : `Course ${courseId}`}</Title>
            <Text type="secondary">Manage lessons for this course</Text>
          </div>
          <Button type="primary" icon={<Plus />} onClick={() => setIsModalVisible(true)}>
            Add Lesson
          </Button>
        </div>

        {loading ? (
          <Spin />
        ) : (
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={lessons}
            renderItem={(lesson: any) => {
              // New lesson format (server) stores videoUrl directly on lesson
              const resource = lesson.resources && lesson.resources[0];
              const videoUrlFromResources = resource?.url || resource?.content || resource?.path || (resource && typeof resource === 'string' ? resource : null);
              // prefer top-level videoUrl (legacy/new format), then resources
              const videoUrl = lesson.videoUrl || videoUrlFromResources || null;
              return (
                <List.Item>
                  <Card title={lesson.title} extra={<Button danger onClick={() => handleDelete(lesson._id)}><Trash2 /></Button>}>
                    <Text>{lesson.description}</Text>
                    {videoUrl ? (
                      <video src={videoUrl} controls style={{ width: '100%', marginTop: 8 }} />
                    ) : (
                      <Text type="secondary">No video</Text>
                    )}
                  </Card>
                </List.Item>
              );
            }}
          />
        )}

        {isModalVisible && (
          <AddLessonModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onSubmit={handleAddLesson}
            courseId={courseId || course?._id}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
