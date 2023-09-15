const jwt = require('jsonwebtoken');

function decrypt(token, secretKey) {
  const { payload } = jwt.verify(token, secretKey);
  return payload;
}

module.exports = { decrypt };
