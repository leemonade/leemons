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

async function classDetailForDashboard(classId, teacherType) {
  const queryParams = new URLSearchParams();
  if (teacherType !== undefined) {
    queryParams.append('teacherType', teacherType);
  }

  return leemons.api(
    `v1/academic-portfolio/classes/dashboard/${classId}?${queryParams.toString()}`,
    {
      allAgents: true,
      method: 'GET',
    }
  );
}

async function classByIds(classIds) {
  const ids = JSON.stringify(Array.isArray(classIds) ? classIds : [classIds]);

  return leemons.api(`v1/academic-portfolio/classes/raw-list?ids=${ids}`, {
    allAgents: true,
    method: 'GET',
  });
}

/**
 * Retrieves user enrollments, including programs with detailed subjects and classes.
 * For each class, it adds information about the user's enrollment type (student or teacher)
 * and, if a contact user agent ID is provided, the enrollment type of the contact in shared classes.
 *
 * @param {Object} params - The parameters for fetching user enrollments.
 * @param {string[]} params.userAgentIds - The user agent IDs for which to fetch enrollments (they must belong to the same user).
 * @param {string} params.centerId - The center ID to filter the programs by.
 * @param {string} [params.contactUserAgentId=''] - Optional. The contact user agent ID to find shared class enrollments.
 * @returns {Promise<Object[]>} A promise that resolves to an array of program objects. Each program object includes
 *                              detailed subjects, and each subject includes detailed classes. Classes contain additional
 *                              properties `enrollmentType` to indicate the user's relation to the class (student or teacher)
 *                              and `sharedWithContactWhereContactIs` (if applicable) to indicate the contact's enrollment type
 *                              in shared classes.
 */
async function userEnrollments({ centerId, userAgentIds, contactUserAgentId }) {
  return leemons.api('v1/academic-portfolio/classes/user-enrollments', {
    allAgents: true,
    method: 'POST',
    body: { centerId, userAgentIds, contactUserAgentId },
  });
}

async function classPublicData(classId) {
  return leemons.api(`v1/academic-portfolio/classes/${classId}/public-data`, {
    allAgents: true,
    method: 'GET',
  });
}

async function classPublicDataMany(classIds) {
  return leemons.api(`v1/academic-portfolio/classes/public-data`, {
    allAgents: true,
    method: 'POST',
    body: { ids: classIds },
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
  userEnrollments,
  classPublicData,
  classPublicDataMany,
};
