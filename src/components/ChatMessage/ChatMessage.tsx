import React, { SyntheticEvent, Fragment, useState, MouseEvent } from "react";
import { IMappedMessage, IElementBlock, EMessageBlocks } from "../../models";
import { PreviewLink } from "../LinkPreview/LinkPreview";
import {
  MessageWrapper,
  Author,
  Time,
  PenIcon,
  DeleteIcon,
  Message,
  Actions
} from "./ChatMessage.ui";

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
