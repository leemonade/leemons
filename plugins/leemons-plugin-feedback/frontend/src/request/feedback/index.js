import { cloneDeep, forEach, isString } from 'lodash';

async function saveFeedback(_body) {
  const body = cloneDeep(_body);
  const form = new FormData();
  const questionsFiles = [];
  forEach(_body.questions || [], (question, index) => {
    if (question.properties.responses) {
      forEach(question.properties.responses, (response, i) => {
        if (response.value.image && !isString(response.value.image)) {
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

  if (
    (_body.featuredImage && !isString(_body.featuredImage)) ||
    (_body.cover && !isString(_body.cover)) ||
    questionsFiles.length
  ) {
    const { cover, featuredImage, ...data } = body;
    if (_body.cover) {
      if (isString(_body.cover)) {
        data.cover = _body.cover;
      } else if (_body.cover.cover) {
        data.cover = _body.cover.cover?.id;
      } else if (_body.cover.id) {
        data.cover = _body.cover.id;
      } else {
        form.append('cover', _body.cover, _body.cover.name);
      }
    }
    if (_body.featuredImage) {
      if (isString(_body.featuredImage)) {
        data.featuredImage = _body.featuredImage;
      } else if (_body.featuredImage.cover) {
        data.featuredImage = _body.featuredImage.cover?.id;
      } else if (_body.featuredImage.id) {
        data.featuredImage = _body.featuredImage.id;
      } else {
        form.append('featuredImage', _body.featuredImage, _body.featuredImage.name);
      }
    }
    forEach(questionsFiles, ({ index, name, file }) => {
      form.append(`questions[${index}].${name}`, file, file.name);
    });
    form.append('data', JSON.stringify(data));
  } else {
    form.append('data', JSON.stringify(body));
  }

  return leemons.api('feedback/feedback', {
    allAgents: true,
    method: 'POST',
    headers: {
      'content-type': 'none',
    },
    body: form,
  });
}

async function getFeedback(id) {
  return leemons.api(`feedback/feedback/${id}`, {
    allAgents: true,
    method: 'GET',
  });
}

async function deleteFeedback(id) {
  return leemons.api(`feedback/feedback/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

async function duplicateFeedback(id, published) {
  return leemons.api(`feedback/feedback/duplicate`, {
    allAgents: true,
    method: 'POST',
    body: {
      id,
      published,
    },
  });
}

async function assignFeedback(id, data) {
  return leemons.api(`feedback/feedback/assign`, {
    allAgents: true,
    method: 'POST',
    body: {
      id,
      data,
    },
  });
}

async function setQuestionResponse(questionId, instanceId, value) {
  return leemons.api(`feedback/feedback/instance/question/response`, {
    allAgents: true,
    method: 'POST',
    body: {
      questionId,
      instanceId,
      value,
    },
  });
}

async function setInstanceTimestamp(instance, timeKey, user) {
  return leemons.api(`feedback/feedback/instance/timestamp`, {
    allAgents: true,
    method: 'POST',
    body: {
      instance,
      timeKey,
      user,
    },
  });
}

async function getUserAssignableResponses(instanceId) {
  const { responses } = await leemons.api(`feedback/feedback/instance/responses/${instanceId}`, {
    allAgents: true,
    method: 'GET',
  });
  return responses;
}

async function getFeedbackResults(id) {
  const { results } = await leemons.api(`feedback/feedback/results/${id}`, {
    allAgents: true,
    method: 'GET',
  });
  return results;
}

async function getFeedbackResultsWithTime(id) {
  const { results } = await leemons.api(`feedback/feedback/results/time/${id}`, {
    allAgents: true,
    method: 'GET',
  });
  return results;
}

export {
  duplicateFeedback,
  deleteFeedback,
  saveFeedback,
  getFeedback,
  assignFeedback,
  setQuestionResponse,
  setInstanceTimestamp,
  getUserAssignableResponses,
  getFeedbackResults,
  getFeedbackResultsWithTime,
};
