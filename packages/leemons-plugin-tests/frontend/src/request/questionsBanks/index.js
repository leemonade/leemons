import { forEach, isString } from 'lodash';

async function listQuestionsBanks(body) {
  return leemons.api(`tests/question-bank/list`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function saveQuestionBank(body) {
  const form = new FormData();
  const questionsFiles = [];
  forEach(body.questions || [], (question, index) => {
    if (question.properties.image && !isString(question.properties.image)) {
      if (question.properties.image.id) {
        // eslint-disable-next-line no-param-reassign
        body.questions[index].properties.image = question.properties.image.cover.id;
      } else {
        questionsFiles.push({ index, name: 'properties.image', file: question.properties.image });
      }
    }
  });
  if ((body.cover && !isString(body.cover)) || questionsFiles.length) {
    const { cover, ...data } = body;
    if (body.cover) {
      if (body.cover.id) {
        data.cover = body.cover.cover?.id;
      } else {
        form.append('cover', body.cover, body.cover.name);
      }
    }
    forEach(questionsFiles, ({ index, name, file }) => {
      form.append(`questions[${index}].${name}`, file, file.name);
    });
    form.append('data', JSON.stringify(data));
  } else {
    form.append('data', JSON.stringify(body));
  }

  return leemons.api('tests/question-bank', {
    allAgents: true,
    method: 'POST',
    headers: {
      'content-type': 'none',
    },
    body: form,
  });
}

async function getQuestionBank(id) {
  return leemons.api(`tests/question-bank/${id}`, {
    allAgents: true,
    method: 'GET',
  });
}

export { listQuestionsBanks, saveQuestionBank, getQuestionBank };
