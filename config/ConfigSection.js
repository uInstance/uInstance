const fs = require('fs')
const yaml = require('js-yaml')

function readConfig(config) {

try {
  const fileContents = fs.readFileSync(config, 'utf8')
  const data = yaml.load(fileContents)
 return data
} catch (err) {
  return err
}
}

module.exports = {
readConfig
}