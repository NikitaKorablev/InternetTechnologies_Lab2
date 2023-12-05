const { Cross, Zero, Cell, Field, Session } = require('./game.js');


// const callback_loadFile = function(req, res, contentType) {
//     fs.readFile(req.fileDir, (err, data) => {
//         if (err) {
//             res.writeHead(500);
//             return res.end(err.message);
//         } else {
//             res.setHeader('Content-Type', contentType);
//             res.writeHead(200);
//             return res.end(data);
//         }
//     });
// };




async function startSession(req, res) {
    const s = new Session();
    sessions.push(s);

    data = {
        "id": s.id
    };

    res.setHeader('Content-Type', "application/json");
    res.writeHead(200);
    return res.end(JSON.stringify(data));
}

module.exports = { startSession }