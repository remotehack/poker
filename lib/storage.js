const ULID = require('ulid');

var objectName = {
    sessions: {}
};

// each session will have a list of tasks and a list of participants

objectName.newSession = function () {
    var sessionID = this.generateSessionID();
    this.sessions[sessionID] = {
        tasks: [],
        participants: []
    };

    return sessionID;
};

objectName.addTask = function (sessionID, taskName) {
    // return new task list with the task added on it
};

objectName.removeTask = function (sessionID, taskName) {
    // return new task list with the task removed from it
};

objectName.addParticipant = function (sessionID, participant) {
    // return a new participant list with the participant added to the list
};

objectName.removeParticipant = function (sessionID, participant) {
    // return new participant list with the participant removed from the list
};

objectName.estimateTask = function (sessionID, task) {
    // cycles through participants, asks for estimates from all of them and once everyone returned,
    // reveals estimates from everyone to everyone
    // marks task as estimated
};

objectName.estimateSession = function (sessionID) {
    // cycles through tasks, calls estimateTask on each of them, 
};

objectName.showCaseSession = function (sessionID) {
    if (undefined === this.sessions[sessionID]) {
        return false;
    }
    return JSON.stringify(this.sessions[sessionID]);
    // returns each task with all of the estimates
};

objectName.generateSessionID = function () {
    return ULID.ulid();
}


module.exports = objectName;
