import { getMappedMessages } from "./common";
import { IMessage, IUser } from "../models";

describe("Map messages function", () => {
  it("should return messages with users", () => {
    const messages: IMessage[] = [
      {
        messageText: "test1",
        authorId: "000"
      },
      {
        messageText: "test2",
        authorId: "001"
      },
      {
        messageText: "test3",
        authorId: "003"
      }
    ];
    const users: IUser[] = [
      {
        id: "000",
        nickName: "Jackie Chan"
      },
      {
        id: "001",
        nickName: "Bruce Lee"
      },
      {
        id: "002",
        nickName: "Darth Weider"
      }
    ];
    const mappedMessages = getMappedMessages(messages, users);
    const expected = [
      {
        author: "Jackie Chan",
        authorId: "000",
        messageBlocks: [
          {
            text: "test1",
            type: "text"
          }
        ],
        messageText: "test1",
        timeView: "3:00"
      },
      {
        author: "Bruce Lee",
        authorId: "001",
        messageBlocks: [
          {
            text: "test2",
            type: "text"
          }
        ],
        messageText: "test2",
        timeView: "3:00"
      }
    ];
    expect(mappedMessages).toEqual(expected);
  });
});
