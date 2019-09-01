import { IMessage, IMappedMessage, IUser, IElementBlock, EMessageBlocks } from "../models";

export function getTimeString(time: number) {
  const date = new Date(time);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  return `${date.getHours()}:${minutes}`;
}

const urlRegEx = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
export function parseToBlocks({messageText = '', authorId, isModified, isDeleted}: IMessage): IElementBlock[] {
  const splittedByUrl = messageText.split(urlRegEx);
  if (authorId === 'bot') {
    return [{type: EMessageBlocks.InfoText, text: messageText}]
  }
  if (isDeleted) {
    return [{type: EMessageBlocks.InfoText, text: 'Message deleted'}]
  }
  const mappedToBlocks: IElementBlock[] = splittedByUrl
    .filter(Boolean)
    .map(text => {
      const type = urlRegEx.test(text) ? EMessageBlocks.Link : EMessageBlocks.PlainText;
      return { type, text: text.trim() };
    });
    if (isModified) {
      mappedToBlocks.push({type: EMessageBlocks.InfoText, text: '(edited)'})
    }

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
          ? "Meetingbot"
          : (users.find(({ id }) => id === message.authorId) || ({} as IUser))
              .nickName;
      return {
        ...message,
        messageBlocks: parseToBlocks(message),
        author,
        timeView: getTimeString(message.time || 0)
      };
    })
    .filter(({ author }) => Boolean(author));
  return messagesWithUser;
}
