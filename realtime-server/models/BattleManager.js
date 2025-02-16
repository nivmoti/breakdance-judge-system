class BattleManager {
    constructor() {
      if (!BattleManager.instance) {
        this.currentMatch = null;
        this.roundsWins = { red: 0, blue: 0 };
        this.judgeVotes = {};
        this.submittedVotes = 0;
        this.totalRounds = 0;
        this.judges = [];
        this.round = 0;
        this.gameUisocket = null;
        BattleManager.instance = this;
      }
      return BattleManager.instance;
    }
  
    // ✅ Start a new battle
    startBattle(match, rounds, judgeNames, io, socketId) {
      this.currentMatch = match;
      this.totalRounds = rounds;
      //this.judges = judgeNames.map((name) => ({ name, socketId: null }));
      this.submittedVotes = 0;
      this.judgeVotes = {};
      this.roundsWins = { red: 0, blue: 0 };
      this.gameUisocket = socketId;

      console.log(`Battle started for ${match.team1} vs ${match.team2}`);
  
      io.emit("battle-started", {
        match,
        roundsToWin: Math.ceil(rounds / 2),
        judgeNames,
      });
    }
  
    // ✅ Handle judge votes
    submitScore(judgeName, color, io, socket) {
      if (!this.currentMatch || !color || !judgeName) {
        socket.emit("error", { message: "Invalid score submission." });
        return;
      }
  
      if (!this.judgeVotes[judgeName]) {
        this.judgeVotes[judgeName] = color;
        this.submittedVotes++;
      }
  
      io.emit("judge-submitted", { judgeName, color });
  
      // If all judges voted, calculate results
      if (this.submittedVotes === this.judges.length) {
        const voteCounts = { red: 0, blue: 0, gray: 0 };
        Object.values(this.judgeVotes).forEach((vote) => {
          voteCounts[vote]++;
        });
        this.round++;
  
        const roundWinner =
          voteCounts.red > voteCounts.blue
            ? "red"
            : voteCounts.blue > voteCounts.red
            ? "blue"
            : null;
  
        if (roundWinner === "red") {
          this.roundsWins.red++;
        } else if (roundWinner === "blue") {
          this.roundsWins.blue++;
        }
  
        io.emit("result", {
          roundWinner,
          scores: voteCounts,
          roundswins: this.roundsWins,
          round: this.round,
        });
  
        if (
          this.roundsWins.red >= Math.ceil(this.totalRounds / 2) ||
          this.roundsWins.blue >= Math.ceil(this.totalRounds / 2)
        ) {
          const battleWinner =
            this.roundsWins.red > this.roundsWins.blue
              ? this.currentMatch.team2
              : this.currentMatch.team1;
  
          io.emit("game-over", { winner: battleWinner, match: this.currentMatch });
          this.resetGame();
        } else {
          this.submittedVotes = 0;
          this.judgeVotes = {};
        }
      }
    }
  
    // ✅ Register a judge
    registerJudge(socketId, name, io) {
      const existingJudge = this.judges.find((judge) => judge.name === name);
      if (existingJudge) {
        existingJudge.socketId = socketId;
      } else {
        this.judges.push({ name, socketId });
      }
      io.emit("judge-connected", { name });
      console.log(`Judge registered: ${name}`);
    }
  
    // ✅ Unregister a judge
    unregisterJudge(socketId, io) {
      this.judges = this.judges.filter((judge) => judge.socketId !== socketId);
      console.log(`Judge disconnected: ${socketId}`);
    }
  
    // ✅ Reset game
    resetGame() {
      this.currentMatch = null;
      this.totalRounds = 0;
      this.judgeVotes = {};
      this.submittedVotes = 0;
      this.roundsWins = { red: 0, blue: 0 };
      this.round = 0;
    }
  }
  
  // ✅ Export Singleton instance
  const instance = new BattleManager();
  module.exports = instance;
  