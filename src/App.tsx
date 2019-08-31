import React, { useEffect } from "react";
import { ChatApp } from "./components/ChatApp/ChatApp";
import cookie from "js-cookie";

import { ChatInput } from "./components/ChatInput/ChatInput";
import {
  useMessagesReducer,
  useWebsocket
} from "./components/ChatApp/ChatApp.hooks";
import styled from "styled-components";
import { EActionTypes } from "./models";
import { Auth } from "./components/Auth/Auth";

const Container = styled.article`
  @font-face {
    font-family: "Lexend Deca";
    src: url("./ui-res/LexendDeca-Regular.ttf") format("ttf");
  }
  font-family: "Lexend Deca", sans-serif;
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
    dispatch({ type: EActionTypes.AuthProcessing, payload: true });
    emitEvent("setId", userCookie);
  }, [connected]);

  const { isAuthProcessing, nickName } = state;

  if (isAuthProcessing) return null;
  return (
    <Container>
      {state.connected && nickName ? (
        <ChatApp
          messages={messages}
          userId={userId}
          users={users}
          sendMessage={sendMessage}
        />
      ) : state.connected ? (
        <Auth onSubmit={nickName => emitEvent("register", { nickName })} />
      ) : null}
    </Container>
  );
};

export default App;
