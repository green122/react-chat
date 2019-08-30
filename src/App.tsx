import React, { useState, useEffect } from "react";
import { ChatApp } from "./components/ChatApp/ChatApp";
import axios from "axios";
import cookie from "js-cookie";

import { ChatInput } from "./components/ChatInput/ChatInput";
import {
  useMessagesReducer,
  useWebsocket
} from "./components/ChatApp/ChatApp.hooks";
import styled from "styled-components";
import { EActionTypes } from "./models";

const Container = styled.article`
  width: 100%;
  height: 100vh;
  align-items: center;
  display: flex;
  background-color: #dddddd;
`;

const App: React.FC = () => {
  const [state, dispatch] = useMessagesReducer();
  const { sendMessage, emitEvent } = useWebsocket(dispatch);
  const { users, messages, userId, connected } = state;

  useEffect(() => {
    const userCookie = cookie.get("chat-ts-app");
    if (!userCookie || !connected) {
      return;
    }
    dispatch({ type: EActionTypes.AuthProcessing, payload: true});
    emitEvent('setId', userCookie);
  }, [connected]);  

  const { isAuthProcessing, nickName } = state;

  const Component = () => {
    if (isAuthProcessing) return null;
    return state.connected && nickName ? (
      <ChatApp
        messages={messages}
        userId={userId}
        users={users}
        sendMessage={sendMessage}
      />
    ) : state.connected ? (
      <ChatInput onSubmit={nickName => emitEvent('register', nickName)} value="" />
    ) : null;
  };

  return (
    <Container>
      <Component />
    </Container>
  );
};

export default App;
