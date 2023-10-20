function tryParse(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

module.exports = { tryParse };
