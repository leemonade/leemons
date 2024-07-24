import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import { cloneDeep, forEach, isString, merge, set } from 'lodash';

async function listQuestionsBanks(body) {
  return leemons.api(`v1/tests/questionsBanks/list`, {
    allAgents: true,
    method: 'POST',
    body,
  });
}

async function saveQuestionBank(_body) {
  const body = cloneDeep(_body);
  let form = {};
  const questionFiles = [];

  forEach(_body.questions || [], (question, index) => {
    // ? Esto ya no pasa, así sea nuevo es una ID
    // if (question.questionImage && !isString(question.questionImage)) {
    //   if (question.questionImage.id) {
    //     // eslint-disable-next-line no-param-reassign
    //     if (question.questionImage.cover)
    //       body.questions[index].questionImage = question.questionImage.cover.id;
    //   } else {
    //     questionFiles.push({ index, name: 'questionImage', file: question.questionImage });
    //   }
    // }
    // ? Esta es la imagen del mapa. Esto ya no pasa, así sea nuevo es una ID
    // if (question.properties.image && !isString(question.properties.image)) {
    //   if (question.properties.image.id) {
    //     // eslint-disable-next-line no-param-reassign
    //     if (question.properties.image.cover)
    //       body.questions[index].properties.image = question.properties.image.cover.id;
    //   } else {
    //     questionFiles.push({ index, name: 'properties.image', file: question.properties.image });
    //   }
    // }
    // ? Estas son respuestas de imagen. Esto ya no pasa, así sea nuevo es una ID
    // if (question.properties.responses) {
    //   forEach(question.properties.responses, (response, i) => {
    //     if (response.value.image && !isString(response.value.image)) {
    //       if (response.value.image.id) {
    //         // eslint-disable-next-line no-param-reassign
    //         if (response.value.image.cover)
    //           body.questions[index].properties.responses[i].value.image =
    //             response.value.image.cover.id;
    //       } else {
    //         questionFiles.push({
    //           index,
    //           name: `properties.responses[${i}].value.image`,
    //           file: response.value.image,
    //         });
    //       }
    //     }
    //   });
    // }
  });

  if ((_body.cover && !isString(_body.cover)) || questionFiles.length) {
    const { cover, ...data } = body;
    // ? Esto ya no pasa, así sea nuevo es una ID
    // if (_body.cover) {
    //   if (_body.cover.cover) {
    //     data.cover = _body.cover.cover?.id;
    //   } else if (_body.cover.id) {
    //     data.cover = _body.cover.id;
    //   } else {
    //     form.cover = await uploadFileAsMultipart(_body.cover, { name: _body.cover.name });
    //   }
    // }

    // ? En ninguna parte estamos procesando files para las preguntas
    // const uploadQuestionsFilesPromises = questionFiles.map(({ index, name, file }) =>
    //   uploadFileAsMultipart(file, { name: file.name }).then((uploadedFile) => {
    //     set(form, `questions[${index}].${name}`, uploadedFile);
    //   })
    // );
    // await Promise.all(uploadQuestionsFilesPromises);
    // form = merge(data, form);
  } else {
    form = merge(body, form);
  }

  return leemons.api('v1/tests/questionsBanks', {
    allAgents: true,
    method: 'POST',
    body: form,
  });
}

async function getQuestionBank(id) {
  return leemons.api(`v1/tests/questionsBanks/${id}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function deleteQuestionBank(id) {
  return leemons.api(`v1/tests/questionsBanks/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export { listQuestionsBanks, saveQuestionBank, getQuestionBank, deleteQuestionBank };
