// const { response } = require("express");

class Prot {
    constructor() {
        this.isDead = false;
    }

    kill() { this.isDead = true; }

    // setIsDead(value) {
    //     if (typeof value == typeof true)
    //         this.isDead = value;
    //     else throw new Error("Uneccepted type of value!");
    // }
}

class Cross extends Prot {
    constructor () { super() }
}
class Zero extends Prot {
    constructor () { super() }
}

//-----------------

class Cell {
    constructor() {
        this.value = undefined;
    }

    setValue(v) {
        if (typeof v == typeof Cross || typeof v == typeof Zero) {
            this.value = v;
        } else throw new Error("Uneccepted type of value!");
    }

    isClear() { return this.value ? false : true}
}

class Field {
    constructor() {
        this.field = [];
        this.isClear = true;

        for (let i = 0; i < 10; i++) {
            const arr = [];
            for (let j = 0; j < 10; j++) {
                arr.push(new Cell());
            }
            this.field.push(arr);
        }
    }

    getField() {
        let field = [];
        for (let i=0; i < 10; i++) {
            let arr = [];
            for (let j=0; j < 10; j++) {
                // if (this.field[i][j].value) console.log(this.field[i][j].constructor.name);

                if (!this.field[i][j].value) arr.push("_");
                else if (this.field[i][j].value.constructor.name == "Cross") {
                    if (this.field[i][j].value.isDead) arr.push("dead_x");
                    else arr.push("x");
                }
                else if (this.field[i][j].value.constructor.name == "Zero") {
                    if (this.field[i][j].value.isDead) arr.push("dead_o");
                    else arr.push("o");
                }
                else throw new Error("Unexepted type of Cell");
            }
            field.push(arr);
        }
        return field;
    }

    setCell(i, j, obj) {
        // console.log("field", this.field);
        if (obj.includes("dead")) this.killCell(Number(i)-1, Number(j)-1);
        else if (obj.includes("x")) this.cellSetCross(Number(i)-1, Number(j)-1);
        else if (obj.includes("o")) this.cellSetZero(Number(i)-1, Number(j)-1);
        else throw new Error("Unexepted `object`.");
        // console.log("field", this.field);
    }

    cellSetCross(i, j) {
        if (this.field[i][j].isClear()) {
            this.field[i][j].value = new Cross;
            this.isClear = false;
        } else throw new Error("You can't put a cross in a Cell!");
    }
    cellSetZero(i, j) {
        if (this.field[i][j].isClear()) {
            this.field[i][j].value = new Zero;
            this.isClear = false;
        } else throw new Error("You can't put a cross in a Cell!");   
    }

    killCell(i, j) {
        if (this.field[i][j].isClear()) throw new Error("Cell is clear!");
        this.field[i][j].value.kill();
    }
}

function getMask(field, i, j) {
    // console.log(i, j, field);
    if (!field || i == undefined || j == undefined) 
        throw new Error("Field or indexes is undefined.");
    if (!field[i][j]) throw new Error("Fild element is undefined.");

    let mask = [];
    for (let l = 0; l < 3; l++) {
        let arr = [];
        for (let m = 0; m < 3; m++) {
            if (i - 1+l < 0 || i - 1+l >= 10 || 
                j - 1+m < 0 || j - 1+m >= 10) arr.push("undef");
            else arr.push(field[i - 1+l][j - 1+m]);
        }
        mask.push(arr);
    }
    return mask;
}

function hasOwn(arr, obj) {
    let own = false; let i = arr.length;
    console.log(arr);
    while (!own && i < arr.length) {
        const el = arr[i];
        console.log(el);
        if (el.i == obj.i && el.j == obj.j) own = true;

        i++;
    }
    return own;
}

function getReverse(sign, isDead = false) {
    if (sign == "x") {
        if (isDead) return "dead_o";
        return "o";
    } else if (sign == "o") {
        if (isDead) return "dead_x";
        return "x";
    } else if (sign == "dead_x") {
        return "o";
    } else if (sign == "dead_o") {
        return "x";
    } else throw new Error("Sign is undefined");
}



class Session {
    constructor(id) {
        this.id = id;
        // this.isStarted = false;
        this.players = [];
        this.field = new Field();
        this.lastMove = [];

        this.isEnd = false;
        this.statistics = {};
    }

    // checkEndGame(field, obj) {
        
    // }

    getAvailableCells(obj) {
        if (!obj || typeof obj != typeof "") throw new Error("Undefined obj input.");

        let availableCells = [];
        const field = this.field.getField();

        if (this.field.isClear) {
            if (obj == "x") availableCells.push({"i": 1, "j": 1});
            else if (obj == "o") availableCells.push({"i": 10, "j": 10});
            else throw new Error("'Object' is undefined.");
            return availableCells;
        } else {
            if (field[0][0] == "_" && obj == "x") availableCells.push({"i": 1, "j": 1});
            else if (field[9][9] == "_" && obj == "o") availableCells.push({"i": 10, "j": 10});

            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    const mask = getMask(field, i, j);
                    if (field[i][j] == getReverse(obj, true)) {
                        for (let ik = 0; ik < 3; ik++) {
                            for (let jk = 0; jk < 9; jk++) {
                                const el = mask[ik][jk];
                                if (el != "undef" && el == obj) {
                                    const ki = i-1+ik; const kj = j-1+jk;
                                    const i_move = i - ki; const j_move = j - kj;
    
                                    let i_check = i; let j_check = j;
                                    while (field[i_check][j_check] && field[i_check][j_check] == getReverse(obj, true)) {
                                        i_check += i_move; j_check += j_move;
                                        if (field[i_check][j_check] == "_" || field[i_check][j_check] == getReverse(obj)) {
                                            const cell = {"i": i_check+1, "j": j_check+1};
                                            if (!hasOwn(availableCells, cell)) availableCells.push(cell);
                                            console.log(availableCells);
                                        }
                                    }
                                }
                            }
                        }
                    } else if (field[i][j] == "_" || field[i][j] == getReverse(obj)) {
                        for (let ki = 0; ki < 3; ki++) {
                            for (let kj = 0; kj < 3; kj++) {
                                const el = mask[ki][kj];
    
                                if (el != "undef" && el == obj) {
                                    availableCells.push({"i": i+1, "j": j+1});
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            return availableCells;
        }
    }

    getMyObj(player) {
        let index = -1;
        this.players.forEach((item, ind) => {
            // console.log(item, ind, item.player == player);
            if (item.player == player) {
                index = ind;
            };
        });

        // console.log(index, player, this.players);
        if (index == -1 || index == undefined) throw new Error("Player undefined.");
        if (index == 0) return "x";
        if (index == 1) return "o";
    }

    getChanges() { return this.lastMove; }

    getPlayers() { return this.players; }

    getField() {
        if (this.field == undefined) throw new Error("Field is`t created.");
        
        const field  = this.field.getField();
        // console.log(field);

        return field;
    }

    move(moveOject) {
        let firstMoove = this.field.isClear;
        console.log("is cleare", firstMoove);

        if (this.isEnd) throw new Error("Game is over");

        if (moveOject.game_id != this.id) throw new Error("Invalid session id.");
        
        const i = moveOject.i; const j = moveOject.j;
        if (!i || !j) throw new Error("Indexes is undefined.");

        this.field.setCell(i, j, moveOject.obj);
        this.lastMove.push({"i": i, "j": j, "obj": moveOject.obj});


        if (!firstMoove) {
            console.log(moveOject.obj);
            const killedObj = moveOject.obj == "dead_x" ? "x" : "o";
            const field = this.field.getField();
            const hasObj =  field.some(list => list.some(el => el == killedObj));
            console.log(field);
            if (!hasObj) this.stopSession(moveOject.player, killedObj);
        }
    }

    addNewPlayer(player) {
        // if (this.isEnd) throw new Error("Game is over");

        if (typeof player != typeof "")
            throw new Error("Unexepted object type.");

        const pl = this.players.filter(el => el.player == player)[0];

        // console.log(player, pl, this.players);
        if (this.players.length >= 2 && !pl)
            throw new Error("Players is already exist.");

        if (this.players.length >= 2 && pl && !pl.isConnected) {
            pl.isConnected = true;
            return;
        }
        if (this.players.length < 2 && !pl) 
            this.players.push({"player": player, "isConnected": true});
    }

    playerConnect(player_id) {
        // if (this.isEnd) throw new Error("Game is over");

        const player = this.players.filter(x => x.player == player_id)[0];
        if (!player) throw new Error("This player is unexepted.");

        player.isConnected = true;
        // console.log("test", this.players.filter(x => x.player == player_id)[0]);

    }

    playerDisconnect(player_id) {
        const player = this.players.filter(x => x.player == player_id)[0];
        if (!player) throw new Error("This player is unexepted.");

        player.isConnected = false;
        // console.log("test", this.players.filter(x => x.player == player_id)[0]);
    }

    // startSession() {
    //     if (this.isStarted) { throw new Error("Game is already started") }
    //     this.isStarted = true;
    // }

    stopSession(winner, obj) {
        this.isEnd = true;
        console.log(this.isEnd);

        this.statistics.loser = {
            "id": this.players[0] == winner ? this.players[1].player : this.players[0].player,
            "obj": obj
        };

        this.statistics.winner = {
            "id": winner,
            "obj": getReverse(obj)
        }

        const data = new Date();
        this.statistics.time = `${data.getDate()}.${data.getMonth()}.${data.getFullYear()} ${data.getHours()}:${data.getMinutes()}`
    }
}

class Game {
    constructor() {
        this.sessions = [];
        this.players = [];
    }

    findSession(sesion_id) {
        const session = this.sessions.filter(el => el.id == sesion_id);
        if (!session) throw new Error("Session undefined.");
        return session;
    }
    
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
        const session = this.getSession(session_id);
        session.addNewPlayer(player_id);

        if (!this.players.filter(el => el.player_id == player_id)[0])
            this.players.push({"player_id": player_id, "session_id": session_id});
    }

    createNewSession() {
        let id = Math.floor(Math.random() * 1000);
        while(this.sessions.find(x => x.id == id)) {
            id = Math.floor(Math.random() * 1000);
        }

        const s = new Session(id);
        this.sessions.push(s);

        return s.id;
    }
}

module.exports = { Game };