import React, { useState } from "react";
import MainClient from "./components/MainClient";
import JudgeClient from "./components/JudgeClient";

function App() {
  const [role, setRole] = useState("");

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
  };

  if (role === "main") {
    return <MainClient />;
  } else if (role === "judge") {
    return <JudgeClient />;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Judge System</h1>
      <button onClick={() => selectRole("main")} style={{ padding: "10px 20px", margin: "10px", fontSize: "16px" }}>
        Main Client
      </button>
      <button onClick={() => selectRole("judge")} style={{ padding: "10px 20px", margin: "10px", fontSize: "16px" }}>
        Judge Client
      </button>
    </div>
  );
}

export default App;
