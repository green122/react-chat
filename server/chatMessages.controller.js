module.exports = function() {
  const messages = new Map();

  function addNewMessage(message) {
    const id = String(Math.random()).slice(2);
    const messageEntry = {
      ...message,
      id,
      time: Date.now()
    };
    messages.set(id, messageEntry);
    return messageEntry;
  }

  function getMessages() {
    return Array.from(messages.values());
  }

  function modifyMessage(newMessage) {
    const messageEntry = messages.get(newMessage.id);
    if (!messageEntry) {
      return;
    }
    messageEntry.messageText = newMessage.messageText;
    messageEntry.time = Date.now();
    messageEntry.isModified = true;
    messages.set(newMessage.id, messageEntry);    
    return messageEntry;
  }

  function deleteMessage(id) {
    const messageEntry = messages.get(id);
    if (!messageEntry) {
      return;
    }
    messageEntry.time = Date.now();
    messageEntry.isDeleted = true;
    messages.set(id, messageEntry);
    return messageEntry;
  }

  return {
    addNewMessage,
    getMessages,    
    modifyMessage,
    deleteMessage
  };
};
