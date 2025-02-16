import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function JudgeClient() {
  const [status, setStatus] = useState("Waiting for the game to start...");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [namejudge, setnamejudge] = useState("");

  useEffect(() => {
    // Register as a judge
    const name = prompt("Enter your name:");
    setnamejudge(name)
    socket.emit("register", { role: "judge", name });

    // Listen for game-over events
    socket.on("game-over", (data) => {
      if (data?.winner) {
        setStatus(`${data.winner.toUpperCase()} TEAM WINS THE GAME!`);
      } else {
        console.error("Game-over event received without a winner:", data); // Debugging
        setStatus("Game over, but winner information is missing.");
      }
    });

    // Listen for round results or other updates as needed
    socket.on("result", (data) => {
      setStatus("Round in progress...");
      setIsSubmitted(false);
    });

    return () => {
      socket.off("game-over");
      socket.off("result");
    };
  }, []);

  const submitVote = (color) => {
    if (isSubmitted) return;
    socket.emit("submit-score", { color, judgeName: namejudge }); // Replace "Your Name" with dynamic input
    setStatus("Vote submitted!");
    setIsSubmitted(true);
  };

  return (
    <div style={styles.container}>
      <h1>Judge Panel</h1>
      <p>{status}</p>
      <div>
        <button style={styles.button} onClick={() => submitVote("red")} disabled={isSubmitted}>
          Vote Red
        </button>
        <button style={styles.button} onClick={() => submitVote("blue")} disabled={isSubmitted}>
          Vote Blue
        </button>
        <button style={styles.button} onClick={() => submitVote("gray")} disabled={isSubmitted}>
          Abstain
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    marginTop: "50px",
  },
  button: {
    padding: "10px 20px",
    margin: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default JudgeClient;
