import React, {
  useState,
  KeyboardEvent,
  useRef,
  useEffect,
  RefObject
} from "react";
import styled from "styled-components";
import { SubmitFunctionType } from "../../models";

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
    if (!message) {
      return;
    }
    const element = textRef.current as HTMLElement;
    const topPadding = +(window
      .getComputedStyle(element)
      .getPropertyValue("padding-top")
      .match(/^\d*/) || [])[0];
    const bottomPadding = +(window
      .getComputedStyle(element)
      .getPropertyValue("padding-bottom")
      .match(/^\d*/) || [])[0];
    element.style.height = "15px";
    element.style.height =
      element.scrollHeight - topPadding - bottomPadding + "px";
  }, [message]);

  if (value !== prevValue) {
    setMessage(value);
    setPrevValue(value);
  }

  const keyHandler = (evt: KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.key === "Enter") {
      onSubmit(message);
      setMessage("");
      textRef.current && textRef.current.focus();
    }
  };

  const handleChange = (evt: any) => {
    // ignore line feed character after clearing
    if (evt.target.value.charCodeAt(0) === 10 && textRef.current) {
      textRef.current.style.height = window.innerWidth > 360 ? "35px" : "25px";
      return;
    }
    setMessage(evt.target.value);
  };

  return (
    <ChatInputView
      value={message}
      ref={textRef}
      placeholder="Message"
      onChange={handleChange}
      onKeyPress={keyHandler}
    />
  );
}

const ChatInputView = styled.textarea`
  resize: none;
  overflow: hidden;
  font-family: "Poppins", sans-serif;
  min-height: 24px;
  max-height: 100px;
  margin: 0 30px 10px 10px;
  border-radius: 20px;
  border: 1px solid darkgrey;
  height: 35px;
  padding: 20px;
  outline: none;
  &[placeholder] {
    font-size: 24px;
    padding-left: 10px;
  }
  @media (max-width: 360px) {
    margin: 0px 10px 0px 10px;
    padding: 10px;
    height: 25px;
    &[placeholder] {
      font-size: 16px;
      padding-left: 10px;
    }
  }
`;
