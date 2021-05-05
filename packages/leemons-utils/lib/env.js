const _ = require('lodash');
const fs = require('fs-extra');
const dotenv = require('dotenv');

module.exports = {
  env: (key, defaultValue) => _.get(process.env, key, defaultValue),
  generateEnv: (filename) =>
    new Promise((resolve) => {
      fs.exists(filename).then((exists) => {
        if (exists) {
          fs.readFile(filename).then((file) => {
            const config = dotenv.parse(file);
            resolve(config);
          });
        } else {
          resolve({});
        }
      });
    }),
};
