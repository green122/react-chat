const WebSocketServer = new require("ws");
const webSocketServer = new WebSocketServer.Server({
  port: process.env.PORT || 8081
});

const createClientsHandlers = require("./clients.controller");
const createMessagesController = require("./messages.controller");
const createChatMessagesController = require("./chatMessages.controller");

function broadCastChatMessage(message, excludeUserId) {
  const addedMessage = addNewMessage(message);
  broadCastMessage({ type: "message", payload: addedMessage }, excludeUserId);
}

const {
  addNewMessage,
  deleteMessage,
  getMessages,
  modifyMessage
} = createChatMessagesController();
const {
  addClient,
  deleteConnection,
  broadCastMessage,
  getClientsConnections,
  sendMessage,
  sendMessageToClientById,
  getConnectedClients,
  getClientById
} = createClientsHandlers();

function sendDataToLoggedUser(id) {
  sendMessageToClientById(
    { type: "users", payload: getConnectedClients() },
    id
  );
  sendMessageToClientById(
    {
      type: "history",
      payload: getMessages().filter(({ userId }) => userId !== id)
    },
    id
  );
}

webSocketServer.on("connection", socket => {
  let id;
  socket.on(
    "message",
    createMessagesController({
      // set all users data for a new client
      register: payload => {
        id = String(Math.random()).slice(2);
        addClient(id, { ...payload, id, socket });
        broadCastMessage({ type: "joined", payload: { ...payload, id } }, id);
        broadCastChatMessage(
          {
            messageText: `${payload.nickName} joined`,
            authorId: "bot",
            userId: id
          },
          id
        );
        sendMessage(socket, { type: "logged", payload: { ...payload, id } });
        sendDataToLoggedUser(id);
      },
      modifyMessage: payload => {
        const modifiedMessage = modifyMessage(payload);
        broadCastMessage({ type: "modifyMessage", payload: modifiedMessage });
      },
      deleteMessage: payload => {
        const deletedMessage = deleteMessage(payload.id);
        broadCastMessage({ type: "deleteMessage", payload: deletedMessage });
      },
      setId: payloadId => {
        const client = getClientById(payloadId);
        if (!client || !client.nickName) {
          sendMessage(socket, { type: "noAuth", id: payloadId });
          return;
        }
        addClient(payloadId, { id: payloadId, socket });
        id = payloadId;
        sendMessage(socket, {
          type: "logged",
          payload: { nickName: client.nickName, id }
        });
        sendDataToLoggedUser(id);
      },
      message: message => broadCastChatMessage({ ...message, authorId: id })
    })
  );

  socket.on("close", function() {
    if (!id) {
      return;
    }
    const connectionsLeft = deleteConnection(id, socket);
    setTimeout(() => {
      if (!getClientsConnections(id)) {
        broadCastChatMessage(
          {
            messageText: `${getClientById(id).nickName} left`,
            authorId: "bot",
            userId: id
          },
          id
        );
      }
    }, 5000);
  });
});
