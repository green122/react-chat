import React, { useState } from "react";
import { ChatApp } from "./components/ChatApp/ChatApp";

import "./App.css";
import { ChatInput } from "./components/ChatInput/ChatInput";
import {
  useMessagesReducer,
  useWebsocket
} from "./components/ChatApp/ChatApp.hooks";
import styled from "styled-components";

const Container = styled.article`
  width: 100%;
  height: 100%;
  background-color: #dddddd;
`;

const App: React.FC = () => {
  const [nickName, setNickName] = useState("");
  const [state, dispatch] = useMessagesReducer();
  const { sendMessage } = useWebsocket(dispatch, nickName);
  const { users, messages, userId } = state;

  const Component = () =>
    state.connected && nickName ? (
      <ChatApp
        messages={messages}
        userId={userId}
        users={users}
        sendMessage={sendMessage}
      />
    ) : state.connected ? (
      <ChatInput onSubmit={setNickName} value="" />
    ) : null;

  return (
    <Container>
      <Component />
    </Container>
  );
};

export default App;
