const WebSocket = require("ws")
const log = require("../../src/log")

const wss = new WebSocket.Server({ port: 8080 })

wss.on("connection", ws => {
    log("Dashboard", "Client connected")

    global.ws = ws

    global.discord_status = "●"

    ws.on("close", () => {
        log("Dashboard", "Client has disconnected")
        global.discord_status = ""
    });
});

function postHandler(req, res, next) {
    if (req.method === "POST") {
        if (global.discord_status === "●") {
            global.ws.send(req.url)
        }
        res.redirect('/')
    }

    next()
}

module.exports = postHandler