const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const qualificationController = require("./controllers/qualificationController");
const gameController = require("./controllers/gameController");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  // socket.on("send-names", (names) => {
  //   qualificationController.handleSendNames(io, names);
  // });
  

  socket.on("start-qualification", (data) => {
    console.log(data);
    qualificationController.startQualification(io, data);
  });
  

  socket.on("submit-qualification-score", (data) => {
    qualificationController.submitScore(io, data);
  });

  socket.on("start-game", (data) => {
    gameController.startGame(io, data);
  });


  socket.on("register", (data) => {
    gameController.registerJudge(io,socket ,data);
  });
    // Handle starting the battle
    gameController.startBattle(io, socket);

    // Handle submitting scores
    gameController.submitScore(io, socket);

  
  socket.on("setup-battle", (data) => {
    gameController.setupBattle(io,data);
  });

  gameController.stopBattle(io,socket);

  socket.on("unregister", (data) => {
    gameController.unregisterJudge(io,socket ,data);
    // Remove the judge from any tracking lists, if necessary
  });


  
  

  socket.on("disconnect", () => {
    gameController.disconnect(io,socket);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
