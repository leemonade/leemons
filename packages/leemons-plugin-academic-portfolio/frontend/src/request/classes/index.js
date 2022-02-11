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

export {
  haveClasses,
  listClasses,
  listStudentClasses,
  listTeacherClasses,
  createClass,
  updateClass,
  updateClassMany,
  createClassInstance,
  addStudentsToClass,
  addTeachersToClass,
};
