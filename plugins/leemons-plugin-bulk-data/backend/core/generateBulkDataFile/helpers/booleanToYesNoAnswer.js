function booleanToYesNoAnswer(value) {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return value;
}
module.exports = { booleanToYesNoAnswer };
