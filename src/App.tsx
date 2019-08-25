import React, { useState } from "react";
import { ChatApp } from "./components/ChatApp/ChatApp";

import "./App.css";
import { ChatInput } from "./components/ChatInput/ChatInput";
import {
  useMessagesReducer,
  useWebsocket
} from "./components/ChatApp/ChatApp.hooks";

const App: React.FC = () => {
  const [nickName, setNickName] = useState("");
  const [state, dispatch] = useMessagesReducer();
  const { sendMessage } = useWebsocket(dispatch, nickName);

  return state.connected && nickName ? (
    <ChatApp
      messages={state.messages}
      users={state.users}
      sendMessage={sendMessage}
    />
  ) : state.connected ? (
    <ChatInput onSubmit={setNickName} value="" />
  ) : null;
};

export default App;
