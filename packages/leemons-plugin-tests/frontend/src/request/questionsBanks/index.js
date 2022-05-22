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
  console.log(body);
  forEach(body.questions || [], (question, index) => {
    if (question.questionImage && !isString(question.questionImage)) {
      if (question.questionImage.id) {
        // eslint-disable-next-line no-param-reassign
        body.questions[index].questionImage = question.questionImage.cover.id;
      } else {
        questionsFiles.push({ index, name: 'questionImage', file: question.questionImage });
      }
    }
    if (question.properties.image && !isString(question.properties.image)) {
      if (question.properties.image.id) {
        // eslint-disable-next-line no-param-reassign
        body.questions[index].properties.image = question.properties.image.cover.id;
      } else {
        questionsFiles.push({ index, name: 'properties.image', file: question.properties.image });
      }
    }
    if (question.properties.responses) {
      forEach(question.properties.responses, (response, i) => {
        if (response.value.image) {
          if (response.value.image.id) {
            // eslint-disable-next-line no-param-reassign
            body.questions[index].properties.responses[i].value.image =
              response.value.image.cover.id;
          } else {
            questionsFiles.push({
              index,
              name: `properties.responses[${i}].value.image`,
              file: response.value.image,
            });
          }
        }
      });
    }
  });
  if ((body.cover && !isString(body.cover)) || questionsFiles.length) {
    const { cover, ...data } = body;
    if (body.cover) {
      if (body.cover.cover) {
        data.cover = body.cover.cover?.id;
      } else if (body.cover.id) {
        data.cover = body.cover.id;
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

async function deleteQuestionBank(id) {
  return leemons.api(`tests/question-bank/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export { listQuestionsBanks, saveQuestionBank, getQuestionBank, deleteQuestionBank };
