function log(author, consoleOutput) {
    date = new Date()
    hours = date.getHours()
    minutes = date.getMinutes()

    if (minutes.toString().length === 1) {
        minutes = "0" + minutes
    }

    output = `[${hours}:${minutes}] ${author}: ${consoleOutput}`
    console.log(output)
}

module.exports = log