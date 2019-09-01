import { useEffect, useReducer, Dispatch } from "react";
import { State, EActionTypes, IMessage, IAction } from "../../models";
import cookie from "js-cookie";

let client: WebSocket;

const messages: IMessage[] = [];

const initialState: State = {
  userId: "",
  nickName: "",
  isAuthProcessing: { isProcessing: false, isChecked: false },
  connectionError: false,
  connected: false,
  users: [],
  messages
};

const reducer = (state: State, action: IAction): State => {
  const { payload } = action;
  switch (action.type) {
    case EActionTypes.AddMessage:
      return { ...state, messages: [...state.messages, payload] };
    case EActionTypes.LoadUsers:
      return { ...state, users: payload };
    case EActionTypes.AuthProcessing:
      return { ...state, isAuthProcessing: payload };
    case EActionTypes.SetNickName:
      return { ...state, nickName: payload };
    case EActionTypes.Logged:
      return { ...state, userId: payload.id, nickName: payload.nickName };
    case EActionTypes.UserJoined:
      return { ...state, users: [...state.users, payload] };
    case EActionTypes.SetConnected:
      return { ...state, connected: payload };
    case EActionTypes.ConnectionError:
      return { ...state, connectionError: payload };
    case EActionTypes.GetMessagesList:
      return { ...state, messages: payload };
    case EActionTypes.UserLeft:
      return {
        ...state,
        users: state.users.filter(({ id }) => id !== payload.user.id)
      };
    case EActionTypes.EditMessage:
    case EActionTypes.DeleteMessage:
      const messageIndex = state.messages.findIndex(
        ({ id }) => id === payload.id
      );
      if (messageIndex > -1) {
        const newMessages = Object.assign([], state.messages, {
          [messageIndex]: payload
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

export const useWebsocket = (dispatch: Dispatch<IAction>) => {
  useEffect(() => {
    if (!client) {
      client = new WebSocket("ws://localhost:8081");
    }

    client.onmessage = (event: MessageEvent) => {
      let messageData;
      try {
        messageData = JSON.parse(event.data);
      } catch (error) {
        console.error("Bad answer");
        return;
      }
      const { payload } = messageData;
      switch (messageData.type) {
        case "message":
          dispatch({ type: EActionTypes.AddMessage, payload });
          break;
        case "logged":
          dispatch({ type: EActionTypes.Logged, payload });
          dispatch({
            type: EActionTypes.AuthProcessing,
            payload: { isProcessing: false, isChecked: true }
          });
          cookie.set("chat-ts-app", payload.id);
          break;
        case "modifyMessage":
          dispatch({ type: EActionTypes.EditMessage, payload });
          break;
        case "noAuth":
          dispatch({ type: EActionTypes.SetNickName, payload: "" });
          dispatch({
            type: EActionTypes.AuthProcessing,
            payload: { isProcessing: false, isChecked: true }
          });
          break;
        case "deleteMessage":
          dispatch({ type: EActionTypes.DeleteMessage, payload });
          break;
        case "users":
          dispatch({ type: EActionTypes.LoadUsers, payload });
          break;
        case "history":
          dispatch({ type: EActionTypes.GetMessagesList, payload });
          break;
        case "joined":
          dispatch({ type: EActionTypes.UserJoined, payload });
          break;
        case "userLeft":
          dispatch({ type: EActionTypes.UserLeft, payload });
          break;
        default:
          break;
      }
    };

    client.onopen = () => {
      dispatch({ type: EActionTypes.SetConnected, payload: true });
    };
    client.onclose = event => {
      if (event.wasClean) {
        dispatch({ type: EActionTypes.SetConnected, payload: false });
      } else {
        dispatch({ type: EActionTypes.ConnectionError, payload: true });
      }
    };
    return () => {
      client.close();
    };
  }, [dispatch]);

  function emitEvent(type: string, payload: any) {
    if (isClientReady()) {
      const data = JSON.stringify({ type, payload });
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

  return { sendMessage, emitEvent };
};
