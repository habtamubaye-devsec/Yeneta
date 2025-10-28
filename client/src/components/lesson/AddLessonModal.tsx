import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  Typography,
  message,
  Upload,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  MenuOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  FileOutlined,
  LinkOutlined,
  FilePdfOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const { Text } = Typography;
const { TextArea } = Input;

interface Resource {
  id: number;
  name: string;
  type: "text" | "image" | "video" | "link" | "pdf";
  file?: File; // actual file for backend
  url?: string; // preview URL (object URL or external link)
}

function SortableResourceItem({
  resource,
  onDelete,
}: {
  resource: Resource;
  onDelete: () => void;
}) {
  // keep setNodeRef on container, attach attributes/listeners to drag handle only
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: resource.id.toString() });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? undefined,
    background: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  };

  const getIcon = () => {
    switch (resource.type) {
      case "text":
        return <FileTextOutlined />;
      case "image":
        return <FileOutlined />;
      case "video":
        return <PlayCircleOutlined />;
      case "link":
        return <LinkOutlined />;
      case "pdf":
        return <FilePdfOutlined />;
      default:
        return <FileTextOutlined />;
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        {/* Drag handle ONLY */}
        <div
          {...attributes}
          {...listeners}
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "grab" }}
          aria-label="drag-handle"
        >
          <MenuOutlined style={{ color: "#999" }} />
          {getIcon()}
          <Text style={{ marginLeft: 6 }}>{`${resource.id}. ${resource.name}`}</Text>
        </div>

        {/* Delete button separated and stops propagation */}
        <div style={{ marginLeft: "auto" }}>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation(); // prevent DnD from swallowing the click
              onDelete();
            }}
          />
        </div>
      </div>

      {/* Previews (images, video, pdf, link) */}
      {resource.type === "image" && resource.url && (
        <img
          src={resource.url}
          alt={resource.name}
          style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 6 }}
        />
      )}

      {resource.type === "video" && resource.url && (
        <video
          src={resource.url}
          controls
          style={{ width: "100%", maxHeight: 300, borderRadius: 6 }}
        />
      )}

      {resource.type === "pdf" && resource.url && (
        <iframe
          src={resource.url}
          title={resource.name}
          style={{ width: "100%", height: 220, borderRadius: 6 }}
        />
      )}

      {resource.type === "link" && resource.url && (
        <a href={resource.url} target="_blank" rel="noopener noreferrer">
          {resource.url}
        </a>
      )}
    </div>
  );
}

export default function AddLessonModal({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void; // backend expects FormData with files
}) {
  const [form] = Form.useForm();
  const [resources, setResources] = useState<Resource[]>([]);
  const [newResource, setNewResource] = useState("");
  const [resourceType, setResourceType] = useState<
    "text" | "image" | "video" | "link" | "pdf" | null
  >(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const getAccept = () => {
    if (resourceType === "image") return "image/*";
    if (resourceType === "video") return "video/*";
    if (resourceType === "pdf") return ".pdf";
    return undefined;
  };

  const handleAddResource = (file?: File) => {
    if ((resourceType === "text" || resourceType === "link") && !newResource.trim()) {
      message.warning("Please enter resource content");
      return;
    }
    if (!resourceType) {
      message.warning("Select a resource type first");
      return;
    }

    const newId = resources.length > 0 ? resources[resources.length - 1].id + 1 : 1;

    const item: Resource = {
      id: newId,
      name:
        resourceType === "text" || resourceType === "link"
          ? newResource.trim()
          : file?.name ?? "Unnamed",
      type: resourceType,
      file: file,
      url:
        resourceType === "image" || resourceType === "video" || resourceType === "pdf"
          ? file
            ? URL.createObjectURL(file)
            : undefined
          : resourceType === "link"
          ? newResource.trim()
          : undefined,
    };

    setResources((prev) => [...prev, item]);
    setNewResource("");
    setResourceType(null);
    message.success("Resource added");
  };

  const handleDelete = (id: number) => {
    setResources((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      // reindex ids
      return filtered.map((r, i) => ({ ...r, id: i + 1 }));
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setResources((prev) => {
      const oldIndex = prev.findIndex((r) => r.id.toString() === active.id);
      const newIndex = prev.findIndex((r) => r.id.toString() === over.id);
      if (oldIndex < 0 || newIndex < 0) return prev;
      const next = Array.from(prev);
      const [moved] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, moved);
      return next.map((r, i) => ({ ...r, id: i + 1 }));
    });
  };

const handleSubmit = () => {
  form
    .validateFields()
    .then((values) => {
      const fd = new FormData();
      fd.append("title", values.title);

      // Separate resources by type
      const textResources: { content: string | undefined; type: "link" | "text"; position: number; }[] = [];

      resources.forEach((r, idx) => {
        if (r.type === "text" || r.type === "link") {
          // store text & link in JSON (content + type)
          textResources.push({
            content: r.type === "link" ? r.url : r.name,
            type: r.type,
            position: idx + 1,
          });
        } else if (r.file) {
          // send files directly — multer will handle them
          fd.append("resources", r.file);
        }
      });

      // Append JSON text resources
      if (textResources.length > 0) {
        fd.append("textResources", JSON.stringify(textResources));
      }

      onSubmit(fd);
      form.resetFields();
      setResources([]);
      setNewResource("");
      setResourceType(null);
      onClose();

      console.log("📤 FormData content:");
for (let pair of fd.entries()) {
  console.log(pair[0], pair[1]);
}

    })
    .catch(() => message.error("Please complete required fields"));
};


  const uploadProps = {
    beforeUpload: (file: File) => {
      // don't stop propagation here — Upload must open dialog
      handleAddResource(file);
      return false; // prevent Upload from trying to POST by itself
    },
    showUploadList: false,
    accept: getAccept(),
  };

  return (
    <Modal
      title="Add Lesson"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Save Lesson"
      width={700}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Lesson Title"
          name="title"
          rules={[{ required: true, message: "Please enter lesson title" }]}
        >
          <Input placeholder="Enter lesson title" />
        </Form.Item>

        <div style={{ marginTop: 12 }}>
          <Text strong>Lesson Resources</Text>

          <Space style={{ marginTop: 8, marginBottom: 12 }}>
            <Button
              icon={<FileTextOutlined />}
              type={resourceType === "text" ? "primary" : "default"}
              onClick={() => setResourceType("text")}
            />
            <Button
              icon={<FileOutlined />}
              type={resourceType === "image" ? "primary" : "default"}
              onClick={() => setResourceType("image")}
            />
            <Button
              icon={<PlayCircleOutlined />}
              type={resourceType === "video" ? "primary" : "default"}
              onClick={() => setResourceType("video")}
            />
            <Button
              icon={<LinkOutlined />}
              type={resourceType === "link" ? "primary" : "default"}
              onClick={() => setResourceType("link")}
            />
            <Button
              icon={<FilePdfOutlined />}
              type={resourceType === "pdf" ? "primary" : "default"}
              onClick={() => setResourceType("pdf")}
            />
          </Space>

          {/* conditional input/upload */}
          {resourceType === "text" || resourceType === "link" ? (
            <Space style={{ display: "flex", marginBottom: 12 }}>
              <Input
                placeholder={resourceType === "link" ? "Enter URL" : "Enter text content"}
                value={newResource}
                onChange={(e) => setNewResource(e.target.value)}
                onPressEnter={() => handleAddResource()}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleAddResource()}
              >
                Add
              </Button>
            </Space>
          ) : resourceType === "image" || resourceType === "video" || resourceType === "pdf" ? (
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Upload {resourceType?.toUpperCase()}</Button>
            </Upload>
          ) : null}

          {/* resource list with drag & drop */}
          <div style={{ marginTop: 8 }}>
            {resources.length === 0 ? (
              <Text type="secondary">No resources added yet.</Text>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={resources.map((r) => r.id.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  {resources.map((r) => (
                    <SortableResourceItem key={r.id} resource={r} onDelete={() => handleDelete(r.id)} />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </Form>
    </Modal>
  );
}
