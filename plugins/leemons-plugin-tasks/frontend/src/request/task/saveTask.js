import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import _ from 'lodash';

const pluginPath = 'tasks';

export default async function saveTaskRequest(taskId, task) {
  // EN: If task is not provided, it means that we are creating a new task.
  // ES: Si la tarea no se proporciona, significa que estamos creando una nueva tarea.
  const formData = {};
  const assetCoverPropertyName = 'asset.cover';

  const cover = task?.asset?.cover;
  const taskData = _.omit(task, [assetCoverPropertyName]);
  formData.task = JSON.stringify(taskData);

  if (cover instanceof File) {
    formData[assetCoverPropertyName] = await uploadFileAsMultipart(cover, { name: cover.name });
  } else if (_.isString(cover) || _.isNull(cover)) {
    formData[assetCoverPropertyName] = cover;
  }

  if (!taskId) {
    // EN: Create a new task
    // ES: Crear una nueva tarea
    return leemons.api(`v1/${pluginPath}/tasks`, {
      allAgents: true,
      method: 'POST',
      body: formData,
    });
  }

  // EN: Update an existing task
  // ES: Actualizar una tarea existente
  return leemons.api(`v1/${pluginPath}/tasks/${taskId}`, {
    allAgents: true,
    method: 'PUT',
    body: formData,
  });
}
