import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Upload,
  Typography,
  message,
} from "antd";
import {
  UploadOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";

const { Text } = Typography;

type VideoItem = {
  id: string;
  file: File;
  preview: string;
};

interface AddLessonModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (courseId: string, formData: FormData) => void;
}

interface AddLessonModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (courseId: string, formData: FormData) => void;
  // optional override: parent can pass courseId instead of relying on URL params
  courseId?: string;
}

const AddLessonModal: React.FC<AddLessonModalProps> = ({
  visible,
  onClose,
  onSubmit,
  courseId: propCourseId,
}) => {
  const [form] = Form.useForm();
  const [video, setVideo] = useState<VideoItem | null>(null);
  const params = useParams<{ courseId: string }>();
  const runtimeCourseId = propCourseId ?? params.courseId;

  // Clean up video preview on unmount or close
  useEffect(() => {
    return () => {
      if (video) URL.revokeObjectURL(video.preview);
    };
  }, [video]);

  // Handle file selection (only allow one video)
  const handleBeforeUpload = (file: File) => {
    if (!file.type.startsWith("video/")) {
      message.error("Only video files are allowed!");
      return Upload.LIST_IGNORE;
    }

    if (video) {
      message.warning("You can only upload one video per lesson.");
      return Upload.LIST_IGNORE;
    }

    const id = `${file.name}-${Date.now()}`;
    const preview = URL.createObjectURL(file);
    setVideo({ id, file, preview });
    message.success(`${file.name} added successfully`);
    return false; // prevent auto upload
  };

  // Remove selected video
  const handleRemoveVideo = () => {
    if (video) {
      URL.revokeObjectURL(video.preview);
      setVideo(null);
      message.info("Video removed");
    }
  };

  // Handle form submit
 const handleSubmit = async () => {
  try {
    // Validate form fields
    const values = await form.validateFields();

    // Check if a video is selected
    if (!video) {
      message.warning("Please upload a video before saving.");
      return;
    }

    // Check for courseId (either passed from parent or from the URL)
    if (!runtimeCourseId) {
      message.error("Course ID is missing. Cannot save lesson.");
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description || "");
    formData.append("resources", video.file); // key must match backend

    // Debug log all FormData entries
    console.log("📦 FormData contents:");
    for (const [key, val] of formData.entries()) {
      console.log(key, val);
    }

    // Check if the file exists in FormData
    if (formData.has("resources")) {
      // console.log("✅ Video file found in FormData:", formData.get("resources"));
      console.log(
        formData.get("title"),
        formData.get("description"),
        runtimeCourseId,
        formData.get("resources")
      );
    } else {
      console.log("❌ No video file found in FormData");
      message.error("Video file is missing!");
      return;
    }

  // Call the parent onSubmit function
  await onSubmit(runtimeCourseId, formData);

    message.success("Lesson saved successfully!");
    form.resetFields();
    handleRemoveVideo();
    onClose();
  } catch (err) {
    console.error("❌ Validation/Submit Error:", err);
    message.error("Failed to save lesson. Please try again.");
  }
};


  return (
    <Modal
      title="Add Lesson"
      open={visible}
      onCancel={() => {
        handleRemoveVideo();
        form.resetFields();
        onClose();
      }}
      onOk={handleSubmit}
      okText="Save Lesson"
      width={600}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        {/* Lesson Title */}
        <Form.Item
          label="Lesson Title"
          name="title"
          rules={[{ required: true, message: "Please enter lesson title" }]}
        >
          <Input placeholder="Enter lesson title" />
        </Form.Item>

        {/* Description */}
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter lesson description" }]}
        >
          <Input.TextArea rows={4} placeholder="Describe this lesson" />
        </Form.Item>

        {/* Video Upload */}
        <Form.Item label="Upload Lesson Video">
          <Upload
            beforeUpload={handleBeforeUpload}
            showUploadList={false}
            accept="video/*"
            multiple={false}
          >
            {!video && (
              <Button icon={<UploadOutlined />}>Select Video</Button>
            )}
          </Upload>

          {video && (
            <div
              style={{
                marginTop: 16,
                position: "relative",
                border: "1px solid #f0f0f0",
                borderRadius: 10,
                padding: 8,
                textAlign: "center",
                background: "#fff",
              }}
            >
              <Button
                type="text"
                icon={<DeleteOutlined style={{ color: "red", fontSize: 18 }} />}
                onClick={handleRemoveVideo}
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  zIndex: 3,
                }}
                aria-label="remove-video"
              />

              <video
                src={video.preview}
                width="90%"
                controls
                style={{
                  borderRadius: 6,
                  background: "#000",
                  maxHeight: 180,
                }}
              />

              <Text
                style={{
                  display: "block",
                  marginTop: 8,
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={video.file.name}
              >
                <PlayCircleOutlined /> {video.file.name}
              </Text>
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddLessonModal;
