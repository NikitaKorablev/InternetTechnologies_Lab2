async function move(data) {
    const url = "/move";
    try {
        await fetch(url, { 
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(resp => {
            if(!resp.ok) // если возникла ошибка, то срабатывает исключение и кадет в catch
                throw new Error("HTTP-Error: " + resp.status);
            return resp;
        });

        // return response.json();
    } catch(error) {
        console.error("Error", error);
    }
};

async function getField() {
    const url = "/getField";
    try {
        const response = await fetch(url, { method: "GET" })
        .then(resp => {
            if(!resp.ok) // если возникла ошибка, то срабатывает исключение и кадет в catch
                throw new Error("HTTP-Error: " + resp.status);
            return resp;
        });

        return response.json();
    } catch(error) {
        console.error("Error", error);
    }
};

function getMask(i, j) {
    if (!i || !j) throw new Error("i or j is undefined.");

    let mask = [];
    for (let l = 0; l < 3; l++) {
        let arr = [];
        for (let m = 0; m < 3; m++) {
            const new_i = i - 1+l; const new_j = j - 1+m;
            if (new_i < 1 || new_i > 10 || 
                new_j < 1 || new_j > 10) arr.push({"val": "undef"});
            else {
                // console.log(new_i, new_j);
                const div = document.getElementById(`${new_i} ${new_j}`);
                let imgSrc = div.getElementsByTagName("img")[0].src;

                if (imgSrc == "") arr.push({"val": "_", "i": new_i, "j": new_j});
                else {
                    // console.log(imgSrc.split("/").slice(-1));
                    imgSrc = imgSrc.split("/").slice(-1)[0].split(".")[0];
                    arr.push({"val": imgSrc, "i": new_i, "j": new_j});
                }
            }
        }
        mask.push(arr);
    }
    return mask;
}

function getReverse(sign, isDead = false) {
    if (sign == "x") {
        if (isDead) return "dead_o";
        return "o";
    } else if (sign == "o") {
        if (isDead) return "dead_x";
        return "x";
    } else throw new Error("Sign is undefined");
}

function getImgSign(i, j) {
    if (i < 1 || i > 10 || j < 1 || j > 10) 
        return undefined;
    
    const div = document.getElementById(`${new_i} ${new_j}`);
    let imgSrc = div.getElementsByTagName("img")[0].src;
    if (imgSrc == "") return "_";
    
    imgSrc = imgSrc.split("/").slice(-1).split(".")[0];
    return imgSrc;
}

function updateAvailableCells(myObj, i, j) {
    if (!i || !j) throw new Error("i or j is undefined.");

    const mask = getMask(i, j);
    for (let l = 0; l < 3; l++) {
        for (let m = 0; m < 3; m++) {
            if (mask[l][m].val == "undef") continue;
            if (mask[l][m].i == i && mask[l][m].j == j) continue;
            if (mask[l][m].val == "_" || mask[l][m].val == getReverse(myObj)) {
                const block = document.getElementById(`block_${mask[l][m].i}_${mask[l][m].j}`);
                block.style.zIndex = -1;
                continue;
            }
            if (mask[l][m].val == getReverse(myObj, true)) {
                const i_move = i-mask[l][m].i; const j_move = j-mask[l][m].j;

                let i_check = i; let j_check = j;
                let imgSign = getImgSign(i, j);
                while(imgSign && imgSign == getReverse(obj, true)) {
                    i_check += i_move; j_check += j_move;

                    if (imgSign == "_" || imgSign == getReverse(obj)) {
                        const block = document.getElementById(`block_${mask[l][m].i}_${mask[l][m].j}`);
                        block.style.zIndex = -1;
                        continue;
                    }
                }
            }
        }
    }

    const block = document.getElementById(`block_${i}_${j}`);
    block.style.zIndex = 1;
}

async function drawField() {
    const res = await getField();
    console.log(res);
    const myObj = res.obj;
    const session_id = res.session_id;
    const field = res.field;
    console.log(myObj, field);
    if (!myObj || !session_id || !field) 
        return console.error("/getField request is error");

    const gameField = document.getElementById("game");

    const div_table = document.createElement("div")
    div_table.className = "table";
    
    const table = document.createElement("table");
    
    for (let i = 10; i > 0; i--) {
        const tr = document.createElement("tr");
        for (let j = 1; j <= 10; j++) {
            const td = document.createElement("td");
    
            const div = document.createElement("div")
            div.id = `${i} ${j}`;
            div.className = "inner";

            const block = document.createElement("div");
            block.id = `block_${i}_${j}`;
            block.className = "block";

            const img = document.createElement("img");

            div.appendChild(img);
            td.appendChild(div);
            td.appendChild(block);
            tr.appendChild(td);

            div.addEventListener('click', (e) => {
                const data = {
                    "game_id": session_id,
                    "i": i,
                    "j": j
                };

                const img = div.getElementsByTagName('img')[0];
                
                const oldImgSrc = img.src.split("/").pop().split(".")[0];
                console.log(oldImgSrc);
                if (oldImgSrc == '') {
                    img.src = "../assets/" + myObj + ".png";
                    data["obj"] = myObj;
                    move(data);
                }
                else if (myObj == 'x' && oldImgSrc == 'o') {
                    img.src = "../assets/" + "dead_o" + ".png";
                    data["obj"] = "dead_o";
                    move(data);
                }
                else if (myObj == 'o' && oldImgSrc == 'x') {
                    img.src = "../assets/" + "dead_x" + ".png";
                    data["obj"] = "dead_x";
                    move(data);
                }
                console.log(i, j);
                updateAvailableCells(myObj, i, j);
                console.log(img.src);
            })
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
    
    //--------------------------------------------------------------
    //--------------------------------------------------------------

    const lastChanges = res.field_changes;
    lastChanges.forEach(element => {
        if (!element.obj) throw new Error("Get changes, but all objects ic cleare."); 
        const i = element.i; const j = element.j;
        const obj = element.obj;

        const div = document.getElementById(`${i} ${j}`);
        const img = div.getElementsByTagName("img")[0];
        img.src = "../assets/" + obj + ".png";
    });

    //--------------------------------------------------------------
    //--------------------------------------------------------------

    const availableCells = res.available_cells;
    if (availableCells.length == 0) 
        throw new Error("Available cells is undefined.");
    availableCells.forEach(element => {
        const block = document.getElementById("block_"+element.i+"_"+element.j);
        block.style.zIndex = -1;
    })

    return lastChanges;
};

export { drawField }
