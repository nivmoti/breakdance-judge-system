import React, { useState } from "react";
import { io } from "socket.io-client";
import GameUI from "./GameUI"; // Import the new GameUI component

const socket = io("http://localhost:3000");

function MainClient() {
  const [rounds, setRounds] = useState(0);
  const [judgeCount, setJudgeCount] = useState(0);
  const [judgeNames, setJudgeNames] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const startGame = () => {
    if (rounds <= 0 || judgeCount <= 0 || judgeNames.length !== judgeCount) {
      alert("Please enter valid numbers for rounds and judge names for all judges!");
      return;
    }

    // Emit start-game event with rounds and judge names
    socket.emit("start-game", { rounds, judgeNames });
    setIsGameStarted(true);
  };

  const handleJudgeNameChange = (index, name) => {
    const updatedNames = [...judgeNames];
    updatedNames[index] = name;
    setJudgeNames(updatedNames);
  };

  return (
    <div style={styles.container}>
      {!isGameStarted ? (
        <div style={styles.setup}>
          <input
            type="number"
            placeholder="Enter number of rounds"
            value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Enter number of judges"
            value={judgeCount}
            onChange={(e) => setJudgeCount(Number(e.target.value))}
            style={styles.input}
          />
          {Array.from({ length: judgeCount }).map((_, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Judge ${index + 1} Name`}
              value={judgeNames[index] || ""}
              onChange={(e) => handleJudgeNameChange(index, e.target.value)}
              style={styles.input}
            />
          ))}
          <button onClick={startGame} style={styles.button}>
            Start Game
          </button>
        </div>
      ) : (
        <GameUI rounds={rounds} judgeNames={judgeNames} socket={socket} />
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "'Arial', sans-serif",
    padding: "20px",
  },
  title: {
    fontSize: "2rem",
    color: "#333",
  },
  setup: {
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    margin: "5px",
    width: "250px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    margin: "10px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default MainClient;
