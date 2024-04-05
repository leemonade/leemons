import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import { isString } from 'lodash';

async function haveClasses() {
  return leemons.api(`v1/academic-portfolio/classes/have`, {
    allAgents: true,
    method: 'GET',
  });
}

async function listClasses({ page, size, program }) {
  return leemons.api(`v1/academic-portfolio/classes?page=${page}&size=${size}&program=${program}`, {
    waitToFinish: true,
    allAgents: true,
    method: 'GET',
  });
}

async function listSubjectClasses({ page, size, subject }) {
  if (isString(subject)) {
    return leemons.api(
      `v1/academic-portfolio/classes/subjects/class?page=${page}&size=${size}&subject=${subject}`,
      {
        allAgents: true,
        method: 'GET',
      }
    );
  }

  // Form multiple subjects classes retrival
  const body = { page, size, subjects: subject };
  return leemons.api(`v1/academic-portfolio/classes/subjects/multiple`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function listStudentClasses({ page, size, student }) {
  return leemons.api(`v1/academic-portfolio/student/${student}/classes?page=${page}&size=${size}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function listTeacherClasses({ page, size, teacher }) {
  return leemons.api(`v1/academic-portfolio/classes/teacher/${teacher}?page=${page}&size=${size}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function listSessionClasses(body) {
  return leemons.api(`v1/academic-portfolio/classes/session`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function createClass(body) {
  let toSend = body;
  if ((body.image && !isString(body.image)) || (body.icon && !isString(body.icon))) {
    const { image, icon, ...data } = body;
    if (body.image) {
      if (body.image.id) {
        data.image = body.image.cover?.id;
      } else {
        data.image = await uploadFileAsMultipart(body.image, { name: body.image.name });
      }
    }
    if (body.icon) {
      if (body.icon.id) {
        data.icon = body.icon.cover?.id;
      } else {
        data.icon = await uploadFileAsMultipart(body.icon, { name: body.icon.name });
      }
    }
    toSend = data;
  }
  return leemons.api('v1/academic-portfolio/classes', {
    allAgents: true,
    method: 'POST',
    body: toSend,
  });
}

async function createClassInstance(body) {
  return leemons.api('v1/academic-portfolio/classes/instance', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function updateClass(body) {
  let toSend = body;
  if ((body.image && !isString(body.image)) || (body.icon && !isString(body.icon))) {
    const { image, icon, ...data } = body;
    if (body.image) {
      if (body.image.id) {
        data.image = body.image.cover?.id;
      } else {
        data.image = await uploadFileAsMultipart(body.image, { name: body.image.name });
      }
    }
    if (body.icon) {
      if (body.icon.id) {
        data.icon = body.icon.cover?.id;
      } else {
        data.icon = await uploadFileAsMultipart(body.icon, { name: body.icon.name });
      }
    }
    toSend = data;
  }
  return leemons.api('v1/academic-portfolio/classes', {
    allAgents: true,
    method: 'PUT',
    body: toSend,
  });
}

async function updateClassMany(body) {
  return leemons.api('v1/academic-portfolio/classes/many', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

async function addStudentsToClass(body) {
  return leemons.api('v1/academic-portfolio/classes/students', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function addTeachersToClass(body) {
  return leemons.api('v1/academic-portfolio/classes/teachers', {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function removeClass(id) {
  return leemons.api(`v1/academic-portfolio/classes/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

async function removeStudentFromClass({ classId, studentId }) {
  return leemons.api(`v1/academic-portfolio/classes/remove/students`, {
    allAgents: true,
    method: 'POST',
    body: {
      class: classId,
      student: studentId,
    },
  });
}

async function classDetailForDashboard(classId) {
  return leemons.api(`v1/academic-portfolio/classes/dashboard/${classId}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function classByIds(classIds) {
  const ids = JSON.stringify(Array.isArray(classIds) ? classIds : [classIds]);

  return leemons.api(`v1/academic-portfolio/classes/raw-list?ids=${ids}`, {
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
