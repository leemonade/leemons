const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { validateAddClassStudents } = require('../../validations/forms');
const { classByIds } = require('./classByIds');
const { add: addStudent } = require('./student/add');

async function addClassStudents({ data, ctx }) {
  await validateAddClassStudents(data);

  const getClassSeats = (cl) => {
    if (cl.parentClass) return getClassSeats(cl.parentClass);
    return cl.seats;
  };
  const getClass = async () => (await classByIds({ ids: data.class, ctx }))[0];

  const _class = await getClass();
  const seats = getClassSeats(_class);

  let nAddStudents = 0;
  const promises = [];
  _.forEach(data.students, (student) => {
    // Si el alumno ya esta añadido no lo añadimos
    if (_class.students.indexOf(student) < 0 && _class.parentStudents.indexOf(student) < 0) {
      // ES: Comprobamos si quedan espacios en la clase
      if (_.isNil(seats))
        throw new LeemonsError(ctx, {
          message: 'No seats in class',
          httpStatusCode: 400,
          customCode: 5001,
        });
      if (seats <= _class.students.length + _class.parentStudents.length + nAddStudents)
        throw new LeemonsError(ctx, {
          message: 'Class is full',
          httpStatusCode: 400,
          customCode: 5002,
        });

      nAddStudents++;
      promises.push(addStudent({ class: data.class, student, ctx }));
    }
  });

  await Promise.all(promises);

  return getClass();
}

module.exports = { addClassStudents };
