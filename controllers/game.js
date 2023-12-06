const { response } = require("express");

class Prot {
    constructor() {
        this.isDead = false;
    }
    get isDead() {return this.isDead}
    set isDead(value) {
        if (typeof value == "Boolean")
            this.isDead = value;
        else throw new Error("Uneccepted type of value!");
    }
}

class Cross extends Prot {
    constructor () { super() }
}
class Zero extends Prot {
    constructor () { super() }
}

//-----------------

class Cell {
    constructor() {}

    get value() { return value }
    set value(v) {
        if (typeof v == typeof Cross || typeof v == typeof Zero) {
            this.value = v;
        } else throw new Error("Uneccepted type of value!");
    }

    isClear() { return this.value ? false : true}
}

class Field {
    constructor() {
        const arr = [];
        for (let i = 0; i < 10; i++) { arr.push(new Cell) }

        this.field = [];
        for (let i = 0; i < 10; i++) { this.field.push(structuredClone(arr)) }

        this.allCellClear = true;
    }

    cellSetCross(i, j) {
        if (this.field[i][j].isClear()) {
            this.field[i][j].value = new Cross;
            this.allCellClear = false;
        } else throw new Error("You can't put a cross in a Cell!");
    }
    cellSetZero(i, j) {
        if (this.field[i][j].isClear()) {
            this.field[i][j].value = new Zero;
            this.allCellClear = false;
        } else throw new Error("You can't put a cross in a Cell!");   
    }

    killCell(i, j) {
        if (this.field[i][j].isClear()) throw new Error("Cell is clear!");
        this.field[i][j].value.isDead = true;
    }
}

class Session {
    constructor(id) {
        this.id = id;
        this.isStarted = false;
        this.players = [];
        this.field = new Field();
    }

    addNewPlayer(player) {
        if (this.players.length >= 2) 
            throw new Error("Players is already exist.");
        if (typeof player != typeof "")
            throw new Error("Unexepted object type.");
        if (this.players.filter(el => el == player)[0])
            throw new Error("This player is already added.");

        this.players.push(player);
    }

    getPlayers() { return this.players; }

    getField() {
        if (this.field == undefined) throw new Error("Field is`t created.");
        return this.field;
    }

    startSession() {
        if (this.isStarted) { throw new Error("Game is already started") }
        this.isStarted = true;
    }
}

class Game {
    constructor() {
        this.sessions = [];
        this.players = [];
    }

    set response(value) { this.response = value; }
    get response() { return this.response; }
    
    getSessionsList() { return this.sessions; }

    getSessionId(player_id) {
        // console.log(player_id, this.players);
        const player = this.players.filter(v => v.player_id == player_id)[0];
        // console.log(player);

        if (!player) throw new Error("The player isn`t exist.");
        return  player.session_id;
    }

    getSession(session_id) {
        // console.log(session_id, this.sessions);
        const session = this.sessions.filter(v => v.id == session_id)[0];
        // console.log(session);

        if (!session) throw new Error("Session not found.");
        return session;
    }

    addPlayer(session_id, player_id) {
        if (this.players.filter(el => el.player_id == player_id)[0])
            throw new Error("Player is olready exist");

        this.players.push({"player_id": player_id, "session_id": session_id});

        const session = this.getSession(session_id);
        session.addNewPlayer(player_id);
    }

    createNewSession() {
        let id = Math.floor(Math.random() * 1000);
        while(this.sessions.find(x => x.id == id)) {
            id = Math.floor(Math.random() * 1000);
        }

        // if (this.players.filter(el => el.player == sessionOwner)[0])
        //     throw new Error("This player is already added.");

        const s = new Session(id);
        this.sessions.push(s);

        return s.id;
    }
}




module.exports = { Game };