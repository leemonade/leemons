import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import { isString } from 'lodash';

async function listSubjects({ page, size, program, course }) {
  const params = new URLSearchParams({
    page,
    size,
    program,
  });

  if (course !== undefined) {
    params.append('course', course);
  }

  return leemons.api(`v1/academic-portfolio/subjects/subject?${params.toString()}`, {
    waitToFinish: true,
    allAgents: true,
    method: 'GET',
  });
}

async function createSubject(body) {
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
  return leemons.api('v1/academic-portfolio/subjects/subject', {
    allAgents: true,
    method: 'POST',
    body: toSend,
  });
}

async function updateSubject(body) {
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
  return leemons.api('v1/academic-portfolio/subjects/subject', {
    allAgents: true,
    method: 'PUT',
    body: toSend,
  });
}

async function updateSubjectCredits(body) {
  return leemons.api('v1/academic-portfolio/subjects/credits', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

async function removeSubject(id) {
  return leemons.api(`v1/academic-portfolio/subjects/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

async function getSubjectCredits({ program, subject }) {
  return leemons.api(
    `v1/academic-portfolio/subjects/credits?program=${program}&subject=${subject}`,
    {
      allAgents: true,
      method: 'GET',
    }
  );
}

async function getSubjectsCredits(subjects) {
  const subjectsObj = subjects.map((subject) => ({
    subject: subject.subject,
    program: subject.program,
  }));

  return leemons.api(
    `v1/academic-portfolio/subjects/credits?subjects=${JSON.stringify(subjectsObj)}`,
    {
      allAgents: true,
      method: 'GET',
    }
  );
}

async function listSubjectCreditsForProgram(program) {
  return leemons.api(`v1/academic-portfolio/subjects/credits/list?program=${program}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function getSubjectDetails(subject, withClasses = false) {
  const isSubjectArray = Array.isArray(subject);
  const subjectParam = isSubjectArray ? `ids=${JSON.stringify(subject)}` : `id=${subject}`;
  const classParam = withClasses ? '&withClasses=true' : '';
  const endpoint = `v1/academic-portfolio/subjects?${subjectParam}${classParam}`;

  return leemons.api(endpoint, {
    allAgents: true,
    method: 'GET',
  });
}

export {
  listSubjects,
  createSubject,
  updateSubject,
  updateSubjectCredits,
  getSubjectCredits,
  getSubjectsCredits,
  listSubjectCreditsForProgram,
  getSubjectDetails,
  removeSubject,
};
