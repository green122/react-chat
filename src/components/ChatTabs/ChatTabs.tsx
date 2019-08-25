import React, { useState, KeyboardEvent } from "react";
import styled from "styled-components";
import { ETabs } from "../../models";

const ChatInputView = styled.input`
  width: 400px;
  height: 100%;
`;

type onChangeHandler = (value: ETabs) => void;
export function ChatTabs({ onChange } : {onChange: onChangeHandler  } ) {    
    const [message, setMessage] = useState('');

   
}
