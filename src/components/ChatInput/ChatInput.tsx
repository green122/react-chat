import React, {
  useState,
  KeyboardEvent,
  useRef,
  useEffect,
  RefObject
} from "react";
import styled from "styled-components";

const ChatInputView = styled.textarea`
  resize: none;
  overflow: hidden;
  min-height: 24px;
  max-height: 100px;
  width: 90%;
  border-radius: 20px;
  border: 1px solid darkgrey;
  height: 24px;
  padding: 20px;
  &[placeholder] {
    font-size: 24px;
    padding-left: 10px;
  }
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
  const textRef: RefObject<HTMLTextAreaElement> = useRef(
    {} as HTMLTextAreaElement
  );

  useEffect(() => {
    const element = textRef.current as HTMLElement;
    element.style.height = "5px";
    element.style.height = element.scrollHeight + "px";
  }, [message]);

  if (value !== prevValue) {
    setMessage(value);
    setPrevValue(value);
  }

  const keyHandler = (evt: KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.key === "Enter") {
      onSubmit(message);
      setMessage("");
    }
  };

  return (
    <ChatInputView
      value={message}
      ref={textRef}
      placeholder="Message"
      onChange={evt => setMessage(evt.target.value)}
      onKeyPress={keyHandler}
    />
  );
}
