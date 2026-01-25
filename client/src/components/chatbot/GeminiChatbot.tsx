import { useState, useRef, useEffect } from "react";
import {
  Input,
  Button,
  Space,
  Avatar,
  Typography,
  FloatButton,
} from "antd";
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  CloseOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { askAssistantThunk, addUserMessage, type Message } from "../../features/GeminiAI/Gemini";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const { Text } = Typography;

export default function GeminiChatbot() {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state: any) => state.assistant);

  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 0);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Send message
  const handleSend = () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    dispatch(addUserMessage(userMessage));
    dispatch(askAssistantThunk(input) as any);
    setInput("");
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

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
      ref={chatRef}
      style={{
        position: "fixed",
        right: 0,
        bottom: 24,
        width: 420,
        height: 620,
        zIndex: 2000,
        borderRadius: 16,
        background: "white",
        overflow: "hidden",
        boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: 16,
          background: "#1e3a8a",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Space>
          <RobotOutlined style={{ fontSize: 26 }} />
          <div>
            <Text strong style={{ color: "white", fontSize: 16 }}>
              AI Assistant
            </Text>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Powered by Gemini AI</div>
          </div>
        </Space>

        <Button
          type="text"
          icon={<CloseOutlined />}
          style={{ color: "white" }}
          onClick={() => setIsOpen(false)}
        />
      </div>

      {/* CHAT MESSAGES */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "18px 16px",
          background: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          boxSizing: "border-box",
        }}
      >
        {messages.map((msg: any) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <Avatar
              icon={msg.role === "user" ? <UserOutlined /> : <RobotOutlined />}
              style={{
                background: msg.role === "user" ? "#2563eb" : "#111827",
              }}
            />

            <div
              style={{
                maxWidth: "75%",
                padding: "12px 16px",
                borderRadius: 14,
                lineHeight: 1.5,
                background:
                  msg.role === "user" ? "#2563eb" : "#e6f0ff",
                color: msg.role === "user" ? "white" : "#003366",
                boxShadow:
                  msg.role === "user"
                    ? "0 2px 6px rgba(37,99,235,0.3)"
                    : "0 2px 6px rgba(0,0,0,0.1)",
                wordBreak: "break-word",
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const inline = !className?.includes("language-");
                    const language = className?.replace("language-", "") || undefined;
                    return inline ? (
                      <code
                        style={{
                          background: "rgba(0,0,0,0.1)",
                          padding: "2px 6px",
                          borderRadius: 6,
                          fontSize: 13,
                        }}
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <div style={{ marginTop: 8, marginBottom: 8 }}>
                        <SyntaxHighlighter
                          style={oneDark}
                          language={language}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            borderRadius: 8,
                            fontSize: 13,
                            padding: "12px",
                            background: "#011627",
                          }}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    );
                  },
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Avatar icon={<RobotOutlined />} style={{ background: "#111827" }} />
            <div
              style={{
                background: "#e6f0ff",
                padding: "10px 14px",
                borderRadius: 14,
                color: "#003366",
                fontStyle: "italic",
              }}
            >
              Typing…
            </div>
          </div>
        )}
      </div>

      {/* INPUT */}
      <div
        style={{
          padding: 12,
          borderTop: "1px solid #e5e7eb",
          background: "white",
          flexShrink: 0,
        }}
      >
        <Space.Compact style={{ width: "100%" }}>
          <Input
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={handleSend}
            size="large"
            style={{ borderRadius: 10 }}
          />

          <Button
            type="primary"
            icon={<SendOutlined />}
            size="large"
            disabled={!input.trim() || loading}
            onClick={handleSend}
            style={{ borderRadius: 10 }}
          />
        </Space.Compact>
      </div>
    </div>
  );
}
