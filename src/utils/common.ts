import { IMessage, IMappedMessage, IUser } from "../models";

export function getTimeString(time: number) {
  const date = new Date(time);
  return `${date.getHours()}:${date.getMinutes()}`;
}

export function getMappedMessages(
  messages: IMessage[],
  users: IUser[]
): IMappedMessage[] {
  const messagesWithUser: IMappedMessage[] = messages
    .map(message => {
      const author =
        message.authorId === "bot"
          ? "MessageBot"
          : (users.find(({ id }) => id === message.authorId) || ({} as IUser))
              .nickName;
      return {
        ...message,
        author,
        timeView: getTimeString(message.time || 0)
      };
    })
    .filter(({ author }) => Boolean(author));
  return messagesWithUser;
}
