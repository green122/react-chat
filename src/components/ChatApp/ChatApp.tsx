import React, { useEffect, useReducer } from "react";
import styled from "styled-components";
import { useWebsocket } from "./ChatApp.hooks";

interface IAction {
  type: string;
  payload: any;
}

interface IMessage {
  messageText: string;
  authorId: string;
}

const messages: IMessage[] = [
  {
    messageText: "TESTMESSAGE",
    authorId: "0001"
  },
  {
    messageText: "TESTMESSAGE1",
    authorId: "0002"
  },
  {
    messageText: "TESTMESSAGE2",
    authorId: "0003"
  }
];

const initialState = messages;


const reducer = (state: IMessage[], action: IAction) => {
  return state;
};

const ChatView = styled.div`
  width: 400px;
  height: 100%;
`;

export function ChatApp() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { sendMessage } = useWebsocket();
    
  return (
    <ChatView>
      {messages.map(messageEntry => (
        <div>{messageEntry.messageText}</div>
      ))}
    </ChatView>
  );
}
