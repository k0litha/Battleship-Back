const express = require("express");
const http = require('http')
const cors = require("cors");
const socketio = require('socket.io')
const app = express();
const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
})

// Set static folder
app.use(cors());

// Start server
const SOCKET_PORT = process.env.SOCKET_PORT || 3000;
server.listen(SOCKET_PORT, () => console.log(`Socket running on port ${SOCKET_PORT}`))


const users = [];
const connections = []
// Handle a socket connection request from web client
io.on('connection', socket => {
  playerId = ""
  room = ""
  let user = { id: socket.id, playerId, room };

  socket.on('create', room => {
    const playerId = 0;
    function checkExistingUser(user) {return user.room === room && user.playerId === playerId}
    const existingUser = users.find(checkExistingUser)
    user = { id: socket.id, playerId, room };
    if (existingUser) {console.log("Username is taken")}
    else { users.push(user); }

    // Tell the connecting client what player number they are
    socket.emit('player-number', user.playerId)
    socket.join(user.room);
    console.log(`Player ${user.playerId} has connected`)


    const connection = { room, playerId, ready: false };
    function checkExistingConns(connection) {return connection.room === room && connection.playerId === playerId}
    const existingConns = connections.find(checkExistingConns)
    if (!existingConns) connections.push(connection);
    console.log(users)
    console.log(connections)
    // Tell eveyone what player number just connected
    socket.in(user.room).emit('player-connection', user.playerId, user.room)
  })

  socket.on('join', room => {
    const playerId = 1;

    function checkExistingUser(user) {
      return user.room === room && user.playerId === playerId
    }
    const existingUser = users.find(checkExistingUser)
    user = { id: socket.id, playerId, room };
    if (existingUser) {
      console.log("Username is taken")
    }
    else { users.push(user); }

    // Tell the connecting client what player number they are
    socket.emit('player-number', user.playerId)
    socket.join(user.room);
    console.log(`Player ${user.playerId} has connected`)

    const connection = { room, playerId, ready: false };

    function checkExistingConns(connection) {return connection.room === room && connection.playerId === playerId}
    const existingConns = connections.find(checkExistingConns)
    if (!existingConns) connections.push(connection);
    console.log(users)
    console.log(connections)

    // Tell eveyone what player number just connected
    socket.in(user.room).emit('player-connection', user.playerId, user.room)
  })

  // Handle Diconnect
  socket.on('disconnect', () => {
    console.log(`Player ${user.playerId} disconnected`)
    socket.leave(user.room);

    function checkExistingUser(user) {return user.room ===  user.room && user.playerId === user.playerId}
    const usr = users.findIndex(checkExistingUser)
    if (usr !== -1) {users.splice(usr, 1);}

    function checkExistingConns(connection) {return connection.room === user.room && connection.playerId === user.playerId}
    const cn = connections.findIndex(checkExistingConns)
    if (cn !== -1) {connections.splice(cn, 1);}

    //Tell everyone what player number just disconnected
    socket.in(user.room).emit('player-connection', user.playerId)
  })

  // On Ready
  socket.on('player-ready', () => {
    socket.in(user.room).emit('enemy-ready', user.playerId)
    function checkExistingConns(connection) {return connection.room === user.room && connection.playerId === user.playerId}

    const index = connections.findIndex(checkExistingConns)
    const connection = { room: user.room, playerId: user.playerId, ready: true };
    if (index !== -1) {
      connections.splice(index, 1);
      connections.push(connection);
      console.log(connections)
    }
  })

  // Check player connections
  socket.on('check-players', () => {
    const players = []

    function checkPlayer0(connection) {return connection.room === user.room && connection.playerId === 0 && connection.ready === false}
    function checkPlayer0Ready(connection) { return connection.room === user.room && connection.playerId === 0 && connection.ready === true}
    const Player0 = connections.find(checkPlayer0)
    const Player0Ready = connections.find(checkPlayer0Ready)
    if (!Player0) players.push({ connected: false, ready: false })
    else { players.push({ connected: true, ready: Player0Ready }) }

    function checkPlayer1(connection) {return connection.room === user.room && connection.playerId === 1 && connection.ready === false}
    function checkPlayer1Ready(connection) { return connection.room === user.room && connection.playerId === 1 && connection.ready === true}
    const Player1 = connections.find(checkPlayer1)
    const Player1Ready = connections.find(checkPlayer1Ready)
    if (!Player1) players.push({ connected: false, ready: false })
    else { players.push({ connected: true, ready: Player1Ready }) }

    console.log(players)
    socket.emit('check-players', players)
    console.log(connections)
  })

  // On Fire Received
  socket.on('fire', id => {
    console.log(`Shot fired from ${user.playerId}`, id)
    socket.in(user.room).emit('fire', id)
  })

  // on Fire Reply
  socket.on('fire-reply', square => {
    console.log(square)
    socket.in(user.room).emit('fire-reply', square)
  })


})