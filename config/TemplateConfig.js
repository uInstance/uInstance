const fs = require('fs');
const path = require('path');
const readPkg = require('read-package-json');

function readConfig(template) {
  return new Promise((resolve, reject) => {
    const packageJsonPath = path.join('./template', template, 'package.json');
    const defaultName = 'defaultname';
    const defaultMain = 'index.js';
    const defaultAuthor = 'defaultauthor';
    const defaultModules = [];

    // Lit le fichier package.json de la template
    readPkg(packageJsonPath, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        // Récupère les informations de base du package.json
        const name = data.name || defaultName;
        const main = data.main || defaultMain;
        const author = data.author || defaultAuthor;
        const modules = Object.keys(data.dependencies || {}).concat(Object.keys(data.devDependencies || {}));

        resolve({
          name,
          main,
          author,
          modules
        });
      }
    });
  });
}

module.exports = {
  readConfig
};