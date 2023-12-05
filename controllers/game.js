const { response } = require("express");

class Prot {
    constructor() {
        this.isDead = false;
    }
    get isDead() {return this.isDead}
    set isDead(value) {
        if (typeof value == "Boolean")
            this.isDead = value;
        else console.error("Uneccepted type of value!");
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
        } else console.error("Uneccepted type of value!");
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
        } else console.error("You can't put a cross in a Cell!");
    }
    cellSetZero(i, j) {
        if (this.field[i][j].isClear()) {
            this.field[i][j].value = new Zero;
            this.allCellClear = false;
        } else console.error("You can't put a cross in a Cell!");   
    }

    killCell(i, j) {
        if (this.field[i][j].isClear()) {
            console.error("Cell is clear!");
        } else this.field[i][j].value.isDead = true;
    }
}

class Session {
    constructor(id, owner) {
        this.id = id;
        this.sessionOwner = owner;
        this.isStarted = false;
    }

    get player2() { return this.player2; }
    set player2(value) { this.player2 = value; }

    get field() {
        if (this.field == undefined) console.error("Field is`t created.");
        else return this.field;
    }

    startSession() {
        if (this.field == undefined) {
            this.field = new Field();
            this.isStarted = true;
        }
        else console.error("Field is already created.");
    }
}

class Game {
    constructor() {
        this.sessions = [];
    }

    set response(value) { this.response = value; }
    get response() { return this.response; }
    
    getSessionsList() { return this.sessions; }

    createNewSession(sessionOwner) {
        let r = Math.floor(Math.random() * 1000);
        while(this.sessions.find(x => x.id == r)) {
            r = Math.floor(Math.random() * 1000);
        }

        const s = new Session(r, sessionOwner);
        this.sessions.push(s);

        return s.id;
    }
}




module.exports = { Cross, Zero, Cell, Field, Session, Game };