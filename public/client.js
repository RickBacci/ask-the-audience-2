var socket = io();

var connectionCount = document.getElementById('connection-count');

socket.on('usersConnected', function(count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

var statusMessage = document.getElementById('status-message');

socket.on('statusMessage', function(message) {
  statusMessage.innerText = message;
});

var buttons = document.querySelectorAll('#choices button');

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    socket.send('voteCast', this.innerText);
  });
}

var totalA = document.getElementById('totalA') || 0;
var totalB = document.getElementById('totalB') || 0;
var totalC = document.getElementById('totalC') || 0;
var totalD = document.getElementById('totalD') || 0;

socket.on('voteCount', function(votes) {
  totalA.innerText = "A: " + votes['A'];
  totalB.innerText = "B: " + votes['B'];
  totalC.innerText = "C: " + votes['C'];
  totalD.innerText = "D: " + votes['D'];
});

var yourVote = document.getElementById('your-vote');

socket.on('yourVote', function(message) {
  yourVote.innerText = "You cast your vote for: " + message;
});
