const { getBracket, setBracket, updateBracket } = require("../models/bracketModel");

const handleBracketEvents = (io, socket) => {
  // Send the current bracket to the client
  socket.on("get-bracket", () => {
    const currentBracket = getBracket();
    socket.emit("bracket-updated", currentBracket);
  });

  // Generate a bracket based on qualification results
  socket.on("generate-bracket", ({ results, bracketSize }) => {
    console.log(`Generating bracket for size ${bracketSize}`, results);
  
    // Logic to create and broadcast the bracket
    const halfSize = Math.floor(results.length / 2);
    const bracket = [];
    
    for (let i = 0; i < halfSize; i++) {
      bracket.push({
        match: i + 1,
        team1: results[i].name,
        team2: results[results.length - 1 - i].name,
      });
    }
  
    io.emit("bracket-updated", bracket);
    console.log("Bracket sent to clients:", bracket);
  });
  

  // Update the bracket after a match result
  socket.on("update-bracket", (updatedBracket) => {
    console.log("Bracket updated:", updatedBracket);
    bracketState = updatedBracket; // Save the updated bracket
    io.emit("bracket-updated", bracketState); // Notify all clients
  });

};

module.exports = handleBracketEvents;
