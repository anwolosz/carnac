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
  if (!isRoomExists(req.body.room)) {
    rooms[req.body.room] = new Carnac(req.body.room);
    return res.json({ exists: false })
  }
  return res.json({ exists: true })
});

app.post("/test", (req, res) => {
  console.log("aa");
  console.log(req.body);
  console.log("bb");

  res.json({test: "works?"});
});



app.get("/:room", (req, res) => {
  if (!isRoomExists(req.params.room)) {
    return res.redirect("/");
  }
  console.log("hello");
  return res.sendFile(__dirname + "/public/carnac.html"); //TODO: test game.html as gameId
});

io.on("connection", (socket) => {
  console.log(`Connected with id: ${socket.id}`);


  socket.on("connectRoom", (roomName) => {
    socket.join(roomName); //TODO: check if really exists the room
    if (rooms[roomName].isEmpty()) 
    {
      rooms[roomName].firstPlayer.id = socket.id
      rooms[roomName].activePlayer.id = socket.id
      rooms[roomName].activePlayer.status = "PLACE_STONE"
    }
    else if (rooms[roomName].hasFreePlayer())
    {
      rooms[roomName].secondPlayer.id = socket.id
      rooms[roomName].gameStatus = "PLAYING"
      io.to(socket.id).emit("start", "OPPONENT", socket.id);
      socket.broadcast.emit("start", rooms[roomName].firstPlayer.id, "OPPONENT");
    }

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