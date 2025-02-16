class ActiveSession {
    constructor() {
      if (ActiveSession.instance) {
        return ActiveSession.instance;
      }
      this.activeEvent = null; // Active event ID
      this.type = null; // Type of session ("qualification" or "battle")
      ActiveSession.instance = this;
    }
  
    startSession(eventId, type) {
      if (this.activeEvent) {
        throw new Error("An active session is already in progress.");
      }
      this.activeEvent = eventId;
      this.type = type;
      console.log(`Started ${type} session for event: ${eventId}`);
    }
  
    stopSession() {
      if (!this.activeEvent) {
        throw new Error("No active session to stop.");
      }
      console.log(`Stopped ${this.type} session for event: ${this.activeEvent}`);
      this.activeEvent = null;
      this.type = null;
    }
  
    getSession() {
      return { eventId: this.activeEvent, type: this.type };
    }
  
    hasActiveSession() {
      return !!this.activeEvent;
    }
  }
  
  module.exports = new ActiveSession();
  