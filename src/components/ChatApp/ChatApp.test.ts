import { messageHandler } from "./ChatApp.hooks";

describe("message handler", () => {
  const dispatch = jest.fn();
  const handler = messageHandler(dispatch);

  beforeEach(function() {
    dispatch.mockClear();
  });

  it("should get Add messsage action on new message", () => {
    const messageEvent = {
      data: JSON.stringify({ type: "message", payload: "testmessage" })
    };
    handler(messageEvent as MessageEvent);
    expect(dispatch).toHaveBeenCalledWith({
      type: "Add message",
      payload: "testmessage"
    });
  });

  it("should get 2 actions on user log", () => {
    const messageEvent = {
      data: JSON.stringify({ type: "logged", payload: "testmessage" })
    };
    handler(messageEvent as MessageEvent);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: "Logged",
      payload: "testmessage"
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      payload: {
        isChecked: true,
        isProcessing: false
      },
      type: "AuthProcessing"
    });
  });
});
