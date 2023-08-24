import { isString } from 'lodash';

async function haveClasses() {
  return leemons.api(`academic-portfolio/classes/have`, {
    allAgents: true,
    method: 'GET',
  });
}

async function listClasses({ page, size, program }) {
  return leemons.api(`academic-portfolio/class?page=${page}&size=${size}&program=${program}`, {
    waitToFinish: true,
    allAgents: true,
    method: 'GET',
  });
}

async function listSubjectClasses({ page, size, subject }) {
  return leemons.api(
    `academic-portfolio/subjects/class?page=${page}&size=${size}&subject=${subject}`,
    {
      allAgents: true,
      method: 'GET',
    }
  );
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
  const form = new FormData();
  if ((body.image && !isString(body.image)) || (body.icon && !isString(body.icon))) {
    const { image, icon, ...data } = body;
    if (body.image) {
      if (body.image.id) {
        data.image = body.image.cover?.id;
      } else {
        form.append('image', body.image, body.image.name);
      }
    }
    if (body.icon) {
      if (body.icon.id) {
        data.icon = body.icon.cover?.id;
      } else {
        form.append('icon', body.icon, body.icon.name);
      }
    }
    form.append('data', JSON.stringify(data));
  } else {
    form.append('data', JSON.stringify(body));
  }
  return leemons.api('academic-portfolio/class', {
    allAgents: true,
    method: 'POST',
    headers: {
      'content-type': 'none',
    },
    body: form,
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
  const form = new FormData();
  if ((body.image && !isString(body.image)) || (body.icon && !isString(body.icon))) {
    const { image, icon, ...data } = body;
    if (body.image) {
      if (body.image.id) {
        data.image = body.image.cover?.id;
      } else {
        form.append('image', body.image, body.image.name);
      }
    }
    if (body.icon) {
      if (body.icon.id) {
        data.icon = body.icon.cover?.id;
      } else {
        form.append('icon', body.icon, body.icon.name);
      }
    }
    form.append('data', JSON.stringify(data));
  } else {
    form.append('data', JSON.stringify(body));
  }
  return leemons.api('academic-portfolio/class', {
    allAgents: true,
    method: 'PUT',
    headers: {
      'content-type': 'none',
    },
    body: form,
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

async function classByIds(classIds) {
  const ids = JSON.stringify(Array.isArray(classIds) ? classIds : [classIds]);

  return leemons.api(`academic-portfolio/classes?ids=${ids}`, {
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
  listSubjectClasses,
  listSessionClasses,
  createClassInstance,
  addStudentsToClass,
  addTeachersToClass,
  removeStudentFromClass,
  classDetailForDashboard,
  classByIds,
};
