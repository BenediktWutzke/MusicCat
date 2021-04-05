const fs = require("fs")
const log = require("../../src/log")
const prompt = require("prompt-sync")()

function ckeckConfig() {
    var rawdata = fs.readFileSync('./config.json')
    var config = JSON.parse(rawdata)

    if (config.bot_prefix === "" || config.guild_name === "" || config.user_name === "" || config.token === "") {
        log("Setup", "Welcome to the Setup and thanks for using MusicCat!")
        log("Setup", "You need to do this setup because you are using MusicCat for the first time or the config file does not contain the important data anymore.")
        log("Setup", "Please enter the following data")

        setup()
    } else {
        var answer = prompt("Do you want to edit the config file? [y/n] ")
        
        while (answer != "y" && answer != "n") {
            var answer = prompt("YES or NO [y/n] ")
        }

        if (answer == "y") {
            setup()
        }

    }
}

function setup() {
    var rawdata = fs.readFileSync('./config.json')
    var config = JSON.parse(rawdata)

    const bot_prefix = prompt('Bot prefix* $ ')
    const guild_name = prompt('Guild name* $ ')
    const user_name = prompt('User name* $ ')
    const channel_name = prompt('Channel name $ ')
    const token = prompt('Token* $ ')
    const port = prompt("Port $ ")

    if (bot_prefix != "") {config.bot_prefix = bot_prefix}
    if (guild_name != "") {config.guild_name = guild_name}
    if (user_name != "") {config.user_name = user_name}
    if (channel_name != "") {config.channel_name = channel_name}
    if (token != "") {config.token = token}
    if (port != "") {config.port = port}

    var data = JSON.stringify(config, null, 2)
    fs.writeFileSync("./config.json", data, (err) => {
        if (err) throw err
    })
}

module.exports = { ckeckConfig }