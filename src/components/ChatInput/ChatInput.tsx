import React, { useState, KeyboardEvent } from "react";
import styled from "styled-components";

const ChatInputView = styled.input`
  width: 400px;
  height: 100%;
`;

type SubmitFunctionType = (value: string) => void;
export function ChatInput({ onSubmit }: { onSubmit: SubmitFunctionType }) {
  const [message, setMessage] = useState("");

  const keyHandler = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter") {
      onSubmit(message);
      setMessage("");
    }
  };

  return (
    <ChatInputView
      onChange={evt => setMessage(evt.target.value)}
      onKeyPress={keyHandler}
    />
  );
}
