const fs = require('fs');
// const { init_field } = require('./field.js');

const books = [
    { title: "The Alchemist", author: "Paulo Coelho", year: 1988 },
    { title: "The Prophet", author: "Kahlil Gibran", year: 1923 }
];


const callback_loadFile = function(req, res, contentType) {
    fs.readFile(req.fileDir, (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end(err.message);
        } else {
            res.setHeader('Content-Type', contentType);
            res.writeHead(200);
            return res.end(data);
        }
    });
};

const requestListener = function(req, res) {
    switch (req.url) {
        case "/":
            req.fileDir = "index.html";
            callback_loadFile(req, res, "text/html");
            break;
        case "/index.css":
            req.fileDir = "public/css" + req.url;
            callback_loadFile(req, res, "text/css");
            break;
        case "/field.js":
            req.fileDir = "public/js" + req.url;
            callback_loadFile(req, res, "text/js");
            break;
        // case "/books":
        //     res.setHeader('Content-Type', 'application/json');
        //     res.writeHead(200);
        //     res.end(JSON.stringify(books));
        //     break;
        default:
            res.writeHead(404);
            res.end(JSON.stringify({error:"Resource not found"}));
            break;
    }
};

exports.requestListner = requestListener;