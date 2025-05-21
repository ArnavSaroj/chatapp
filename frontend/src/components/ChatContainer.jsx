import { useChatStore } from "../store/useChatStore";
import React, { useEffect, useRef } from "react";
import ChatHeader from "../components/ChatHeader.jsx";
import MessageInput from "../components/MessageInput.jsx";
import MessageSkeleton from "../components/skeletons/MessageSkeleton.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { formatMessageTime } from "../lib/utils.js";

const ChatContainer = () => {
  const { messages, getMessages, ismessagesloading, selectedUser,SubscribeToMessages,UnSubscribeToMessage } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  // Fetch messages when the selected user changes
  useEffect(() => {
    if (selectedUser?.id) {
      getMessages(selectedUser.id);

      SubscribeToMessages();

      return () =>{
        UnSubscribeToMessage();
      }

    }
  }, [selectedUser?.id, getMessages,SubscribeToMessages,UnSubscribeToMessage]);

  if (ismessagesloading) {
    return (
      <div className="flex-1 flex flex-col h-full w-full">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full w-full">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat ${message.sender_id === authUser.id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.sender_id === authUser.id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.sent_at)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        {/* Add a reference to scroll to the bottom */}
        <div ref={messageEndRef}></div>
      </div>
      {/* Message input box */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;