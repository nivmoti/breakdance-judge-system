const Event = require("../models/eventModel");
const mongoose = require("mongoose");

// Add or update an event with a participant
const addParticipant = async (req, res) => {
  const { eventName, participantName } = req.body;

  if (!eventName || !participantName) {
    return res.status(400).json({ error: "Event name and participant name are required" });
  }

  try {
    // Find or create the event
    let event = await Event.findOne({ eventName });
    if (!event) {
      event = new Event({ eventName, participants: [participantName] });
    } else if (!event.participants.includes(participantName)) {
      event.participants.push(participantName); // Add participant if not already present
    }

    await event.save();
    res.status(200).json({ message: "Participant added successfully", event });
  } catch (error) {
    console.error("Error adding participant:", error);
    res.status(500).json({ error: "Failed to add participant" });
  }
};
const getNextMatch = async (req, res) => {
  const { eventName } = req.params;
  console.log("log:", eventName);

  try {
    // Find the event by name
    const event = await Event.findById( eventName );

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    const { currentMatch, bracket } = event;

    // Find the current round in the bracket
    const currentRound = bracket.find((round) => round.round === currentMatch.round);

    if (!currentRound) {
      return res.status(404).json({ error: "Current round not found in the bracket." });
    }

    // Find the current match in the round
    const match = currentRound.matches[currentMatch.matchNumber-1];

    if (!match) {
      const match = currentRound.matches[0];
    }

    // Move to the next match/round
    const isLastMatchInRound = currentMatch.matchNumber === currentRound.matches.length;
    const isLastRound = currentMatch.round === bracket.length;

    if (!isLastMatchInRound) {
      event.currentMatch.matchNumber += 1; // Move to the next match in the current round
    } else if (!isLastRound) {
      event.currentMatch.round += 1; // Move to the next round
      event.currentMatch.matchNumber = 1; // Reset match number for the new round
    } else {
      return res.status(200).json({ message: "Tournament completed.", match: null });
    }

    await event.save(); // Update the event in the database

    res.status(200).json({ match, currentMatch: event.currentMatch });
  } catch (error) {
    console.error("Error fetching next match:", error);
    res.status(500).json({ error: "Failed to fetch next match." });
  }
};


// Get all participants for an event
const getEventParticipants = async (req, res) => {
  const { eventName } = req.params;
  const eventID = eventName;

  try {
    const event = await Event.findById( eventID );
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

//Add QUALIFICTION result
const calculateBracket = async (req, res) => {
  const { eventId, results, bracketSize } = req.body;
  console.log(req.body);

  if (!eventId || !results || !bracketSize) {
    console.error("Invalid request data:", { eventId, results, bracketSize });
    return res.status(400).json({ error: "Event ID, results, and bracket size are required." });
  }

  try {
    // Sort results by average score
    results.sort((a, b) => b.averageScore - a.averageScore);
    const qualification = results.map((item) => ({
      name: item.name,
      averageScore: mongoose.Types.Decimal128.fromString(item.averageScore.toString()), // Convert to Decimal128
    }));
    console.log("Qualification Data:", qualification);

    // Generate bracket based on size
    const topN = parseInt(bracketSize, 10);
    const topParticipants = results.slice(0, topN);
    const halfSize = Math.ceil(topParticipants.length / 2);
    const bracket = [{round: 1, matches: []}];

    for (let i = 0; i < halfSize; i++) {
      bracket[0].matches.push({
        match: i + 1,
        team1: topParticipants[i].name,
        team2: topParticipants[topParticipants.length - 1 - i].name,
      });
    }
    console.log(bracket[0].matches);

    // Update the event with the generated bracket
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    event.qualification = qualification;
    event.bracket = bracket;
    await event.save();

    res.status(200).json({ message: "Bracket generated successfully.", bracket });
  } catch (error) {
    console.error("Error generating bracket:", error);
    res.status(500).json({ error: "Failed to generate bracket." });
  }
};



// Get a list of all events
const getAllEvents = async (req, res) => {
    try {
      const events = await Event.find({}, "eventName participants"); // Fetch all events with their names and participants
      res.status(200).json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  };
// Add or update a bracket for an event
const addOrUpdateBracket = async (req, res) => {
  const { bracket } = req.body; // Extract bracket from the request body
  const { eventName } = req.params; // Extract event name from params
  console.log("Request Params:", req.params);
  console.log("Request Body:", req.body);


  if (!eventName || !bracket) {
    console.error("Missing event name or bracket data:", { eventName, bracket });
    return res.status(400).json({ error: "Event name and bracket are required" });
  }

  try {
    const event = await Event.findOneAndUpdate(
      { eventName }, // Match event by its name
      { bracket }, // Update bracket field
      { new: true, upsert: false } // Return updated doc, do not create a new one
    );

    if (!event) {
      console.error("Event not found:", eventName);
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ message: "Bracket updated successfully", event });
  } catch (error) {
    console.error("Error updating bracket:", error);
    res.status(500).json({ error: "Failed to update bracket" });
  }
};
const setCurrentMatch = async (req, res) => {
  const { eventId } = req.params;
  const { currentMatch } = req.body;

  if (!eventId || !currentMatch) {
    return res.status(400).json({ error: "Event ID and current match are required." });
  }

  try {
    const event = await Event.findByIdAndUpdate(
      eventId,
      { currentMatch },
      { new: true } // Return the updated document
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    res.status(200).json({ message: "Current match updated successfully.", currentMatch });
  } catch (error) {
    console.error("Error updating current match:", error);
    res.status(500).json({ error: "Failed to update current match." });
  }
};





module.exports = { addParticipant, getEventParticipants, getAllEvents, addOrUpdateBracket, calculateBracket, getNextMatch, setCurrentMatch };
