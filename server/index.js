const WebSocketServer = new require('ws');

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

webSocketServer.on('connection', socket => {
    const id = Math.random();
    clients[id] = {socket};
    console.log('новое соединение ' + id);

    socket.on('send-nickname', nickname => {
        clients[id].nickname = nickname;
    });

    socket.on('message', function(message) {
        console.log('получено сообщение ' + message);

        const messageEntry = {
            message,
            time: Date.now(),
            author: id
        };
        const messageId = Date.now();
        messages[messageId] = messageEntry;
        messagesIds.push(messageId);

        broadcast(messageEntry);
        
    });

    socket.on('close', function() {
        console.log('соединение закрыто ' + id);
        delete clients[id];
    });
});
