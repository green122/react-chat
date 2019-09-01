import React, { useRef, KeyboardEvent } from "react";
import styled from "styled-components";
import { SubmitFunctionType } from "../../models";

const NameInput = styled.input`
  font-family: "Poppins", sans-serif;
  min-height: 24px;
  max-height: 100px;
  margin: 0 30px 10px 10px;
  border-radius: 20px;
  border: 1px solid darkgrey;
  height: 24px;
  padding: 20px;
  outline: none;
  width: 300px;
  &[placeholder] {
    font-size: 20px;
    padding-left: 10px;
  }
  @media (max-width: 360px) {
    width: 250px;
  }
`;

const Container = styled.div`
  margin: auto;
`;

export function Auth({ onSubmit }: { onSubmit: SubmitFunctionType }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const keyHandler = (evt: KeyboardEvent) => {
    if (evt.key === "Enter") {
      onSubmit((inputRef.current as HTMLInputElement).value);
    }
  };
  return (
    <Container>
      <NameInput
        ref={inputRef}
        onKeyPress={keyHandler}
        placeholder="Enter your nickname"
      />
    </Container>
  );
}
