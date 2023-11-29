const gameField = document.getElementById("game");
const div_table = document.createElement("div")
div_table.className = "table";

const table = document.createElement("table");

for (let i = 10; i > 0; i--) {
    const tr = document.createElement("tr");
    for (let j = 1; j <= 10; j++) {
        const td = document.createElement("td");

        const div = document.createElement("div")
        div.className = "inner";
        div.id = `${i} ${j}`;

        td.appendChild(div);
        tr.appendChild(td);
    }
    table.appendChild(tr);
}

const div_win = document.createElement("div");
div_win.className = "winning";

div_table.appendChild(table);
div_table.appendChild(div_win);

//-----------------

const div_win_block = document.createElement("div");
div_win_block.id = "win_block";

const span_winner = document.createElement("span");
span_winner.className = "winner";
const span_again = document.createElement("span");
span_again.className = "again";
span_again.textContent = "Играть ещё!";

div_win_block.appendChild(span_winner);
div_win_block.appendChild(span_again);

//-----------------

gameField.appendChild(div_table);
gameField.appendChild(div_win_block);