import React from "react";
import styled from "styled-components";
import { ChatInput } from "../ChatInput/ChatInput";
import { IMessage, IUser } from "../../models";

const ChatView = styled.div`
  width: 400px;
  height: 100%;
`;

interface IChatAppProps {
  messages: IMessage[];
  users: IUser[];
  sendMessage: (message: string) => void;
}

export function ChatApp(props: IChatAppProps) {    

  return (
    <ChatView>
      {props.messages.map(messageEntry => (
        <div>{messageEntry.messageText}</div>
      ))}
      <ChatInput onSubmit={props.sendMessage} />
    </ChatView>
  );
}
