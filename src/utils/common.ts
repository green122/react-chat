import { IMessage, IMappedMessage, IUser } from "../models";

export function getTimeString(time: number) {
  const date = new Date(time);
  return `${date.getHours()}:${date.getMinutes()}`;
}

export function getMappedMessages(
  messages: IMessage[],
  users: IUser[]
): IMappedMessage[] {
  const messagesWithUser: IMappedMessage[] = messages.map(message => ({
    ...message,
    author: (users.find(({ id }) => id === message.authorId) || ({} as IUser))
      .nickName,
    timeView: getTimeString(message.time || 0)
  }));
  return messagesWithUser;
}
