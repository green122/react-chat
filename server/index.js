const WebSocketServer = new require("ws");

const clients = {};

const webSocketServer = new WebSocketServer.Server({
  port: 8081
});

const messages = {};
const messagesIds = [];

function broadcast(message, excludeUser) {
  const messageString = JSON.stringify(message);
  console.log('broadcast', message, 'noto', excludeUser);
  for (const key in clients) {
    console.log(typeof(key), typeof(excludeUser));
    if (key !== excludeUser) {
      clients[key].socket.send(messageString);
    }
  }
}

webSocketServer.on("connection", socket => {
  const id = Math.random();
  clients[id] = { socket };
  console.log('opened', id);

  socket.on("message", function(rawMessage) {
    const incomingMessage = JSON.parse(rawMessage);
    console.log(incomingMessage);
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
        clients[id].nickName = incomingMessage.payload;
        const clientsList = Object.keys(clients).reduce((acc, current) => {
          return [...acc, { id: current, nickName: clients[current].nickname }];
        }, []);

        const loggedMessage = {
          type: "userEntered",
          payload: {
            user: { id, nickName: incomingMessage.payload },
            time: Date.now()
          }
        };
        socket.send(JSON.stringify({ type: "logged", payload: id }));
        console.log('userLogged:', id, incomingMessage.payload);       
        broadcast(loggedMessage, String(id));
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
