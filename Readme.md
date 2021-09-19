## WebSocket API
This repository is an experiment in using a WebSocket server to host an HTTP-like API for clients. The goal is to provide faster communication between client and server and allow easy handling of disconnect issues since we can track WebSocket connection live and provide real time status to the user. This is a very basic example that includes a signup and signin route to create and store user accounts, we automatically hash user passwords using [Argon2](https://www.npmjs.com/package/argon2) for greater security and handle authenticated requests with [jwt](https://www.npmjs.com/package/jsonwebtoken) (see notes below). You could easily extend this example to host more data and build out a full featured API.

### Using the Server
1. Run `cd Server && npm i` to change to Server directory and install Server packages
2. Create `.env` file with the following parameters: `MONGOOSE`, `JWT_SECRET` where `MONGOOSE` is your MongoDB connection url and `JWT_SECRET` is your JWT secret (see Notes)
3. Run `npm start` to start the server
4. Connect to `ws://localhost:8080` with your choice of WebSocket tools (see Notes)
5. Send Sign Up request via socket as JSON for example `{ "route": "signup", "username": "Cryptobyte", "password": "password" }`
6. Send Sign In request via socket as JSON for example `{ "route": "signin", "username": "Cryptobyte", "password": "password" }` and note the `token` field in response for next requests, this is your JWT for authention!
7. Send the example request to check if your JWT is valid, this is an [example request](Server/handlers/example.js) to show how verifying authentication works, for example `{ "route": "get-data", "token": "YOUR_JWT" }`

### Using the Client
1. Run `cd Server && npm i` to change to Server directory and install Server packages
2. Create `.env` file with the following parameters: `MONGOOSE`, `JWT_SECRET` where `MONGOOSE` is your MongoDB connection url and `JWT_SECRET` is your JWT secret (see Notes)
3. Run `npm start` to start the server
4. In a new terminal run `cd Client && npm i` to install client packages
5. Run `cd app && npm i` to install React app packages
6. Change to the Client directory `cd ..` and run `npm start`
7. Open [http://localhost:3000](http://localhost:3000) in your browser

### Notes
- You should **not** use this as configured, you should look at the [WebSocket (ws)](https://github.com/websockets/ws) library page and setup the server to use HTTPS **and** look at the [jwt library](https://www.npmjs.com/package/jsonwebtoken) page and setup a private key instead of a shared token first!
- You can test the server with various WebSocket tools, I use and recommend [websocat](https://github.com/vi/websocat) 