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

function refreshSessions(sessionsList) {
    document.getElementById("sessions").innerHTML = "";
    sessionsList.forEach(session => {
        const name = session.sessionOwner;
        const id = session.id;
        
        newSession(name, id);

        try {
            const btnConnect = document.getElementById(id);
            btnConnect.addEventListener('click', (e) => {
                window.open("/game:" + e.target.id, "_self");
            });
        } catch (err) {
            console.error("Error:", err);
        }
    });
}

export { refreshSessions }