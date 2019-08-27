import React, { SyntheticEvent, Fragment } from "react";
import styled from "styled-components";
import { ReactComponent as Pen } from "../../ui-res/pen-solid.svg";
import { ReactComponent as Delete } from "../../ui-res/times-solid.svg";
import { IMappedMessage } from "../../models";

const Actions = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  top: 5px;
  right: 5px;
  position: absolute;
  opacity: 0;
  transition: opacity 0.4s ease;
`;

const MessageWrapper = styled.div`
  margin-top: 20px;
  position: relative;
  &.editable {
    &:hover > ${Actions} {
      opacity: 1;
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

const Message = styled.div`
  display: block;
  margin: 0;
  line-break: strict;
  word-break: break-all;
`;

const Modified = styled.p`
  font-style: italic;
`;

const PenIcon = styled(Pen)`
  width: 20px;
  height: 20px;
  color: darkgray;
  cursor: pointer;
`;

const DeleteIcon = styled(Delete)`
  width: 20px;
  height: 20px;
  color: darkgray;
  cursor: pointer;
`;

interface ChatMessageProps {
  tag: number;
  editable: boolean;
  messageEntry: IMappedMessage;
  onEdit: (event: SyntheticEvent) => void;
  onDelete: (event: SyntheticEvent) => void;
}

export function ChatMessage({
  tag,
  editable = false,
  messageEntry,
  onEdit,
  onDelete
}: ChatMessageProps) {
  const { messageText, author, timeView, isModified, isDeleted } = messageEntry;
  const additionalMessage = isModified
    ? "(edited)"
    : isDeleted
    ? "Message is deleted"
    : "";
  return (
    <MessageWrapper className={editable ? `editable` : ""}>
      <Author>{author}</Author>
      <Time>{timeView}</Time>
      {!isDeleted ? (
        <Fragment>
          <Message>
            {messageText}
            {isModified && <Modified>(edited)</Modified>}
          </Message>
          <Actions>
            <PenIcon data-tag={tag} onClick={onEdit} />
            <DeleteIcon data-tag={tag} onClick={onDelete} />
          </Actions>
        </Fragment>
      ) : (
        <Modified>Message is deleted</Modified>
      )}
    </MessageWrapper>
  );
}
