const http    = require('http');
const express = require('express');
const app     = express();

var votes     = {};

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + 'public/index.html');
});

var port   = process.env.PORT || 3000;

var server = http.createServer(app).listen(port, function () {
  console.log('Listening on port ' + port + '.');
});

const socketIo = require('socket.io');
const io       = socketIo(server);

io.on('connection', function (socket) {
  var totalClients = io.engine.clientsCount;
  var welcomeMsg   = 'Welcome to Ask the Audience!'
  console.log('A user has connected.', totalClients);

  io.sockets.emit('usersConnected', totalClients);
  socket.emit('statusMessage', welcomeMsg);

  socket.on('message', function (channel, message) {
    if (channel === 'voteCast') {
      votes[socket.id] = message;
      socket.emit('voteCount', countVotes(votes));
      io.sockets.emit('voteCount', countVotes(votes));
      socket.emit('yourVote', message)
    }
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', totalClients);
    delete votes[socket.id];
    socket.emit('voteCount', countVotes(votes));
    io.sockets.emit('usersConnected', totalClients);
  });


  function countVotes(votes) {
    var voteCount = {
      A: 0,
      B: 0,
      C: 0,
      D: 0
    };
    for (vote in votes) {
      voteCount[votes[vote]]++
    }
    return voteCount;
  }
});

module.exports = server;
