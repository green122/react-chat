import React from "react";
import styled from "styled-components";

const messages = [
  {
    message: "TESTMESSAGE",
    author: "0001"
  },
  {
    message: "TESTMESSAGE1",
    author: "0002"
  },
  {
    message: "TESTMESSAGE2",
    author: "0003"
  }
];

const ChatView = styled.div`
  width: 400px;
  height: 100%;
`;

export function ChatApp() {
  return (
    <ChatView>
      {messages.map(messageEntry => (
        <div>{messageEntry.message}</div>
      ))}
    </ChatView>
  );
}
