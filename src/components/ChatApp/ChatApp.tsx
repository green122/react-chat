import React, { useRef, RefObject, useEffect, useState, Fragment } from "react";
import styled from "styled-components";
import { ChatInput } from "../ChatInput/ChatInput";
import { IUser, IMappedMessage, ETabs, IMessage } from "../../models";
import { ChatMessage } from "../ChatMessage/ChatMessage";
import { ChatTabs } from "../ChatTabs/ChatTabs";
import { UsersList } from "../UsersList/UsersList";
import { getMappedMessages } from "../../utils/common";
import { Header } from "../Header/Header";

const ChatView = styled.section`
  width: 480px;
  display: flex;
  box-sizing: border-box;
  background-color: white;
  height: calc(100vh - 20px);
  flex-direction: column;
  margin: 0 auto;
  justify-content: start;
  font-size: 24px;
  @media (max-width: 360px) {
    height: 100vh;
    font-size: 16px;
    padding-bottom: 10px;
  }
`;

const ChatList = styled.div`
  padding: 24px;
  margin: 10px 10px 10px 0;  
  height: 0px;
  flex-grow: 1;
  background-color: white;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column-reverse;
  @media (max-width: 360px) {
    padding: 12px;
  }
  &::-webkit-scrollbar-track {    
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar {
    width: 7px;
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #aaaaaa;    
  }
`;

const ScrollButton = styled.button`
  width: 80px;
  height: 30px;
  border-radius: 10px;
  font-size: 16px;
  border: 0;
  position: fixed;
  right: calc(50% - 200px);
  cursor: pointer;
  background: white;
  box-shadow: 5px 5px 23px grey;
  @media (max-width: 360px) {
    right: calc(50% - 135px);
  }
`;

interface IChatAppProps {
  messages: IMessage[];
  users: IUser[];
  userId: string;
  sendMessage: (message: IMessage) => void;
}

export default ChatApp;

export function ChatApp({
  messages,
  users,
  sendMessage,
  userId
}: IChatAppProps) {
  let chatViewRef: RefObject<HTMLDivElement> = useRef({} as HTMLDivElement);
  const [newMessagesAtBottom, setNewMessages] = useState(0);
  const [editingMessageIndex, setEditingMessageIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState(ETabs.Chat);
  const refToElement = chatViewRef.current as HTMLElement;
  const scrollPosition = useRef(0);
  let messagesLength = useRef(messages.length);
  const mappedMessages = getMappedMessages(messages, users);  

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage){
      return
    }
    if (lastMessage.authorId === userId) {
      scrollToBottom();
    }
  }, [messages])

  useEffect(() => {
    if (!refToElement || !refToElement.clientHeight) return;
    
    if (
      refToElement.clientHeight + refToElement.scrollTop <
      refToElement.scrollHeight
    ) {
      setNewMessages(messages.length - messagesLength.current);
    } else {
      messagesLength.current = messages.length;      
    }
  }, [messages.length, refToElement]);

  const scrollToBottom = () => {
    refToElement.scrollTo({
      top: refToElement.scrollHeight,
      behavior: "smooth"
    });
    setNewMessages(0);
  };

  const onScroll = (evt: any) => {
    const position = evt.target.scrollTop;
    scrollPosition.current = position;
  };

  const handleEditMessage = (event: any) => {
    setEditingMessageIndex(
      mappedMessages.length - Number(event.currentTarget.dataset.tag) - 1
    );
  };

  const handleDeleteMessage = (event: any) => {
    const messageIndex =
      mappedMessages.length - Number(event.currentTarget.dataset.tag) - 1;
    const messageToSend: IMappedMessage = {
      ...mappedMessages[messageIndex],
      isDeleted: true,
      isModified: false
    };
    sendMessage(messageToSend);
  };

  const handleChange = (message: string) => {
    const isModified = editingMessageIndex > -1;
    const { id = "", authorId = "" } =
      mappedMessages[editingMessageIndex] || {};
    const messageToSend: IMessage = {
      id,
      authorId,
      messageText: message,
      isModified
    };
    sendMessage(messageToSend);
    setEditingMessageIndex(-1);    
  };

  const tabs = [
    { id: ETabs.Participants, message: `Participants (${users.length})` },
    { id: ETabs.Chat, message: "Chat" }
  ];

  return (
    <ChatView>
      <Header />
      <ChatTabs
        activeTab={activeTab}
        onChange={tab => setActiveTab(tab)}
        tabs={tabs}
      />
      {activeTab === ETabs.Chat && (
        <Fragment>
          <ChatList ref={chatViewRef} onScroll={onScroll}>
            {mappedMessages
              .slice()
              .reverse()
              .map((messageEntry, index) => (
                <ChatMessage
                  key={messageEntry.id}
                  tag={index}
                  editable={messageEntry.authorId === userId && !messageEntry.isDeleted}
                  onEdit={handleEditMessage}
                  onDelete={handleDeleteMessage}
                  messageEntry={messageEntry}
                />
              ))}
            {newMessagesAtBottom ? (
              <ScrollButton onClick={scrollToBottom}>
                {newMessagesAtBottom} new
              </ScrollButton>
            ) : null}
          </ChatList>
          <ChatInput
            onSubmit={handleChange}
            value={
              editingMessageIndex > -1
                ? mappedMessages[editingMessageIndex].messageText
                : ""
            }
          />
        </Fragment>
      )}
      {activeTab === ETabs.Participants && <UsersList users={users} />}
    </ChatView>
  );
}
