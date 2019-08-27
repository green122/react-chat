import React, { useRef, RefObject, useEffect, useState } from "react";
import styled from "styled-components";
import { ChatInput } from "../ChatInput/ChatInput";
import { IUser, IMappedMessage, ETabs, IMessage } from "../../models";
import { ChatMessage } from "../ChatMessage/ChatMessage";
import { ChatTabs } from "../ChatTabs/ChatTabs";
import { UsersList } from "../UsersList/UsersList";
import { getMappedMessages } from "../../utils/common";

const ChatView = styled.div`
  width: 480px;
  display: flex;
  height: calc(100vh - 20px);
  flex-direction: column;
  margin: 10px auto;
  justify-content: start;
  font-size: 24px;
`;

const ChatList = styled.div`
  padding: 24px;
  flex-grow: 1;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column-reverse;
`;

const ScrollButton = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 0;
  cursor: pointer;
  background: white;
  box-shadow: 5px 5px 5px gray;
`;

interface IChatAppProps {
  messages: IMessage[];
  users: IUser[];
  userId: string;
  sendMessage: (message: IMappedMessage) => void;
}

export function ChatApp({ messages, users, sendMessage, userId }: IChatAppProps) {
  const chatViewRef: RefObject<HTMLDivElement> = useRef({} as HTMLDivElement);
  const [newMessagesAtBottom, setNewMessagesFlag] = useState(false);
  const [editingMessageIndex, setEditingMessageIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState(ETabs.Chat);
  const refToElement = chatViewRef.current as HTMLElement;

  const mappedMessages = getMappedMessages(messages, users);

  useEffect(() => {
    if (!refToElement) return;
    if (
      refToElement.clientHeight + refToElement.scrollTop <
      refToElement.scrollHeight
    ) {
      setNewMessagesFlag(true);
    }
  }, [messages.length, refToElement]);

  const scrollToBottom = () => {
    refToElement.scrollTo({
      top: refToElement.scrollHeight,
      behavior: "smooth"
    });
    setNewMessagesFlag(false);
  };

  const handleEditMessage = (event: any) => {
    setEditingMessageIndex(Number(event.target.dataset.tag));
  };

  const handleChange = (message: string) => {
    const isModified = editingMessageIndex > -1;
    const messageToSend: IMappedMessage = {
      ...mappedMessages[editingMessageIndex],
      messageText: message,
      isModified
    };
    sendMessage(messageToSend);
    setEditingMessageIndex(-1);
  };

  const tabs = [
    { id: ETabs.Participants, message: `Participants ${users.length}` },
    { id: ETabs.Chat, message: "Chat" }
  ];

  return (
    <ChatView>
      <ChatTabs
        activeTab={activeTab}
        onChange={tab => setActiveTab(tab)}
        tabs={tabs}
      />
      {activeTab === ETabs.Chat && (
        <ChatList ref={chatViewRef}>
          {mappedMessages
            .slice()
            .reverse()
            .map((messageEntry, index) => (
              <ChatMessage
                key={index}
                tag={index}
                editable={messageEntry.authorId === userId}
                onDoubleClick={handleEditMessage}
                author={messageEntry.author}
                time={messageEntry.timeView}
                messageText={messageEntry.messageText}
              />
            ))}
        </ChatList>
      )}
      {activeTab === ETabs.Participants && <UsersList users={users} />}
      <ScrollButton onClick={scrollToBottom}>+</ScrollButton>
      {newMessagesAtBottom && (
        <ScrollButton onClick={scrollToBottom}>+</ScrollButton>
      )}
      <ChatInput
        onSubmit={handleChange}
        value={
          editingMessageIndex > -1
            ? messages[editingMessageIndex].messageText
            : ""
        }
      />
    </ChatView>
  );
}
