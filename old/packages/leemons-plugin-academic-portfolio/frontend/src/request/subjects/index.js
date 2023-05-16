import { isString } from 'lodash';

async function listSubjects({ page, size, program, course }) {
  return leemons.api(
    `academic-portfolio/subject?page=${page}&size=${size}&program=${program}&course=${course}`,
    {
      waitToFinish: true,
      allAgents: true,
      method: 'GET',
    }
  );
}

async function createSubject(body) {
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
  return leemons.api('academic-portfolio/subject', {
    allAgents: true,
    method: 'POST',
    headers: {
      'content-type': 'none',
    },
    body: form,
  });
}

async function updateSubject(body) {
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
  return leemons.api('academic-portfolio/subject', {
    allAgents: true,
    method: 'PUT',
    headers: {
      'content-type': 'none',
    },
    body: form,
  });
}

async function updateSubjectCredits(body) {
  return leemons.api('academic-portfolio/subject/credits', {
    allAgents: true,
    method: 'PUT',
    body,
  });
}

async function removeSubject(id) {
  return leemons.api(`academic-portfolio/subject/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

async function getSubjectCredits({ program, subject }) {
  return leemons.api(`academic-portfolio/subject/credits?program=${program}&subject=${subject}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function getSubjectsCredits(subjects) {
  const subjectsObj = subjects.map((subject) => ({
    subject: subject.subject,
    program: subject.program,
  }));

  return leemons.api(`academic-portfolio/subject/credits?subjects=${JSON.stringify(subjectsObj)}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function listSubjectCreditsForProgram(program) {
  return leemons.api(`academic-portfolio/subject/credits/list?program=${program}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function getSubjectDetails(subject) {
  if (Array.isArray(subject)) {
    return leemons.api(`academic-portfolio/subjects?ids=${JSON.stringify(subject)}`, {
      allAgents: true,
      method: 'GET',
    });
  }
  return leemons.api(`academic-portfolio/subject/${subject}`, {
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
