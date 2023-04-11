const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const logs = require('../utils/logs');
const { readConfig } = require('../config/TemplateConfig');

const instances = {};

async function createInstance(templateName, name) {
  const instanceId = name; // Génère un identifiant unique pour l'instance
  const templateDir = path.join('./template', templateName);
  const instanceDir = path.join('./instances', instanceId);
  
  if (fs.existsSync(instanceDir)) {
    return logs.logs(`L'instance ${instanceId} existe déjà !`, "error");
  }
  
  // Copie le contenu du dossier template dans le dossier de l'instance
  fs.mkdirSync(instanceDir);
  fs.readdirSync(templateDir).forEach(file => {
    const filePath = path.join(templateDir, file);
    fs.copyFileSync(filePath, path.join(instanceDir, file));
  });
  
  // Installe les modules nécessaires à partir du package.json de la template

  const { modules, main } = await readConfig(templateName);
  if (modules.length > 0) {
    logs.logs(`Installation des modules pour l'instance ${instanceId}...`, 'info');
    const npmInstall = spawn("npm ", ['install', '--prefix', instanceDir].concat(modules));
    npmInstall.stdout.on('data', data => {
      console.log(`[Instance ${instanceId}] ${data}`);
    });
    npmInstall.stderr.on('data', (data) => {
      console.error(`Erreur lors de l'installation des dépendances NPM pour l'instance ${instanceId}: ${data}`);
    });
    npmInstall.on('close', (code) => {
      if (code === 0) {
        console.log(`Les dépendances NPM ont été installées avec succès pour l'instance ${instanceId}`);
        const process = spawn('node', [path.join(instanceDir, main)]);
        instances[instanceId] = process;
        process.stdout.on('data', (data) => {
          console.log(`[Instance ${instanceId}] ${data}`);
        });
        process.stderr.on('data', (data) => {
          console.error(`[Instance ${instanceId} ERROR] ${data}`);
        });
        process.on('close', (code) => {
          console.log(`[Instance ${instanceId}] Processus terminé avec le code ${code}`);
          delete instances[instanceId];
        });
      } else {
        console.error(`Erreur lors de l'installation des dépendances NPM pour l'instance ${instanceId}`);
      }
    });
  } else {
    const process = spawn('node', [path.join(instanceDir, main)]);
        instances[instanceId] = process;
        process.stdout.on('data', (data) => {
          console.log(`[Instance ${instanceId}] ${data}`);
        });
        process.stderr.on('data', (data) => {
          console.error(`[Instance ${instanceId} ERROR] ${data}`);
        });
        process.on('close', (code) => {
          console.log(`[Instance ${instanceId}] Processus terminé avec le code ${code}`);
          delete instances[instanceId];
        });
  }
}
    function stopInstance(instanceId) {
      const process = instances[instanceId];
      if (process) {
        process.kill();
        delete instances[instanceId];
        fs.rmdirSync(path.join('./instances', instanceId), { recursive: true });
      }
    }
  
module.exports = {
  createInstance,
  stopInstance
}