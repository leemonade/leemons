// Todo importar exist file
const existFile = (id, { transacting }) => true;

async function validateExistFile(id, { transacting } = {}) {
  if (await existFile(id, { transacting })) throw new Error(`File '${id}' already exists`);
}

async function validateNotExistFile(id, { transacting } = {}) {
  if (!(await existFile(id, { transacting }))) throw new Error(`File '${id}' not exists`);
}

module.exports = {
  validateExistFile,
  validateNotExistFile,
};
