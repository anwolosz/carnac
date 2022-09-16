const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


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

app.get("/createRoom/:room", (req, res) => { //TODO: check room name rules. dont allow "/" for example.
  if (!isRoomExists(req.params.room)) {
    rooms[req.params.room] = new Carnac(req.params.room);
    return res.json({ exists: false })
  }
  return res.json({ exists: true })
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
    if (rooms[roomName].isEmpty()) //TODO: check if really exists the room
    {
      rooms[roomName].firstPlayer.id = socket.id
      rooms[roomName].activePlayer = rooms[roomName].firstPlayer
    }
    else if (rooms[roomName].hasFreePlayer())
    {
      rooms[roomName].secondPlayer.id = socket.id
    }

    socket.join(roomName);
    console.log(rooms);
  })

  
  socket.on("move", (roomName, y, x) => {
    console.log(roomName, y, x);
    // console.log(rooms);
    if (!(roomName in rooms)) {
      console.log("Room not exist!");
      socket.emit("error", "Room not exist");
      return;
    }
    if (rooms[roomName].move(y, x, socket.id)) {
      // socket
      //   .to(roomName)
      //   .emit("opponentMove", x, y, rooms[roomName].activePlayer);
    }
  });

  console.log(rooms);
});

server.listen(process.env.PORT || 3000);