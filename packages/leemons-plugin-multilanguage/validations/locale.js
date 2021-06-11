module.exports = (code) => {
  if (typeof code !== 'string') {
    return { valid: false, code: 'invalidType', message: 'The locale must be a string' };
  }

  // Test locale of length 2
  if (code.length === 2) {
    // Match the format xx
    if (!/^[a-z]{2}$/.test(code)) {
      return {
        valid: false,
        code: 'invalidFormat',
        message: 'The locale of length 2 can only have letters',
      };
    }
    // Test locale of length 5
  } else if (code.length === 5) {
    // Match the format xx-YY
    if (!/^[a-z]{2}-[a-z]{2}$/.test(code)) {
      return {
        valid: false,
        code: 'invalidFormat',
        message: 'The locale of length 5 must have the format xx-yy',
      };
    }
    // Invalid locale length
  } else {
    return {
      valid: false,
      code: 'invalidLength',
      message: 'The locale must have length of 2 (xx) or 5 (xx-yy)',
    };
  }

  // Everything ok
  return { valid: true };
};
