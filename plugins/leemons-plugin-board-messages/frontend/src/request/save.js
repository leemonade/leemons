import uploadFileAsMultipart from '@leebrary/helpers/uploadFileAsMultipart';
import isString from 'lodash/isString';

async function save(body) {
  const form = {};
  if (body.asset && !isString(body.asset)) {
    const { asset, ...data } = body;
    if (body.asset) {
      if (body.asset.id) {
        data.asset = body.asset.cover?.id;
      } else {
        form.asset = await uploadFileAsMultipart(body.asset, { name: body.asset.name });
      }
    }
    form.data = JSON.stringify(data);
  } else {
    form.data = JSON.stringify(body);
  }
  return leemons.api(`v1/board-messages/messages/save`, {
    allAgents: true,
    method: 'POST',
    body: form,
  });
}

export default save;
