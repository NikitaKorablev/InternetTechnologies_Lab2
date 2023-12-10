import { drawField } from '../front/draw.js';

window.addEventListener("load", async () => {
    let currentChanges = await drawField();
    
    // let currentChanges = [];
    const eventSource = new EventSource('/getChanges');
    eventSource.onmessage = (event) => {
        const response = JSON.parse(event.data);
        try {
            // console.log(response.changes);
            if (response.changes && response.changes.length != currentChanges.length) {
                if (response.changes.length - currentChanges.length > 1) 
                    throw new Error("More than one changes.");
    
                const newChanges = response.changes[response.changes.length-1];
                // console.log(currentChanges, response.changes, newChanges);
                
                currentChanges = response.changes;
    
                const i = newChanges.i; const j = newChanges.j;
                if (!i || !j) throw new Error("Undefined i or j.");
    
                const div = document.getElementById(`${i} ${j}`);
                if (!div) 
                    throw new Error("Can`t find div with id: ["+i+"]["+j+"]");
                const img = div.getElementsByTagName("img")[0];
                if (!img) 
                    throw new Error("Can`t find img in div with id: ["+i+"]["+j+"]");
                img.src = "../assets/" + newChanges.obj + ".png";
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    
})

