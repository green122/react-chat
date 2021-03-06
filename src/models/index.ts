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

export interface IElementBlock {
  type: EMessageBlocks;
  text: string;
}

export interface IMappedMessage extends IMessage {
  author: string;
  timeView: string;
  messageBlocks?: IElementBlock[];
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
  GetMessagesList = "Get Messages List",
  DeleteMessage = "Delete message",
  UserJoined = "User Joined",
  UserLeft = "User Left",
  SetNickName = "Set Nick Name",
  AuthProcessing = "AuthProcessing",
  ConnectionError = "Connection Error"
}

export interface State {
  userId: string;
  nickName: string;
  isAuthProcessing: { isProcessing: boolean; isChecked: boolean };
  connectionError: boolean;
  connected: boolean;
  users: IUser[];
  messages: IMessage[];
}

export enum ETabs {
  Participants = "Participants",
  Chat = "Chat"
}

export enum EMessageBlocks {
  Link = "link",
  PlainText = "text",
  InfoText = "info"
}

export type SubmitFunctionType = (value: string) => void;
