const instance = require('../../manager/InstanceManager')

module.exports = {
    name: 'instance',
    async execute(args, logs) {
        if (!args[0]) {
            return console.log(`
                instance create <nom de la template> <nom>
                instance delete <nom>
                instance start <nom>
                instance stop <nom>`.yellow)
        } else if (args[0] == "create") {
            if (!args[2]) return console.log(`
            instance create <nom de la template> <nom>
            instance delete <nom>
            instance start <nom>
            instance stop <nom>`.yellow)

            instance.createInstance(args[1], args[2])
        }1
    }
}