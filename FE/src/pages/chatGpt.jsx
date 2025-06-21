import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/chat/chat-bubble";
import { ChatInput } from "@/components/chat/chat-input";
import ChatMessageList from "@/components/chat/chat-message-list";
import { Button } from "@/components/ui/button";
import { Paperclip, Mic, CornerDownLeft } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export default function ChatGpt() {
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const session = localStorage.getItem("chat_session");
  const formRef = useRef(null);

  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!session) {
      createSession();
      setIsGenerating(true);
      setTimeout(() => {
        setMessages([
          {
            role: "ai",
            content: "안녕하세요 저는 청약정보를 알려주는 AI챗봇입니다 궁금하신부분이 있으면 저에게 질문해주세요",
          },
        ]);
        setIsGenerating(false);
      }, 1000);
    } else {
      getMessagehistory(session);
    }
  }, []);

  const handleInputChange = (e) => {
    if (e.code !== "Enter" && !isGenerating) {
      const input = e.target.value;
      setInputMessage(input);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages([...messages, { role: "user", content: inputMessage }]);
      setIsGenerating(true);
      setInputMessage("");

      const url = `${import.meta.env.VITE_URL}/chat/${session}/message`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: inputMessage }),
      });
      const data = await response.json();
      setIsGenerating(false);
      setMessages((prev) => [...prev, { role: "ai", content: data.content }]);
    }
  };

  async function createSession() {
    const url = `${import.meta.env.VITE_URL}/chat/session`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: inputMessage }),
    });
    const data = await response.json();
    localStorage.setItem("chat_session", data.id);
  }

  async function getMessagehistory(session) {
    const url = `${import.meta.env.VITE_URL}/chat/${session}/history`;
    const response = await fetch(url);
    const data = await response.json();
    const list = data.map((d) => ({ role: d.role, content: d.content }));
    setMessages([...list]);
  }

  const onKeyDown = (e) => {
    if (e.code === "Enter" && !isGenerating) {
      // 메시지 전송 로직
      onSubmit(e);
    }
  };

  return (
    <main className="flex h-screen w-full flex-col border rounded-2xl">
      <div className="flex-1 w-full overflow-y-auto">
        <ChatMessageList scrollRef={messagesContainerRef}>
          {messages &&
            messages.map((message, index) => (
              <ChatBubble key={index} variant={message.role == "user" ? "sent" : "received"}>
                <ChatBubbleAvatar src="" fallback={message.role == "user" ? "👨🏽" : "🤖"} />
                <ChatBubbleMessage>{message.content}</ChatBubbleMessage>
              </ChatBubble>
            ))}
          {isGenerating && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar src="" fallback="🤖" />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </div>
      <div className="w-full px-4 pb-4">
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        >
          <ChatInput
            value={inputMessage}
            onKeyDown={onKeyDown}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="rounded-lg bg-background border-0 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            <Button disabled={!inputMessage || isGenerating} type="submit" size="sm" className="ml-auto gap-1.5">
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
