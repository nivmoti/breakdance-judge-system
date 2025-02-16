import React, { useState, useEffect } from "react";
import "./GameUI.css"; // Import the external CSS file

function GameUI({ rounds, judgeNames, socket }) {
  const [judges, setJudges] = useState(
    judgeNames.map((name) => ({ name, submitted: false, color: "black" }))
  );
  const [result, setResult] = useState({ red: 0, blue: 0 }); // Current round votes
  const [roundWins, setRoundWins] = useState({ red: 0, blue: 0 }); // Total round wins
  const [winner, setWinner] = useState("");
  const [roundResult, setRoundResult] = useState("");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Listen for game-over events
    socket.on("game-over", (data) => {
      setWinner(`${data.winner.toUpperCase()} TEAM WINS THE GAME!`);
      setGameOver(true);
    });

    // Listen for round results
    socket.on("result", (data) => {
      const { roundWinner, scores, roundswins } = data;

      setResult(scores || { red: 0, blue: 0 });
      setRoundWins(roundswins || { red: 0, blue: 0 });

      if (roundWinner === "red") {
        setRoundResult("Red Team Wins the Round!");
      } else if (roundWinner === "blue") {
        setRoundResult("Blue Team Wins the Round!");
      } else {
        setRoundResult("This Round is a Tie!");
      }

      // Reset judges for the next round
      setJudges((prev) =>
        prev.map((j) => ({ ...j, submitted: false, color: "black" }))
      );
    });

    // Listen for judge submissions
    socket.on("judge-submitted", (data) => {
      setJudges((prev) =>
        prev.map((judge) =>
          judge.name === data.judgeName
            ? { ...judge, submitted: true, color: data.color }
            : judge
        )
      );
    });

    return () => {
      socket.off("game-over");
      socket.off("result");
      socket.off("judge-submitted");
    };
  }, [socket]);
  const restartGame = () => {
    setWinner(""); // Clear the winner display
    setRoundResult("");
    setGameOver(false); // Hide the restart button
    setRoundWins({ red: 0, blue: 0 }); // Reset round wins
    setResult({ red: 0, blue: 0 }); // Reset scores
    setJudges(judgeNames.map((name) => ({ name, submitted: false, color: "black" })));
    socket.emit("start-game", { rounds, judgeNames }); // Emit to server
  };

  return (
    <div className="game-container">
      <h2 className="game-heading">Game in Progress</h2>

      <div className="round-info">
        <p className="round-text">Rounds to Win: {Math.ceil(rounds / 2)}</p>
        <p className="round-result">{roundResult}</p>
      </div>
      {/* Judges Section */}
      <div className="judge-row">
        {judges.map((judge, index) => (
          <div key={index} className="judge-card">
            <p className="judge-name">{judge.name}</p>
            <div
              className="judge-square"
              style={{ backgroundColor: judge.color }}
            ></div>
          </div>
        ))}
      </div>

      {/* Team Stats */}
      <div className="team-stats">
        <div className="team blue-team">
          <h3>Blue Team</h3>
          <p className="round-wins">{roundWins.blue}</p>
        </div>
        <div className="team red-team">
          <h3>Red Team</h3>
          <p className="round-wins">{roundWins.red}</p>
        </div>
      </div>

      {winner && <h2 className="winner">{winner}</h2>}
      {gameOver && (
        <button className="restart-button" onClick={restartGame}>
          Restart Game
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "'Arial', sans-serif",
    color: "#333",
    padding: "20px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "10px",
  },
  roundInfo: {
    marginBottom: "20px",
  },
  roundText: {
    fontSize: "1.2rem",
  },
  roundResult: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#444",
    marginTop: "10px",
  },
  judgeRow: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "15px",
    margin: "20px 0",
  },
  judgeCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
  },
  judgeName: {
    fontWeight: "bold",
    fontSize: "1rem",
  },
  judgeSquare: {
    width: "50px",
    height: "50px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    transition: "background-color 0.5s ease",
  },
  teamStats: {
    display: "flex",
    justifyContent: "space-around",
    margin: "30px 0",
    padding: "10px 0",
    borderTop: "2px solid #ddd",
    borderBottom: "2px solid #ddd",
  },
  team: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "2px solid",
    borderRadius: "10px",
    padding: "15px",
    boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2)",
  },
  roundWins: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginTop: "5px",
  },
  winner: {
    marginTop: "20px",
    fontSize: "2rem",
    color: "#28a745",
    fontWeight: "bold",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
  },
};

export default GameUI;
