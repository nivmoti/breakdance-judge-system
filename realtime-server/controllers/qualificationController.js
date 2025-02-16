let qualificationScores = [];
let qualificationNames = [];
let currentIndex = 0;
let judgeCount = 0;

const startQualification = (io, socket, data) => {
  qualificationNames = data.participants;
  currentIndex = 0;
  qualificationScores = {};
  judgeCount = data.judgeCount;

  if (qualificationNames.length === 0) {
    console.error("No names provided for qualification.");
    return;
  }
  console.log("Starting qualification with judgeCount:", judgeCount); 

  console.log(`Qualification started with names: ${data.participants} and ${data.judgeCount} judges`);
  io.emit("qualification-started", { currentName: qualificationNames[currentIndex] });
};

const submitScore = (io, socket, { name, score, judgeName }) => {
  if (!qualificationScores[name]) {
    qualificationScores[name] = {};
  }

  qualificationScores[name][judgeName] = score;

  io.emit("judge-submitted", { judgeName, name });

  if (Object.keys(qualificationScores[name]).length === judgeCount && currentIndex < qualificationNames.length - 1) {
    currentIndex++;
    io.emit("qualification-next", { currentName: qualificationNames[currentIndex] });
  } else if (
    currentIndex === qualificationNames.length - 1 &&
    Object.keys(qualificationScores[name]).length === judgeCount
  ) {
    finalizeQualification(io);
  }
};

const finalizeQualification = (io) => {
  const results = Object.entries(qualificationScores).map(([name, scores]) => {
    const averageScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / judgeCount;
    return { name, averageScore };
  });

  results.sort((a, b) => b.averageScore - a.averageScore);

  io.emit("qualification-finished", { results });
  console.log("Qualification finished. Results:", results);
};

const handleSendNames = (io, nameList) => {
  qualificationNames = nameList;
  currentIndex = 0;
  qualificationScores = {};

  console.log("Names received:", qualificationNames);

  // Start the qualification immediately
  startQualification(io, qualificationNames,3);
};


module.exports = {
  startQualification,
  submitScore,
  finalizeQualification,
  handleSendNames,
};