const EventBus = require("./models/EventBus");

const registerEventListeners = (io) => {
  EventBus.on("qualification-started", (data) => {
    console.log("📢 Emitting qualification-started event.");
    io.emit("qualification-started", data);
  });

  EventBus.on("qualification-score-submitted", (data) => {
    console.log(`📢 Score submitted: ${data.judgeName} -> ${data.name}: ${data.score}`);
    io.emit("qualification-score-submitted", data);
  });

  EventBus.on("battle-started", (data) => {
    console.log("🔥 Emitting battle-started event.");
    io.emit("battle-started", data);
  });

  EventBus.on("battle-score-submitted", (data) => {
    console.log("🎨 Emitting battle-score-submitted event.");
    io.emit("battle-score-submitted", data);
  });

  EventBus.on("battle-stopped", () => {
    console.log("🛑 Emitting battle-stopped event.");
    io.emit("battle-stopped");
  });

  EventBus.on("error", (error) => {
    console.error("❌ Error:", error);
    io.emit("error", error);
  });
};

module.exports = registerEventListeners;
