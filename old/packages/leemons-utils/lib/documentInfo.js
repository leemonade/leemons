const document = require('office-document-properties');

function fromFilePath(path) {
  return new Promise((resolve, reject) => {
    document.fromFilePath(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function fromBuffer(buffer) {
  return new Promise((resolve, reject) => {
    document.fromBuffer(buffer, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = { fromFilePath, fromBuffer };
