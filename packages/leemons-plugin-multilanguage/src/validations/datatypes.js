module.exports = (value, { type, ...options }) => {
  if (type === 'string') {
    if (typeof value !== 'string') {
      return { valid: false, code: 'invalidType', message: 'must be a string' };
    }

    if (
      (options.minLength !== undefined && value.length < options.minLength) ||
      (options.maxLength && value.length > options.maxLength)
    ) {
      const message = [];

      if (options.minLength) {
        message.push(`can't be lower than ${options.minLength}`);
      }
      if (options.maxLength) {
        message.push(`can't be greater than ${options.maxLength}`);
      }
      return { valid: false, code: 'invalidLength', message: message.join(' and ') };
    }
  } else if (type === 'array') {
    if (!Array.isArray(value)) {
      return { valid: false, code: 'invalidType', message: 'must be an array' };
    }

    const { length } = value;
    for (let i = 0; i < length; i++) {
      const _value = value[i];

      if (typeof options.validate !== 'function') {
        throw new Error('The array type requires the option validate (function)');
      }

      const validated = options.validate(_value);
      if (validated.valid === false || validated === false) {
        const code = validated.code || 'invalidFormat';
        const message = validated.message || 'Should match the format';
        return { valid: false, code, message };
      }
    }
  } else {
    throw new Error('Type not supported');
  }

  return { valid: true };
};
