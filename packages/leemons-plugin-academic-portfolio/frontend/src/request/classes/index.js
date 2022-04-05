async function haveClasses() {
  return leemons.api(`academic-portfolio/classes/have`, {
    allAgents: true,
    method: 'GET',
  });
}

async function listClasses({ page, size, program }) {
  return leemons.api(`academic-portfolio/class?page=${page}&size=${size}&program=${program}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function listStudentClasses({ page, size, student }) {
  return leemons.api(`academic-portfolio/student/${student}/classes?page=${page}&size=${size}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function listTeacherClasses({ page, size, teacher }) {
  return leemons.api(`academic-portfolio/teacher/${teacher}/classes?page=${page}&size=${size}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function listSessionClasses(body) {
  return leemons.api(`academic-portfolio/session/classes`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function createClass(body) {
  return leemons.api('academic-portfolio/class', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function createClassInstance(body) {
  return leemons.api('academic-portfolio/class/instance', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function updateClass(body) {
  return leemons.api('academic-portfolio/class', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

async function updateClassMany(body) {
  return leemons.api('academic-portfolio/class/many', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

async function addStudentsToClass(body) {
  return leemons.api('academic-portfolio/class/students', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function addTeachersToClass(body) {
  return leemons.api('academic-portfolio/class/teachers', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function removeClass(id) {
  return leemons.api(`academic-portfolio/class/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

async function removeStudentFromClass(classId, student) {
  return leemons.api(`academic-portfolio/class/remove/students`, {
    allAgents: true,
    method: 'POST',
    body: {
      class: classId,
      student,
    },
  });
}

async function classDetailForDashboard(classId) {
  return leemons.api(`academic-portfolio/class/dashboard/${classId}`, {
    allAgents: true,
    method: 'GET',
  });
}

export {
  haveClasses,
  listClasses,
  listStudentClasses,
  listTeacherClasses,
  createClass,
  updateClass,
  removeClass,
  updateClassMany,
  listSessionClasses,
  createClassInstance,
  addStudentsToClass,
  addTeachersToClass,
  removeStudentFromClass,
  classDetailForDashboard,
};
