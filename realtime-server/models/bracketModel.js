let bracket = []; // In-memory bracket data

const getBracket = () => bracket;

const setBracket = (newBracket) => {
  bracket = newBracket;
};

const updateBracket = (matchId, winner) => {
  const match = bracket.find((m) => m.match === matchId);

  if (!match) return { error: "Match not found" };

  match.winner = winner;

  // Progress the winner to the next round
  const nextMatchId = Math.ceil(matchId / 2);
  const position = matchId % 2 === 1 ? "team1" : "team2";
  const nextMatch = bracket.find((m) => m.match === nextMatchId);

  if (nextMatch) {
    nextMatch[position] = winner;
  }

  return { message: "Bracket updated", bracket };
};

module.exports = {
  getBracket,
  setBracket,
  updateBracket,
};
