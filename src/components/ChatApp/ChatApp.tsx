import React, { useRef, RefObject, useEffect, useState, Fragment, useCallback } from "react";
import { ChatInput } from "../ChatInput/ChatInput";
import { IUser, IMappedMessage, ETabs, IMessage } from "../../models";
import { ChatMessage } from "../ChatMessage/ChatMessage";
import { ChatTabs } from "../ChatTabs/ChatTabs";
import { UsersList } from "../UsersList/UsersList";
import { getMappedMessages } from "../../utils/common";
import { Header } from "../Header/Header";
import { ChatView, ChatList, ScrollButton } from "./ChatApp.ui";

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

  const scrollToBottom = useCallback(() => {
    if (!refToElement.scrollTo){
      return;
    }
    refToElement.scrollTo({
      top: refToElement.scrollHeight,
      behavior: "smooth"
    });
    setNewMessages(0);
  }, [refToElement]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) {
      return;
    }
    if (lastMessage.authorId === userId) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom, userId]);

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
                  editable={
                    messageEntry.authorId === userId && !messageEntry.isDeleted
                  }
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
