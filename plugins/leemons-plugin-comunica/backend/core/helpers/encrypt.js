const jwt = require('jsonwebtoken');

function encrypt(payload, secretKey) {
  return jwt.sign({ payload }, secretKey, {
    expiresIn: 60 * 60 * 24 * 365 * 9999, // 9999 years
  });
}

module.exports = { encrypt };
