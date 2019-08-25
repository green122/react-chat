import React, { useRef, RefObject, useEffect, useState } from "react";
import styled from "styled-components";
import { ChatInput } from "../ChatInput/ChatInput";
import { IMessage, IUser } from "../../models";

const ChatView = styled.div`
  width: 400px;
  height: 100%;
`;

const ChildList = styled.div`
  width: 400px;
  height: 100px;
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
  sendMessage: (message: string) => void;
}

export function ChatApp(props: IChatAppProps) {
  const chatViewRef: RefObject<HTMLDivElement> = useRef({} as HTMLDivElement);
  const [newMessagesAtBottom, setNewMessagesFlag] = useState(false);
  const refToElement = chatViewRef.current as HTMLElement;
 
  useEffect(() => {
    if (
      refToElement.clientHeight + refToElement.scrollTop <
      refToElement.scrollHeight
    ) {
      setNewMessagesFlag(true);
    }
  }, [props.messages.length, refToElement]);

  const scrollToBottom = () => {
    refToElement.scrollTo({
      top: refToElement.scrollHeight,
      behavior: "smooth"
    });
    setNewMessagesFlag(false);
  };

  return (
    <ChatView>
      <ChildList ref={chatViewRef}>
        {props.messages
          .slice()
          .reverse()
          .map(messageEntry => (
            <div>{messageEntry.messageText}</div>
          ))}
      </ChildList>
      <ScrollButton onClick={scrollToBottom}>+</ScrollButton>
      {newMessagesAtBottom && <ScrollButton onClick={scrollToBottom}>+</ScrollButton>}
      <ChatInput onSubmit={props.sendMessage} />
    </ChatView>
  );
}
