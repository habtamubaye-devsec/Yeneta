import { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Space, Avatar, Typography, FloatButton } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, CloseOutlined, MessageOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function GeminiChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI learning assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a simulated response. Connect to Gemini API for real AI responses.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <FloatButton
        icon={<MessageOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24, width: 60, height: 60 }}
        onClick={() => setIsOpen(true)}
        tooltip="Chat with AI Assistant"
      />
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        width: 380,
        height: 600,
        zIndex: 1000,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        borderRadius: 12,
      }}
    >
      <Card
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid hsl(215 28% 17%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'hsl(221 83% 53%)',
            color: 'white',
          }}
        >
          <Space>
            <RobotOutlined style={{ fontSize: 24 }} />
            <div>
              <Text strong style={{ color: 'white', display: 'block' }}>
                AI Assistant
              </Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 12 }}>Powered by Gemini</Text>
            </div>
          </Space>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setIsOpen(false)}
            style={{ color: 'white' }}
          />
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'flex-start',
                flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
              }}
            >
              <Avatar
                icon={message.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                style={{
                  background: message.role === 'user' ? 'hsl(221 83% 53%)' : 'hsl(215 28% 17%)',
                }}
              />
              <div
                style={{
                  maxWidth: '70%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: message.role === 'user' ? 'hsl(221 83% 53%)' : 'hsl(215 28% 17%)',
                  color: 'white',
                }}
              >
                <Text style={{ color: 'white' }}>{message.content}</Text>
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <Avatar icon={<RobotOutlined />} style={{ background: 'hsl(215 28% 17%)' }} />
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 12,
                  background: 'hsl(215 28% 17%)',
                }}
              >
                <Text style={{ color: 'white' }}>Typing...</Text>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '16px', borderTop: '1px solid hsl(215 28% 17%)' }}>
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={handleSend}
              disabled={isLoading}
              size="large"
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              size="large"
            />
          </Space.Compact>
        </div>
      </Card>
    </div>
  );
}
