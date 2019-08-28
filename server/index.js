const WebSocketServer = new require("ws");
const server = require("express")();

server.use(require("cors")());

const clients = {};

server.get("/auth", (request, response) => {
  const userId = String(request.headers["chat-ts-app"]);
  console.log(clients, userId);
  const client = (clients[userId] && clients[userId].nickName) || {};
  response.json({ nickName: client });
});

server.listen(4000, () => {
  console.log("server started");
});

const webSocketServer = new WebSocketServer.Server({
  port: 8081
});

const messages = {};
const messagesIds = [];

function broadcast(message, excludeUser) {
  const messageString = JSON.stringify(message);
  for (const key in clients) {
    const clientSocket = clients[key].socket;
    if (key !== excludeUser && clientSocket.readyState === clientSocket.OPEN) {
      clientSocket.send(messageString);
    }
  }
}

function addAndBroadcastMessage(messageText, authorId, excludeUserId) {
  const messageEntry = {
    id: Date.now(),
    messageText,
    time: Date.now(),
    authorId
  };
  const messageId = Date.now();
  messages[messageId] = messageEntry;
  messagesIds.push(messageId);
  broadcast({ type: "message", payload: messageEntry }, excludeUserId);
}

webSocketServer.on("connection", socket => {
  const id = String(Math.random());
  clients[id] = { socket };
  console.log("opened", id);

  socket.on("message", function(rawMessage) {
    const incomingMessage = JSON.parse(rawMessage);
    console.log(incomingMessage);
    switch (incomingMessage.event) {
      case "message":
        addAndBroadcastMessage(incomingMessage.payload.messageText, id);
        break;
      case "modifyMessage":
        const modifiedId = incomingMessage.payload.id;
        const modifiedMessageEntry = {
          ...messages[modifiedId],
          ...incomingMessage.payload,
          isModified: true,
          time: Date.now()
        };
        messages[modifiedId] = modifiedMessageEntry;
        broadcast({ type: "modifyMessage", payload: modifiedMessageEntry });
        break;
      case "deleteMessage":
        const deletedId = incomingMessage.payload.id;
        const deletedMessageEntry = {
          ...messages[deletedId],
          isDeleted: true,
          time: Date.now()
        };
        broadcast({ type: "deleteMessage", payload: deletedMessageEntry });
        break;
      case "setId":
        const userId = incomingMessage.payload;
        const restoredNickName =
          (clients[userId] && clients[userId].nickName) || "";
        if (restoredNickName) {
          addAndBroadcastMessage(`${restoredNickName} joined`, "bot", String(id));          
        }
        socket.send(
          JSON.stringify({
            type: "restored",
            payload: restoredNickName
          })
        );
        break;
      case "setNickName":
        clients[id].nickName = incomingMessage.payload;
        const clientsList = Object.keys(clients).reduce((acc, current) => {
          return [...acc, { id: current, nickName: clients[current].nickName }];
        }, []);
        const messagesList = messagesIds.map(id => messages[id]);
        const user = {  id, nickName: incomingMessage.payload };
        const loggedMessage = {
          type: "userEntered",
          payload: {
            user,
            time: Date.now()
          }
        };
        addAndBroadcastMessage(
          `${incomingMessage.payload} joined`,
          "bot",
          String(id)
        );
        socket.send(JSON.stringify({ type: "logged", payload: user }));
        socket.send(
          JSON.stringify({ type: "usersList", payload: clientsList })
        );
        socket.send(
          JSON.stringify({ type: "lastMessages", payload: messagesList })
        );
        broadcast(loggedMessage, id);
        break;

      default:
        break;
    }
  });

  socket.on("close", function() {
    addAndBroadcastMessage(`${clients[id].nickName} left`, "bot", id);
    broadcast(
      {
        type: "userLeft",
        payload: {
          user: { id, nickName: clients[id].nickName },
          time: Date.now()
        }
      },
      String(id)
    );
  });
});
