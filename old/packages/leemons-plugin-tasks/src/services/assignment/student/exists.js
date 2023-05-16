const { userInstances } = require('../../table');

module.exports = async function existsStudent(student, instance, { transacting } = {}) {
  const cont = await userInstances.count(
    {
      instance,
      user: student,
    },
    { transacting }
  );

  return cont > 0;
};
