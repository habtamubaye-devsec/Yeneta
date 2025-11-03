import { useState } from 'react';
import { Card, Button, Input, Avatar, Typography, Space, App } from 'antd';
import { MessageOutlined, SendOutlined, LikeOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface Reply {
  id: number;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface Thread {
  id: number;
  author: string;
  avatar: string;
  title: string;
  content: string;
  timestamp: string;
  replies: number;
  likes: number;
  replyList?: Reply[];
}

interface DiscussionThreadProps {
  courseId: number;
}

export const DiscussionThread = ({ courseId }: DiscussionThreadProps) => {
  const { user } = useAuth();
  const { message } = App.useApp();
  const [showReplyForm, setShowReplyForm] = useState<number | null>(null);
  const [newThread, setNewThread] = useState({ title: '', content: '' });
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);

  const [threads] = useState<Thread[]>([
    {
      id: 1,
      author: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      title: 'Question about Module 3',
      content: 'Can someone explain the difference between state and props in more detail?',
      timestamp: '2 hours ago',
      replies: 3,
      likes: 5,
      replyList: [
        {
          id: 1,
          author: 'Sarah Johnson',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
          content: 'State is internal to the component, while props are passed from parent to child.',
          timestamp: '1 hour ago',
          likes: 2,
        },
      ],
    },
    {
      id: 2,
      author: 'Emma Davis',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
      title: 'Project idea sharing',
      content: 'I built a todo app using the concepts from this course. Would love to hear feedback!',
      timestamp: '5 hours ago',
      replies: 7,
      likes: 12,
    },
  ]);

  const handlePostThread = () => {
    if (!newThread.title || !newThread.content) {
      message.error('Please fill in all fields');
      return;
    }
    message.success('Thread posted successfully');
    setNewThread({ title: '', content: '' });
    setShowNewThreadForm(false);
  };

  const handlePostReply = (threadId: number) => {
    message.success('Reply posted successfully');
    setShowReplyForm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Title level={3}>Course Discussion</Title>
        {!showNewThreadForm && (
          <Button type="primary" icon={<MessageOutlined />} onClick={() => setShowNewThreadForm(true)}>
            New Thread
          </Button>
        )}
      </div>

      {showNewThreadForm && (
        <Card>
          <Title level={4}>Start a New Discussion</Title>
          <Space direction="vertical" className="w-full" size="middle" style={{ marginTop: 16 }}>
            <Input
              placeholder="Thread title"
              value={newThread.title}
              onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
              size="large"
            />
            <TextArea
              placeholder="What would you like to discuss?"
              rows={4}
              value={newThread.content}
              onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
            />
            <Space>
              <Button type="primary" onClick={handlePostThread}>Post Thread</Button>
              <Button onClick={() => setShowNewThreadForm(false)}>Cancel</Button>
            </Space>
          </Space>
        </Card>
      )}

      <div className="space-y-4">
        {threads.map((thread) => (
          <Card key={thread.id}>
            <div className="flex gap-4">
              <Avatar src={thread.avatar} size={48}>{thread.author[0]}</Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Title level={5} style={{ marginBottom: 4 }}>{thread.title}</Title>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      {thread.author} • {thread.timestamp}
                    </Text>
                  </div>
                </div>
                <Text style={{ display: 'block', marginBottom: 16 }}>{thread.content}</Text>
                
                <Space>
                  <Button type="text" icon={<LikeOutlined />} size="small">
                    {thread.likes}
                  </Button>
                  <Button 
                    type="text" 
                    icon={<MessageOutlined />}
                    size="small"
                    onClick={() => setShowReplyForm(showReplyForm === thread.id ? null : thread.id)}
                  >
                    {thread.replies} Replies
                  </Button>
                </Space>

                {thread.replyList && thread.replyList.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 space-y-4" style={{ borderColor: 'hsl(215 28% 17%)' }}>
                    {thread.replyList.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <Avatar src={reply.avatar} size={32}>{reply.author[0]}</Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Text strong style={{ fontSize: 14 }}>{reply.author}</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>{reply.timestamp}</Text>
                          </div>
                          <Text style={{ fontSize: 14 }}>{reply.content}</Text>
                          <Button type="text" icon={<LikeOutlined />} size="small" style={{ marginTop: 4, height: 24, padding: '0 8px' }}>
                            {reply.likes}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showReplyForm === thread.id && (
                  <div className="mt-4 flex gap-2">
                    <Avatar src={user?.avatar} size={32}>{user?.name[0]}</Avatar>
                    <div className="flex-1">
                      <TextArea
                        placeholder="Write your reply..."
                        rows={3}
                        style={{ marginBottom: 8 }}
                      />
                      <Space>
                        <Button type="primary" size="small" icon={<SendOutlined />} onClick={() => handlePostReply(thread.id)}>
                          Reply
                        </Button>
                        <Button size="small" onClick={() => setShowReplyForm(null)}>
                          Cancel
                        </Button>
                      </Space>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
