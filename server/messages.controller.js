module.exports = function(handlersMap) {
  return function(messageString) {
    let incomingMessage;
    try {
      incomingMessage = JSON.parse(messageString);
    } catch (error) {
      return { error };
    }
    if (!incomingMessage) {
      return { error: "empty message" };
    }
    const { type, payload } = incomingMessage;
    if (!(type in handlersMap)) {
      return { error: "Wrong message type" };
    }
    return handlersMap[type](payload);
  };
};
