function newSession(name, id) {
    const session = document.createElement("div");
    session.className = "session";

    const div = document.createElement("div");
    div.textContent = name;

    const btnS = document.createElement("button");
    btnS.id = id;
    btnS.className = "connectBtn";
    btnS.textContent = "Connect";

    session.appendChild(div);
    session.appendChild(btnS);

    document.getElementById("sessions").appendChild(session);
}

function updateWinList(stat) {
    console.log(stat);

    const div_win_block = document.getElementById("win_block");

    const div_winner = document.createElement("div");
    div_winner.className = "winner";

    const p = document.createElement("p");
    p.class = "win_info";
    p.textContent = `'${stat.winner.id}' is winner.`;

    const p2 = document.createElement("p");
    p2.class = "lose_info";
    p2.textContent = `'${stat.loser.id}' is loser.`;

    div_winner.appendChild(p);
    div_winner.appendChild(p2);
    div_win_block.appendChild(div_winner);
}

function refreshSessions(sessionsList) {
    document.getElementById("sessions").innerHTML = "";
    sessionsList.forEach(session => {
        // console.log(session);
        const name = session.players[0].player;
        const id = session.id;
        
        newSession(name, id);
        if (session.statistics.winner) updateWinList(session.statistics);

        //------Event-for-Connect-button----------
        try {
            const btnConnect = document.getElementById(id);
            btnConnect.addEventListener('click', async (e) => {
                window.open("/game:" + e.target.id, "_self");
            });
        } catch (err) {
            console.error("Error:", err);
        }
        //----------------------------------------
    });
}

export { refreshSessions }