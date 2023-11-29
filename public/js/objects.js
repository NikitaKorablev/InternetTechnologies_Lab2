class Cell {
    constructor(x, y, isDead) {
        this.x = x;
        this.y = y;
        this.isDead = isDead;
    }
    get isDead() {return this.isDead};
    set isDead(value) {
        if (typeof value == "Boolean")
            this.isDead = value;
        else
            console.error("Uneccepted type of value!");
    }
}

class Cross extends Cell {
    constructor(x, y) {
        super(x, y, false);
    }
}

class Zero extends Cell {
    constructor(x, y) {
        super(x, y, false);
    }
}