import { useEffect, useReducer, Dispatch } from "react";
import { State, EActionTypes, IMessage, IAction } from "../../models";

let client: WebSocket;

const messages: IMessage[] = [];

const initialState: State = { connected: false, users: [], messages };

const reducer = (state: State, action: IAction): State => {
  switch (action.type) {
    case EActionTypes.AddMessage:
      return { ...state, messages: [...state.messages, action.payload] };
    case EActionTypes.LoadUsers:
      return { ...state, users: action.payload };
    case EActionTypes.SetConnected:
      return { ...state, connected: action.payload };
    case EActionTypes.EditMessage:
      const messageIndex = state.messages.findIndex(
        ({ id }) => id === action.payload.id
      );
      if (messageIndex > -1) {
        const newMessages = Object.assign([], state.messages, {
          [messageIndex]: action.payload
        });
        return { ...state, messages: newMessages };
      }
      return state;
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
    if (!client) {
      client = new WebSocket("ws://localhost:8081");
    }

    client.onmessage = (event: MessageEvent) => {
      const messageData = JSON.parse(event.data);
      const { payload } = messageData;
      switch (messageData.type) {
        case "message":
          dispatch({ type: EActionTypes.AddMessage, payload });
          break;
        case "logged":
          dispatch({ type: EActionTypes.Logged, payload });
          break;
        case "modifyMessage":
          dispatch({ type: EActionTypes.EditMessage, payload });
          break;
        case "deleteMessage":
          dispatch({ type: EActionTypes.DeleteMessage, payload });
          break;
        case "userEntered":
          const messageJoin: IMessage = {
            messageText: `${payload.user.nickName} joined`,
            authorId: "bot",
            time: payload.time
          };
          dispatch({ type: EActionTypes.AddMessage, payload: messageJoin });
          break;
        default:
          break;
      }
    };

    client.onopen = () => {
      dispatch({ type: EActionTypes.SetConnected, payload: true });
    };
    client.onclose = () => {
      dispatch({ type: EActionTypes.SetConnected, payload: false });
    };
    return () => {
      client.close();
    };
  }, [dispatch]);

  useEffect(() => {
    if (nickName) {
      emitEvent("setNickName", nickName);
    }
  }, [nickName]);

  function emitEvent(event: string, payload: any) {
    if (isClientReady()) {
      const data = JSON.stringify({ event, payload });
      client.send(data);
    }
  }

  function sendMessage(message: IMessage) {
    const eventName = message.isModified
      ? "modifyMessage"
      : message.isDeleted
      ? "deleteMessage"
      : "message";
    emitEvent(eventName, message);
  }

  return { sendMessage };
};
