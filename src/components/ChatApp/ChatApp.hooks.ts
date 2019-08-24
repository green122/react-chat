import { useEffect, useReducer, Dispatch } from "react";
import { State, EActionTypes, IMessage, IAction } from "../../models";

let client: WebSocket;



const messages: IMessage[] = [
  {
    messageText: "TESTMESSAGE",
    authorId: "0001",
    time: 1
  },
  {
    messageText: "TESTMESSAGE1",
    authorId: "0002",
    time: 2
  },
  {
    messageText: "TESTMESSAGE2",
    authorId: "0003",
    time: 3
  }
];

const initialState: State = { users: [], messages };

const reducer = (state: State, action: IAction): State => {
  switch (action.type) {
    case EActionTypes.AddMessage:
      return { ...state, messages: [...messages, action.payload] };
    case EActionTypes.LoadUsers:
      return { ...state, users: action.payload };
    default:
      return state;
  }
};

export const useMessagesReducer = () => {
  return useReducer(reducer, initialState);
};

function isClientReady() {
  return client && client.readyState === client.OPEN;
}

export const useWebsocket = (dispatch: Dispatch<IAction>, nickName: string) => {
  useEffect(() => {
    if (!isClientReady()) {
      client = new WebSocket("ws://localhost:8081");
    }
    client.onmessage = (event: MessageEvent) => {
      const messageData = JSON.parse(event.data);
      const {payload} = messageData;
      switch (messageData.type) {
        case "message":
          const message: IMessage = {
            messageText: payload.message,
            authorId: payload.author,
            time: payload.time
          };
          
          dispatch({ type: EActionTypes.AddMessage, payload: message });
          break;
        case "userEntered":
          dispatch({ type: EActionTypes.LoadUsers, payload: messageData.clients });
        default:
          break;
      }
    };
    client.onopen = () => {
      emitEvent("setNickName", nickName);
    };
    return () => {
      client.close();
    };
  }, [dispatch, nickName]);

  function emitEvent(event: string, payload: any) {
    if (isClientReady()) {
      const data = JSON.stringify({ event, payload });
      client.send(data);
    }
  }

  function sendMessage(message: any) {
    emitEvent("message", message);
  }

  return { sendMessage };
};
