import React, { useEffect } from "react";
import { ChatApp } from "./components/ChatApp/ChatApp";
import cookie from "js-cookie";

import {
  useMessagesReducer,
  useWebsocket
} from "./components/ChatApp/ChatApp.hooks";
import styled from "styled-components";
import { EActionTypes } from "./models";
import { Auth } from "./components/Auth/Auth";

const Container = styled.article`
  @import url("https://fonts.googleapis.com/css?family=Poppins&display=swap");

  font-family: "Poppins", sans-serif;
  width: 100%;
  height: 100vh;
  align-items: center;
  display: flex;
  background-color: #dddddd;
`;

const authInfoExists = () => {
  return Boolean(cookie.get("chat-ts-app"));
};

const App: React.FC = () => {
  const [state, dispatch] = useMessagesReducer();
  const { sendMessage, emitEvent } = useWebsocket(dispatch);
  const { users, messages, userId, connected } = state;

  useEffect(() => {
    const userCookie = cookie.get("chat-ts-app");
    if (!userCookie || !connected) {
      return;
    }
    dispatch({
      type: EActionTypes.AuthProcessing,
      payload: { isProcessing: true, isChecked: false }
    });
    emitEvent("setId", userCookie);
    // eslint-disable-next-line
  }, [connected]);

  const { isAuthProcessing, nickName } = state;

  const shouldCheckUser =
    authInfoExists() && !isAuthProcessing.isChecked && !nickName;
  if (isAuthProcessing.isProcessing || shouldCheckUser) return null;
  return (
    <Container>
      {nickName ? (
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
