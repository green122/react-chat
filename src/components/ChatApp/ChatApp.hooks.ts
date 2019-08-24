import { useEffect } from "react";

let client: WebSocket;

function isClientReady() {
  return client && client.readyState === client.OPEN;
}

export const useWebsocket = () => {
  useEffect(() => {
    if (!isClientReady()) {
      client = new WebSocket("ws://localhost:8081");
    }
    client.onmessage = (event: MessageEvent) => {
      console.log("!!!!!", event, client);
    };
    client.onopen = () => client.send("supermessage");
    return () => {
      client.close();
    };
  }, []);

  function sendMessage(message: any) {
    if (isClientReady()) {
      client.send(message);
    }
  }

  return { sendMessage };
};
