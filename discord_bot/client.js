const WebSocket = require("ws")
const Discord = require('discord.js')
const fs = require("fs")
const log = require("../src/log")
const { exit } = require("process")

const client = new Discord.Client()

const ws = new WebSocket("ws://localhost:8080")

ws_connection_status = "Connected"

ws.onerror = function () {
    log("DiscordBot", "Failed to connect to the dashboard")
    ws_connection_status = "Disconnected"
}

var rawdata = fs.readFileSync('./config.json')
var config = JSON.parse(rawdata)

var prefix = config.bot_prefix
var guild_name = config.guild_name
var user_name = config.user_name
var channel_name = config.channel_name
var token = config.token

var guild = undefined

client.on("ready", () => {
    log("DiscordBot", `The client has been successfully logged in as user ${client.user.username}`)
    guild = client.guilds.cache.find(guild => guild.name === guild_name)

    if (!guild) {
        log("Error", "No guild found with the given name")
        exit()
    }
})

client.on("message", (message) => {
    if (message.author.bot === true) return
    if (message.guild != guild) return

    if (message.content === `${prefix}status`) {
        color = undefined
        if (ws_connection_status = "Connected") {
            color = "0x03ff46"
        } else {
            color = "0xfc030b"
        }

        const embed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle("Dashboard connection")
        .setDescription(ws_connection_status)
        .setFooter('zorks.de/musiccat');
    
        message.channel.send(embed)
    }

    if (message.content === `${prefix}help`) {
        const embed = new Discord.MessageEmbed()
        .setColor("0xff9e00")
        .setTitle("If you need help with something come to my Discordserver!")
        .setDescription("[Discord](https://zorks.de/server)")
        .setFooter('zorks.de/musiccat')

        message.channel.send(embed)
    }
})


if (ws_connection_status === "Connected") {
    ws.addEventListener("open", () => {
        log("DiscordBot", "Connected to the Dashboard")

        ws.on("message", command => {
            command = command.replace("/", "")

            if (command === "join-me") {
                const user_id = client.users.cache.find(user => user.username == user_name).id
                const user = guild.members.cache.get(user_id)
                if (!user) {
                    log("DiscordBot", "No user found in the guild with the given namen")
                    return
                }

                var channel = user.voice.channel
                if (!channel) {
                    log("DiscordBot", "You need to be in a voice channel")
                    return
                }

                const permissions = channel.permissionsFor(client.user);
                if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                    log("DiscordBot", "I need the permissions to join and speak in your voice channel")
                    return
                }

                channel.join()
                return
            }

            if (command === "join-channel") {
                const channel = guild.channels.cache.find(VoiceChannel => VoiceChannel.name === channel_name)

                if (!channel) {
                    log("Error", "No channel found in the guild with the given name")
                    exit()
                }

                const permissions = channel.permissionsFor(client.user);
                if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                    log("DiscordBot", "I need the permissions to join and speak in your voice channel")
                    return
                }

                if (channel.type === "voice") {
                    channel.join()
                    return
                } else {
                    log("DiscordBot", "This channel is not a VoiceChannel")
                }

            }

            if (command === "leave") {
                var voice = guild.voice
                if (!voice) {
                    return
                }

                var channel = voice.channel
                if (!channel) {
                    return
                }

                channel.leave()
                return
            }

            const sounds_folder = "./sounds"
            fs.readdir(sounds_folder, (err, files) => {
                files.forEach(file => {
                    if (file === command) {
                        if (guild.voice) {
                            var connection = guild.voice.connection
                        } else {
                            return
                        }

                        if (connection) {
                            connection.play(`./sounds/${command}`)
                        }
                    }
                })
            })


        })
    })
}


client.login(token)
  .then(function() {
  }, function(err) {
    log("DiscordBot", "Invalid token")
    exit()
  })