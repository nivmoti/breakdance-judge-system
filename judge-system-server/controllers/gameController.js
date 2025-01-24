let currentMatch = null; // Store the current match data
let roundsWins = { red: 0, blue: 0 }; // Track the total round wins for teams
let judgeVotes = {}; // Track judge votes
let submittedVotes = 0; // Count the number of votes submitted
let totalRounds = 0; // Total rounds for the battle
let judges = []; // List of judge names

const startBattle = (io, socket) => {
  socket.on("start-battle", ({ match, rounds, judgeNames }) => {
    if (!match || !rounds || !judgeNames || judgeNames.length === 0) {
      socket.emit("error", { message: "Invalid battle setup data." });
      return;
    }

    currentMatch = match;
    totalRounds = rounds;
    //judges = judgeNames;
    submittedVotes = 0;
    judgeVotes = {};
    roundsWins = { red: 0, blue: 0 };
    while(judges.length < judgeNames.length){

    }


    console.log(`Battle started for match: ${JSON.stringify(match)} with ${totalRounds}`);
    io.emit("battle-started", {
      match,
      roundsToWin: Math.ceil(rounds / 2),
      judgeNames,
    });
  });
};

const submitScore = (io, socket) => {
  socket.on("submit-score", ({ color, judgeName }) => {
    if (!currentMatch || !color || !judgeName) {
      socket.emit("error", { message: "Invalid score submission." });
      return;
    }

    if (!judgeVotes[judgeName]) {
      judgeVotes[judgeName] = color;
      submittedVotes++;
    }
    console.log(`Voted: ${submittedVotes} From: ${judges.length}`);

    io.emit("judge-submitted", { judgeName, color });

    if (submittedVotes === judges.length) {
      const voteCounts = { red: 0, blue: 0, gray: 0 };
      Object.values(judgeVotes).forEach((vote) => {
        if (voteCounts[vote] !== undefined) {
          voteCounts[vote]++;
          console.log(`${vote} have now : ${voteCounts[vote]}`);
        }
      });

      const roundWinner =
        voteCounts.red > voteCounts.blue
          ? "red"
          : voteCounts.blue > voteCounts.red
          ? "blue"
          : null;

      if (roundWinner === "red") {
        roundsWins.red++;
      } else if (roundWinner === "blue") {
        roundsWins.blue++;
      }

      console.log(`Round winner: ${roundWinner} score: Red:${roundsWins.red} , Blue:${roundsWins.blue} `)

      io.emit("result", {
        roundWinner,
        scores: voteCounts,
        roundswins: roundsWins,
      });

      // Check if the battle is over
      if (
        roundsWins.red >= Math.ceil(totalRounds / 2) ||
        roundsWins.blue >= Math.ceil(totalRounds / 2)
      ) {
        const battleWinner =
          roundsWins.red > roundsWins.blue ? currentMatch.team2 : currentMatch.team1;

        io.emit("game-over", {
          winner: battleWinner,
          match: currentMatch,
        });

        // Reset for next battle
        currentMatch = null;
        totalRounds = 0;
        judgeVotes = {};
        submittedVotes = 0;
        roundsWins = { red: 0, blue: 0 };
      } else {
        // Reset for the next round
        submittedVotes = 0;
        judgeVotes = {};
      }
    }
  });
};

const unregisterJudge = (io,socket,{name}) =>{
  judges = judges.filter((judge) => judge.id !== socket.id);


};




const registerJudge = (io,socket,{ role, name }) =>{
  if (role === "judge") {
    judges.push({ id: socket.id, name });
    io.emit("judge-connected", { name });
    console.log(`Judge registered: ${name}`);
  }
};
const setupBattle =(io,{ match, judgeNames, totalRounds }) =>{
  currentMatch = match;
  judges = judgeNames.map((name) => ({ id: null, name }));
  roundsConfig = {
    totalRounds,
    requiredWins: Math.ceil(totalRounds / 2),
  };
  scores = { red: 0, blue: 0 };
  roundWins = { red: 0, blue: 0 };
  submittedScores = 0;

  console.log(`Battle setup for match: ${match.team1} vs ${match.team2}`);
  io.emit("battle-setup", { match, judgeNames, totalRounds });

};

const stopBattle = (io, socket) => {
  socket.on("stop-battle", () => {
    console.log("Stopping the current battle");

    // Reset the battle state
    currentMatch = null;
    totalRounds = 0;
    judgeVotes = {};
    submittedVotes = 0;
    roundsWins = { red: 0, blue: 0 };

    // Notify all clients that the battle has been stopped
    io.emit("battle-stopped", { message: "The current battle has been stopped by the client." });

    console.log("Battle has been reset.");
  });
};


const disconnect = (io,socket) =>{
  console.log(`Client disconnected: ${socket.id}`);
  judges = judges.filter((judge) => judge.id !== socket.id);
};

const resetGame = () => {
  scores = { red: 0, blue: 0 };
  roundWins = { red: 0, blue: 0 };
  submittedScores = 0;
  currentMatch = null;
};
module.exports = {
  startBattle,
  submitScore,
  registerJudge,
  setupBattle,
  disconnect,
  unregisterJudge,
  stopBattle,
};
