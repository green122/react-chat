import { IMessage, IMappedMessage, IUser, IElementBlock } from "../models";

export function getTimeString(time: number) {
  const date = new Date(time);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  return `${date.getHours()}:${minutes}`;
}

const urlRegEx = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
export function parseWithContent(message: string): IElementBlock[] {
  const splittedByUrl = message.split(urlRegEx);
  const mappedToBlocks: IElementBlock[] = splittedByUrl
    .filter(Boolean)
    .map(text => {
      const type = urlRegEx.test(text) ? "a" : "p";
      return { type, text: text.trim() };
    });
  return mappedToBlocks;
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
        messageBlocks: parseWithContent(message.messageText),
        author,
        timeView: getTimeString(message.time || 0)
      };
    })
    .filter(({ author }) => Boolean(author));
  return messagesWithUser;
}
