const _ = require('lodash');
const { table } = require('../tables');
const { validateAddClassStudents } = require('../../validations/forms');
const { classByIds } = require('./classByIds');
const { add: addStudent } = require('./student/add');

async function addClassStudents(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddClassStudents(data, { transacting });

      const getClassSeats = (cl) => {
        if (cl.parentClass) return getClassSeats(cl.parentClass);
        return cl.seats;
      };
      const getClass = async () => (await classByIds(data.class, { transacting }))[0];

      const _class = await getClass();
      const seats = getClassSeats(_class);

      let nAddStudents = 0;
      const promises = [];
      _.forEach(data.students, (student) => {
        // Si el alumno ya esta añadido no lo añadimos
        if (_class.students.indexOf(student) < 0 && _class.parentStudents.indexOf(student) < 0) {
          // ES: Comprobamos si quedan espacios en la clase
          if (_.isNil(seats))
            throw new global.utils.HttpErrorWithCustomCode(400, 5001, 'No seats in class');
          if (seats <= _class.students.length + _class.parentStudents.length + nAddStudents)
            throw new global.utils.HttpErrorWithCustomCode(400, 5002, 'Class is full');

          nAddStudents++;
          promises.push(addStudent(data.class, student, { transacting }));
        }
      });

      await Promise.all(promises);

      return getClass();
    },
    table.groups,
    _transacting
  );
}

module.exports = { addClassStudents };
