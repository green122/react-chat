const WebSocketServer = new require("ws");

// подключённые клиенты
const clients = {};

// WebSocket-сервер на порту 8081
const webSocketServer = new WebSocketServer.Server({
  port: 8081
});

const messages = {};
const messagesIds = [];

function broadcast(message) {
  const messageString = JSON.stringify(message);
  for (const key in clients) {
    clients[key].socket.send(messageString);
  }
}

webSocketServer.on("connection", socket => {
  const id = Math.random();
  clients[id] = { socket };

  socket.on("send-nickname", nickname => {});

  socket.on("message", function(rawMessage) {
    const incomingMessage = JSON.parse(rawMessage);

    switch (incomingMessage.event) {
      case "message":
        const messageEntry = {
          message: incomingMessage.payload,
          time: Date.now(),
          author: id
        };
        const messageId = Date.now();
        messages[messageId] = messageEntry;
        messagesIds.push(messageId);
        broadcast({ type: "message", payload: messageEntry });
        break;
      case "setNickName":
        clients[id].nickname = incomingMessage.payload;
        const clientsList = Object.keys(clients).reduce((acc, current) => {
            return [...acc, { id: current, nickname: clients[current].nickname }];
        }, []);
        
        const loggedMessage = {
          type: "userEntered",
          clients: clientsList
        };
        socket.send(JSON.stringify({ type: 'logged', id, nickname: incomingMessage.payload}))
        broadcast(loggedMessage);
        break;

      default:
        break;
    }
  });

  socket.on("close", function() {
    console.log("соединение закрыто " + id);
    delete clients[id];
  });
});
