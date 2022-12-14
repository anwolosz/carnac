const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(express.json());

const Carnac = require("./carnac");

// TODO: might be nice in a separate file
function isRoomExists(room) {
  return room in rooms;
}

rooms = {};
app.use(express.static('public'))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/isExists/:room", (req, res) => {
  res.json({ exists: isRoomExists(req.params.room) })
});

app.post("/createRoom", (req, res) => { //TODO: check room name rules. dont allow "/" for example.
  let existsReturn = isRoomExists(req.body.room);
  let inTimeLimit = req.body.timeLimit >= 1 && req.body.timeLimit <= 60 && Number.isInteger(req.body.timeLimit) && Number.isInteger(req.body.timeLimit);


  let isCorrectName = /^([a-zA-Z0-9]{3,10})$/.test(req.body.room);

  console.log(req.body.timeLimit);
  if (!existsReturn && inTimeLimit && isCorrectName) {
    let boardWidth = 10;
    let boardHeight = 7;
    if (req.body.boardSize === "8x5") {
      boardWidth = 8;
      boardHeight = 5;
    }
    if (req.body.boardSize === "14x9") {
      boardWidth = 14;
      boardHeight = 9;
    }

    let creatorColor = req.body.creatorColor
    if (req.body.creatorColor !== "RED" && req.body.creatorColor !== "WHITE") {
      creatorColor = Math.random() >= 0.5 ? "RED" : "WHITE"
    }


    rooms[req.body.room] = new Carnac(req.body.room, boardWidth, boardHeight, creatorColor, req.body.timeLimit * 60);
  }
  return res.json({ exists: existsReturn, inTimeLimit: inTimeLimit, isCorrectName: isCorrectName })
});

app.post("/test", (req, res) => {
  console.log("aa");
  console.log(req.body);
  console.log("bb");

  res.json({ test: "works?" });
});

app.get("/info/:room", (req, res) => {
  if (!isRoomExists(req.params.room)) {
    return res.redirect("/");
  }
  return res.json({ boardWidth: rooms[req.params.room].boardWidth, boardHeight: rooms[req.params.room].boardHeight, timer: rooms[req.params.room].firstPlayer.timer })
});

app.get("/:room", (req, res) => {
  if (!isRoomExists(req.params.room) || !rooms[req.params.room].hasFreePlayer()) {
    return res.redirect("/");
  }
  console.log("hello");
  return res.sendFile(__dirname + "/public/carnac.html"); //TODO: test game.html as gameId
});

io.on("connection", (socket) => {
  console.log(`Connected with id: ${socket.id}`);


  socket.on("connectRoom", (roomName) => {
    if (isRoomExists(roomName)) {

      socket.join(roomName);
      if (rooms[roomName].isEmpty()) {
        if (rooms[roomName].creatorColor === "RED") {
          rooms[roomName].firstPlayer.id = socket.id
        }
        else {
          rooms[roomName].secondPlayer.id = socket.id
        }
      }
      else if (rooms[roomName].hasFreePlayer()) {
        if (rooms[roomName].creatorColor === "RED") {
          rooms[roomName].secondPlayer.id = socket.id
          io.to(socket.id).emit("start", "OPPONENT", socket.id);
          socket.broadcast.emit("start", rooms[roomName].firstPlayer.id, "OPPONENT");
        }
        else {
          rooms[roomName].firstPlayer.id = socket.id
          io.to(socket.id).emit("start", socket.id, "OPPONENT");
          socket.broadcast.emit("start", "OPPONENT", rooms[roomName].secondPlayer.id);
        }
        rooms[roomName].activePlayer.id = rooms[roomName].firstPlayer.id
        rooms[roomName].activePlayer.status = "PLACE_STONE"
        rooms[roomName].gameStatus = "PLAYING"
        rooms[roomName].countDown();
      }
    }
    console.log(rooms[roomName].creatorColor);
    console.log(rooms);
  })


  socket.on("move", (roomName, y, x, stone) => {
    console.log(roomName, y, x);
    // console.log(rooms);
    if (!(roomName in rooms)) {
      console.log("Room not exist!");
      socket.emit("error", "Room not exist");
      return;
    }
    if (rooms[roomName].move(y, x, stone, socket.id)) {
      socket
        .to(roomName)
        .emit("opponentMove", y, x, stone);
    }
  });

  socket.on("pass", (roomName) => {
    console.log(roomName);
    console.log("PASSS");
    if (!(roomName in rooms)) {
      console.log("Room not exist!");
      socket.emit("error", "Room not exist");
      return;
    }
    if (rooms[roomName].pass(socket.id)) {
      socket
        .to(roomName)
        .emit("opponentPass");
    }
  });

  console.log(rooms);
});

server.listen(process.env.PORT || 3000);