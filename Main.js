const gradient = require('gradient-string');
const logs = require ('./utils/logs')
const configs = require('./config/ConfigSection')
const license = require ('./utils/license')
const fs = require('fs')
const {readConfig} = require('./config/TemplateConfig')
const config = configs.readConfig('./config.yaml')
const instance = require('./manager/InstanceManager')
const term = require('terminal-kit').terminal;
const commands = [];
const path = require('path')

const loadCommandsFromDirectory = (directory) => {
    const files = fs.readdirSync(directory);
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        loadCommandsFromDirectory(filePath);
      } else if (file.endsWith('.js')) {
        const command = require(filePath);
        commands.push(command);
      }
    }
  };
  

let mainLogo = gradient.instagram.multiline([
    `
██╗   ██╗    ██╗███╗   ██╗███████╗████████╗ █████╗ ███╗   ██╗ ██████╗███████╗
██║   ██║    ██║████╗  ██║██╔════╝╚══██╔══╝██╔══██╗████╗  ██║██╔════╝██╔════╝
██║   ██║    ██║██╔██╗ ██║███████╗   ██║   ███████║██╔██╗ ██║██║     █████╗  
██║   ██║    ██║██║╚██╗██║╚════██║   ██║   ██╔══██║██║╚██╗██║██║     ██╔══╝  
╚██████╔╝    ██║██║ ╚████║███████║   ██║   ██║  ██║██║ ╚████║╚██████╗███████╗
 ╚═════╝     ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝
                                                                             `
].join('\n'));
Main()

function Main() {

fs.unlink("logs.txt", err => {
    if (err) return;
  })
console.log(mainLogo)

logs.logs("Loading uInstance v1...", "info")

/*license.checkLicense(config.license).then((res) => {
if (res == "free") start(2)
if (res == "premium") start(666)
})
*/
start(2)
}

async function start (maxinstance) {
    loadCommandsFromDirectory(path.join(__dirname, 'commands'));

    instance.createInstance("test", "bot")
    return terms()
}

function terms() {
    term.inputField(
        async function( error , input ) {
            const [commandName, ...args] = input.trim().split(' ');
            const command = commands.find(c => c.name === commandName);
            if (commandName.includes("exit") || commandName.includes("stop")) {
                process.exit()
            } else
            if (!command) {
                logs.logs("Commande invalide ! tapez help","error", true)
                return terms()
            } else {
                command.execute(args, logs)
                return terms()
            }
            
        }
    )
}