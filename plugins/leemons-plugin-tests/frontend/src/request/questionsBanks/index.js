import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import { cloneDeep, forEach, isString, set, merge } from 'lodash';

async function listQuestionsBanks(body) {
  return leemons.api(`tests/question-bank/list`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function saveQuestionBank(_body) {
  const body = cloneDeep(_body);
  let form = {};
  const questionsFiles = [];

  forEach(_body.questions || [], (question, index) => {
    if (question.questionImage && !isString(question.questionImage)) {
      if (question.questionImage.id) {
        // eslint-disable-next-line no-param-reassign
        if (question.questionImage.cover)
          body.questions[index].questionImage = question.questionImage.cover.id;
      } else {
        questionsFiles.push({ index, name: 'questionImage', file: question.questionImage });
      }
    }
    if (question.properties.image && !isString(question.properties.image)) {
      if (question.properties.image.id) {
        // eslint-disable-next-line no-param-reassign
        if (question.properties.image.cover)
          body.questions[index].properties.image = question.properties.image.cover.id;
      } else {
        questionsFiles.push({ index, name: 'properties.image', file: question.properties.image });
      }
    }
    if (question.properties.responses) {
      forEach(question.properties.responses, (response, i) => {
        if (response.value.image && !isString(response.value.image)) {
          if (response.value.image.id) {
            // eslint-disable-next-line no-param-reassign
            if (response.value.image.cover)
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
  if ((_body.cover && !isString(_body.cover)) || questionsFiles.length) {
    const { cover, ...data } = body;
    if (_body.cover) {
      if (_body.cover.cover) {
        data.cover = _body.cover.cover?.id;
      } else if (_body.cover.id) {
        data.cover = _body.cover.id;
      } else {
        form.cover = await uploadFileAsMultipart(_body.cover, { name: _body.cover.name });
      }
    }
    const uploadQuestionsFilesPromises = questionsFiles.map(({ index, name, file }) =>
      uploadFileAsMultipart(file, { name: file.name }).then((uploadedFile) => {
        set(form, `questions[${index}].${name}`, uploadedFile);
      })
    );
    await Promise.all(uploadQuestionsFilesPromises);
    form = merge(data, form);
  } else {
    form = merge(body, form);
  }

  return leemons.api('tests/question-bank', {
    allAgents: true,
    method: 'POST',
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
