module.exports = (key) => {
  if (typeof key !== 'string') {
    return { valid: false, code: 'invalidType', message: 'must be a string' };
  }
  if (!key) {
    return { valid: false, code: 'noEmpty', message: "can't be empty" };
  }

  if (!/^([a-z]+\.){0,}[a-z]+$/.test(key)) {
    return {
      valid: false,
      code: 'invalidFormat',
      message: "must be a string of lower cased letters, the words can be separated by '.'",
    };
  }

  return { valid: true };
};
