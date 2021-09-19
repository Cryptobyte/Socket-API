require('dotenv').config();

const mongoose = require('mongoose');
const WebSocketServer = require('ws').Server;
const handlers = require('./handlers');

mongoose.connect(process.env.MONGOOSE);

let wss;

/*
 * Wait for mongoose to connect to the database before opening the web socket
 */
mongoose.connection.on('connected', () => {
  // Basic WebSocket server
  wss = new WebSocketServer({ port: 8080 });

  // Interval to ensure clients are not stalled
  const wka = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) 
        return ws.terminate();

      ws.isAlive = false;
      ws.ping();
    });

  }, 30000);

  wss.on('connection', (ws) => {
    ws.isAlive = true;

    ws.on('message', async(message) => {
      let data;

      try {
        data = JSON.parse(message);

      } catch (err) {
        ws.send(JSON.stringify({
          error: err.message
        }));

        return;
      }

      // Ping is used to keep sockets alive, no further processing is needed..
      if ((data.type) && (data.type === 'ping')) {
        ws.isAlive = true; 
        return;
      }

      // Check if the request includes required parameters, in this case `route` 
      // which is used to determine which handler to send the data to
      if (!data.route) {
        ws.send(JSON.stringify({
          error: 'Invalid route'
        }));
      }

      // Send the response from the handler, we should throw errors back 
      // insteaf of handling them in the handlers to make this more standardized
      ws.send(JSON.stringify(await handlers.route(data.route, data)));
    });
  });

  wss.on('close', () => {
    clearInterval(wka);
  });
});

/*
 * If mongoose disconnects from the database we close the web socket server for safety
 */
mongoose.connection.on('disconnected', () => {
  if (wss) wss.close();
});

/*
 * If mongoose encounters an error with database we close the web socket server for safety
 */
mongoose.connection.on('error', (err) => {
  if (wss) wss.close();
});

/*
 * Manually disconnect the database upon process termination as an extra safety measure
 */
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    process.exit(0);
  });
});