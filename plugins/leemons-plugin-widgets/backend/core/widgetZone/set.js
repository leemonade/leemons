const { add, exists, update } = require('.');

async function set({ key, name, description, ctx }) {
  const existsFlag = await exists({ key, ctx });
  if (existsFlag) return update({ key, name, description, ctx });
  return add({ key, name, description, ctx });
}

module.exports = { set };
