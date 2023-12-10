import { createSession, sessionsList } from '../requests/requests.js';
import { refreshSessions } from '../front/partitions.js';

// refreshSessions("Session1", "s1");

const btnNewSession = document.getElementById("createSession");
btnNewSession.addEventListener("click", async () => {
    const answ = await createSession();
    window.open("/game:" + answ.id, "_self");
});

// Event for connect button you can find in `partition.js`

let currentSessions = [];
const eventSource = new EventSource('/listUpdate');
eventSource.onmessage = (event) => {
    const response = JSON.parse(event.data);
    try {
        // console.log(currentSessions.toString() != response.sessions.toString());
        if (currentSessions.toString() != response.sessions.toString()) {
            currentSessions = response.sessions;
            refreshSessions(currentSessions);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

