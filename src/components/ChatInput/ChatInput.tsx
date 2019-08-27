import React, { useState, KeyboardEvent } from "react";
import styled from "styled-components";

const ChatInputView = styled.input`
  width: 90%;
  border-radius: 10px;
  border: 1px solid darkgrey;
  height: 60px;
`;

type SubmitFunctionType = (value: string) => void;
export function ChatInput({
  onSubmit,
  value
}: {
  onSubmit: SubmitFunctionType;
  value: string;
}) {
  const [message, setMessage] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setMessage(value);
    setPrevValue(value);
  }

  const keyHandler = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter") {
      onSubmit(message);
      setMessage("");
    }
  };

  return (
    <ChatInputView
      value={message}
      onChange={evt => setMessage(evt.target.value)}
      onKeyPress={keyHandler}
    />
  );
}
