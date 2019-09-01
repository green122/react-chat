import React, { SyntheticEvent, Fragment, useState, MouseEvent } from "react";
import styled from "styled-components";
import { ReactComponent as Pen } from "../../ui-res/pen-solid.svg";
import { ReactComponent as Delete } from "../../ui-res/times-solid.svg";
import { IMappedMessage, IElementBlock, EMessageBlocks } from "../../models";
import { PreviewLink } from "../LinkPreview/LinkPreview";

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
  &.activated {
    opacity: 1;
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
  margin-left: 10px;
  color: darkgray;
`;

const Message = styled.div`
  display: block;
  margin: 0;
  p,
  a {
    line-break: strict;
    word-break: break-all;
    display: inline;
  }
  .info-message {
    color: gray;
  }
`;

const PenIcon = styled(Pen)`
  width: 20px;
  height: 20px;
  color: darkgray;
  cursor: pointer;
  @media (max-width: 320px) {
    width: 15px;
    height: 15px;
  }
`;

const DeleteIcon = styled(Delete)`
  width: 20px;
  height: 20px;
  color: darkgray;
  cursor: pointer;
  @media (max-width: 320px) {
    width: 15px;
    height: 15px;
  }
`;

interface ChatMessageProps {
  tag: number;
  editable: boolean;
  messageEntry: IMappedMessage;
  onEdit: (event: SyntheticEvent) => void;
  onDelete: (event: SyntheticEvent) => void;
}

type HandlerType = (action: string, url: string) => () => void;

export function convertBlockToJSX(
  block: IElementBlock,
  hoverHanler: HandlerType,
  index: number
) {
  let JSXResult: JSX.Element | null = null;
  switch (block.type) {
    case EMessageBlocks.Link:
      JSXResult = (
        <div
          onMouseOver={hoverHanler("enter", block.text)}
          onMouseOut={hoverHanler("leave", block.text)}
          key={index}
        >
          <a target="_blank" rel="noopener noreferrer" href={"//" + block.text}>
            {block.text}
          </a>
        </div>
      );
      break;
    case EMessageBlocks.PlainText:
      JSXResult = (
        <p key={index} className="plain-message">
          {block.text}
        </p>
      );
      break;
    case EMessageBlocks.InfoText:
      JSXResult = (
        <p key={index} className="info-message">
          {block.text}
        </p>
      );
      break;
    default:
      break;
  }
  return JSXResult;
}

export function ChatMessage({
  tag,
  editable = false,
  messageEntry,
  onEdit,
  onDelete
}: ChatMessageProps) {
  const { messageBlocks = [], author, timeView } = messageEntry;

  const [showLinkPreview, setShowLinkPreview] = useState(false);
  const [url, setUrl] = useState("");

  const mouseEnterHandler = (action: string, text: string) => () => {
    const hasEnteredLink = action === "enter";

    setShowLinkPreview(hasEnteredLink);
    setUrl(hasEnteredLink ? text : "");
  };

  const messageContent = (
    <Fragment>
      {messageBlocks.map((block, index) =>
        convertBlockToJSX(block, mouseEnterHandler, index)
      )}
    </Fragment>
  );

  const handleClick = (event: MouseEvent) => {
    console.log(event.currentTarget);
    (event.currentTarget as HTMLElement).classList.toggle(".activated");
  };

  return (
    <MessageWrapper
      onClick={handleClick}
      className={editable ? `editable` : ""}
    >
      <Author>{author}</Author>
      <Time>{timeView}</Time>

      <Fragment>
        <Message>{messageContent}</Message>
        {showLinkPreview && <PreviewLink url={url} />}
        <Actions>
          <PenIcon data-tag={tag} onClick={onEdit} />
          <DeleteIcon data-tag={tag} onClick={onDelete} />
        </Actions>
      </Fragment>
    </MessageWrapper>
  );
}
