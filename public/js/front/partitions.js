// async function set2ndPlayer(session_id) {
//     const url = "/set2ndPlayer";
//     const data = { "session_id": session_id };

//     try {
//         const response = await fetch(url, { 
//             method: 'POST',
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(data),
//         })
//         .then(resp => {
//             if(!resp.ok) // если возникла ошибка, то срабатывает исключение и кадет в catch
//                 throw new Error("HTTP-Error: " + resp.status);
//             return resp;
//         });

        
//         return response.json();
//     } catch(error) {
//         console.error("Error", error);
//     }
// }

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
        console.log(session);
        const name = session.owner;
        const id = session.id;
        
        newSession(name, id);

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