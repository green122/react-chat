export interface IAction {
  type: EActionTypes;
  payload: any;
}

export interface IMessage {
  messageText: string;
  authorId: string;
  time: number;
}

export interface IUser {
  id: string;
  nickName: string;
}

export enum EActionTypes {
  AddMessage = "Add message",
  LoadUsers = "Load users",
  SetConnected = "Set connected"
}

export interface State {
  connected: boolean;
  users: IUser[];
  messages: IMessage[];
}

export enum ETabs {
  Participants = "Participants",
  Chat = "Chat"
}
