export interface IAction {
  type: EActionTypes;
  payload: any;
}

export interface IMessage {
  messageText: string;
  id?: string;
  authorId?: string;
  time?: number;
  isModified?: boolean;
  isDeleted?: boolean;
}

export interface IUser {
  id: string;
  nickName: string;
}

export enum EActionTypes {
  AddMessage = "Add message",
  LoadUsers = "Load users",
  SetConnected = "Set connected",
  Logged = "Logged",
  EditMessage = "Edit message",
  DeleteMessage = "Delete message"
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
