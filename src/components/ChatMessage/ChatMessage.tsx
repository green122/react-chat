import React, { SyntheticEvent } from "react";
import styled from "styled-components";

const MessageWrapper = styled.div`
  margin-top: 20px;
  &.editable {
    &:hover {
      background-color: red;
    }
  }
`;

const Author = styled.p`
  display: inline-block;
  font-weight: bold;
  margin: 0;
`;

const Time = styled.p`
  display: inline-block;
  margin: 0;
  color: darkgray;
`;

const Message = styled.p`
  display: block;
  margin: 0;
`;

interface ChatMessageProps {
  tag: number;
  author?: string;
  time?: string;
  editable: boolean;
  messageText: string;
  onDoubleClick: (event: SyntheticEvent) => void;
}

export function ChatMessage({
  tag,
  author = "",
  editable = false,
  time = "",
  messageText,
  onDoubleClick
}: ChatMessageProps) {
  return (
    <MessageWrapper
      data-tag={tag}
      onDoubleClick={onDoubleClick}
      className={editable ? `editable` : ""}
    >
      <Author>{author}</Author>
      <Time>{time}</Time>
      <Message>{messageText}</Message>
    </MessageWrapper>
  );
}
