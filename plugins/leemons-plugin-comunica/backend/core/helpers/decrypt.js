const jwt = require('jsonwebtoken');

async function decrypt(token, secretKey) {
  const { payload } = jwt.verify(token, secretKey);
  return payload;
}

module.exports = { decrypt };
