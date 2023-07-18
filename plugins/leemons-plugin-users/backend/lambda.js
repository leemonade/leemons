const { LeemonsLambdaRunner } = require('leemons-lambda-runner');

function handler(...props) {
  LeemonsLambdaRunner(...props);
}

module.exports = { handler };
