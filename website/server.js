const setup = require("./website_src/setup")
setup.ckeckConfig()

const express = require('express')
const app = express()
const fs = require('fs')
const log = require("../src/log")
const postHandler = require("./website_src/postHandler")

app.use(express.static("pictures"))
app.use(express.static("website/stylesheets"))
app.set('views', './website/views')                                 // Legt den views Ordner fest
app.set('view-engine', 'ejs')                                       // Macht ejs Dateien nutzbars

global.discord_status = ""
app.use(postHandler)

app.get('/', (req, res) => {
    buttons = ''
    fs.readdirSync("./sounds").forEach(file => {
        filename = file.replace(".mp3", "")
        while (filename.includes("-")) {
            filename = filename.replace("-", " ")
        }
        buttons = buttons + `<form action="/${file}" method="POST"><button>${filename}</button></form> `
    })

    res.render('dashboard.ejs', { status: global.discord_status, buttons: buttons })
})

var port = 3000

var rawdata = fs.readFileSync('./config.json')
var config = JSON.parse(rawdata)

if (config.port != "") {
    var input_port = parseInt(config.port, 10)
    if (Number.isInteger(input_port)) {
        port = input_port
    } else {
        log("Dashboard", "Given port is not an integer. Use standard port.")
    }
}

app.listen(port)

log("Dashboard", `Started Dashboard on port ${port}`)