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
  for (const key in clients) {
    const clientSocket = clients[key].socket;
    if (key !== excludeUser && clientSocket.readyState === clientSocket.OPEN) {
      sendMessage(clientSocket, message);
    }
  }
}

function addAndBroadcastMessage(messageText, authorId, excludeUserId) {
  const messageId = String(Date.now());
  const messageEntry = {
    id: messageId,
    messageText,
    time: Date.now(),
    authorId
  };
  messages[messageId] = messageEntry;
  messagesIds.push(messageId);
  broadcast({ type: "message", payload: messageEntry }, excludeUserId);
}

function sendMessage(socket, message) {
  try {
    const messageString = JSON.stringify(message);
    socket.send(messageString);
  } catch (error) {
    return error;
  }
}

function sendLoggedData(socket, user) {
  const clientsList = Object.keys(clients).reduce((acc, current) => {
    return [...acc, { id: current, nickName: clients[current].nickName }];
  }, []);
  addAndBroadcastMessage(`${user.nickName} joined`, "bot", user.id);
  const messagesList = messagesIds.map(id => messages[id]);
  const loggedMessage = {
    type: "userEntered",
    payload: {
      user,
      time: Date.now()
    }
  };
  sendMessage(socket, { type: "logged", payload: user });
  sendMessage(socket, { type: "usersList", payload: clientsList });
  sendMessage(socket, { type: "lastMessages", payload: messagesList });
  broadcast(loggedMessage, user.id);
}

webSocketServer.on("connection", socket => {
  let id;

  console.log("opened", socket);

  socket.on("message", function(rawMessage) {
    const incomingMessage = JSON.parse(rawMessage);
    console.log(incomingMessage);
    switch (incomingMessage.event) {
      case "message":
        console.log(id);
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
        id = incomingMessage.payload;
        const restoredNickName = (clients[id] && clients[id].nickName) || "";
        if (!restoredNickName) {
          sendMessage(socket, { type: "noAuth", id });
          break;
        }
        if (clients[id].online) {
          sendLoggedData(socket, { id, nickName: restoredNickName });
        } else {
          
        }
        break;

      case "register":
        id = String(Math.random());
        clients[id] = { socket, nickName: incomingMessage.payload };
        const user = { id, nickName: incomingMessage.payload };
        sendLoggedData(socket, user);
        break;

      default:
        break;
    }
  });

  socket.on("close", function() {
    if (!id || !clients[id]) {
      return;
    }
    addAndBroadcastMessage(`${clients[id].nickName} left`, "bot", id);
    broadcast(
      {
        type: "userLeft",
        payload: {
          user: { id, nickName: clients[id].nickName },
          time: Date.now()
        }
      },
      id
    );
  });
});
