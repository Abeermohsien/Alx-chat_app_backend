const express = require('express');
const WebSocket = require('ws');

const app = express();
const port = 3000;

// creating the  HTTP server
const server = require('http').createServer(app);

// creating the WebSocket server
const wss = new WebSocket.Server({ server });

// handling the WebSocket connections
wss.on('connection', (ws) => {
  console.log('Client connected');

  // handling incoming messages from clients
  ws.on('message', (message) => {
    console.log('Received:', message);

    // broadcasting the message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // handling the client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// starting the server
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
