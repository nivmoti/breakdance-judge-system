const express = require("express");
const { addParticipant, getEventParticipants, getAllEvents, addOrUpdateBracket, calculateBracket, getNextMatch, setCurrentMatch } = require("../controllers/eventController");

const router = express.Router();

router.post("/add-participant", addParticipant); // Add participant to an event
router.get("/:eventName/participants", getEventParticipants); // Get participants for an event
router.get("/", getAllEvents); // Get all events
router.post("/:eventId/bracket", calculateBracket);
router.post("/:eventName/bracketupdate", addOrUpdateBracket);
router.get("/:eventName/next-match", getNextMatch);
router.post("/:eventId/current-match", setCurrentMatch);

module.exports = router;
