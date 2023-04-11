const fs = require('fs')
const path = require('path')
const colors = require('colors')

function logs(text, variety, skipline) {
    const logFilePath = path.join('logs.txt')
    const date = new Date()
    const timeString = date.toLocaleTimeString('fr-FR', { hour12: false })
    const logMessage = `[${timeString}] [${variety.toUpperCase()}] ${text}`

    
    if (variety === 'info') {
        if (skipline == true) {
            console.log("\n" + logMessage.gray)
        } else {
            console.log(logMessage.gray)
        }
    }

    if (variety === 'error') {
        if (skipline == true) {
            console.log("\n" + logMessage.red)
        } else {
            console.log(logMessage.red)

        }
    }

    fs.appendFile(logFilePath, `${logMessage}\n`, err => {
        if (err) {
            console.error(`Error writing log message: ${err}`)
        }
    })
}

module.exports = {
    logs    
}