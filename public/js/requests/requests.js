async function createSession() {
    const url = "/createSession";
    try {
        const response = await fetch(url, { 
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(resp => {
            if(!resp.ok) // если возникла ошибка, то срабатывает исключение и кадет в catch
                throw new Error("HTTP-Error: " + resp.status);
            return resp;
        });

        return response.json();
    } catch(error) {
        console.error("Error", error);
    }
}

async function sessionsList() {
    const url = "/getSessionsList";
    try {
        const response = await fetch(url, { 
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
            // body: JSON.stringify(data),
        })
        .then(resp => {
            if(!resp.ok) // если возникла ошибка, то срабатывает исключение и кадет в catch
                throw new Error("HTTP-Error: " + resp.status);
            return resp;
        });

        return response.json();
    } catch(error) {
        console.error("Error", error);
    }
}

export { createSession, sessionsList };