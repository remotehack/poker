const ULID = require('ulid');

var objectName = {
    sessions: {
        "dev123": {
            participants: [],
            scores: [],
            submittedScore: []
        }
    }
};

// each session will have a list of tasks and a list of participants

objectName.newSession = function () {
    var sessionID = this.generateSessionID();
    this.sessions[sessionID] = {
        participants: {},
        scores: [],
        submittedScore: []
    };

    return sessionID;
};

objectName.newParticipant = function (connectionID, displayName) {
    return { id: displayName };
};

objectName.addParticipant = function (sessionID, connectionID, displayName) {
    if (undefined === this.sessions[sessionID]) {
        return false; // no such session id
    }

    if (undefined !== this.sessions[sessionID].participants[participant]) {
        return false; // participant with that name already exists
    }

    this.sessions[sessionID].participants.push(participant);

    return this.sessions[sessionID];
};

objectName.removeParticipant = function (sessionID, participant) {
    // return new participant list with the participant removed from the list
};

objectName.estimateTask = function (sessionID, participant, score) {
    if (undefined === this.sessions[sessionID]) {
        return false; // no such session id
    }

    if (undefined === this.sessions[sessionID].participants[participant]) {
        return false; // participant with that name does not exist
    }

    // if ()


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
