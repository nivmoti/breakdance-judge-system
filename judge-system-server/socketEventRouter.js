const qualificationController = require("./controllers/qualificationController");
const gameController = require("./controllers/gameController");

const registerSocketEvents = (io, socket) => {
  const eventHandlers = [
    { event: "send-names", handler: qualificationController.handleSendNames },
    // { event: "start-qualification", handler:qualificationController.startQualification },
    // { event: "submit-qualification-score", handler: qualificationController.submitScore },
    { event: "register", handler: (io, socket, data) => gameController.registerJudge(io, socket, data) },
    { event: "start-battle", handler: gameController.startBattle },
    { event: "submit-score", handler: (io, socket, data) => gameController.submitScore(io, socket, data) },
    { event: "setup-battle", handler: gameController.setupBattle },
    { event: "unregister", handler: (io, socket, data) => gameController.unregisterJudge(io, socket, data) },
    { event: "stop-battle", handler: gameController.stopBattle },
  ];

  // Attach each event and its handler
  eventHandlers.forEach(({ event, handler }) => {
    socket.removeAllListeners(event);
    socket.on(event, (data) => {
      console.log(`Event received: ${event}`, data);
      handler(io, socket, data);
    });
  });
};

module.exports = registerSocketEvents;
