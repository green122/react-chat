module.exports = function() {
  const clients = new Map();

  function sendMessage(socket, message) {
    try {
      const messageString = JSON.stringify(message);
      socket.send(messageString);
    } catch (error) {
      return error;
    }
  }

  function addClient(id, user) {    
    if (clients.has(id)) {
      const client = clients.get(id);
      client.connections.add(user.socket);
      return;
    }
    clients.set(id, { id, nickName: user.nickName, connections: new Set([user.socket]) });
  }

  function deleteConnection(id, socket) {
    if(!clients.has(id)) {
      return;
    }
    clients.get(id).connections.delete(socket);
    return getClientsConnections(id) > 0
  }

  function getClientById(id) {
    return clients.get(id);
  }

  function getClientsConnections(id) {
    const client = getClientById(id);
    return client && client.connections && client.connections.size;
  }

  function sendMessageToClient(message, client) {
    client &&
      client.connections &&
      client.connections.forEach(socket => sendMessage(socket, message));
  }

  function sendMessageToClientById(message, id) {
    sendMessageToClient(message, getClientById(id));
  }

  function broadCastMessage(message, excludeUserId) { 
    clients.forEach((client, key) => {
      if (key === excludeUserId) {
        return;
      }
      sendMessageToClient(message, client);
    });
  }

  function getClients() {
    return Array.from(clients.values());
  }

  return {
    addClient,
    getClients,
    getClientById,
    deleteConnection,
    sendMessageToClientById,
    broadCastMessage,
    getClientsConnections,
    sendMessage
  }
};
