import { getAuthorizationTokenForAllCenters } from '@users/session';
import * as _ from 'lodash';

async function listAllMyFiles() {
  const response = await leemons.api('leebrary/files/my', {
    allAgents: true,
  });
  response.files = _.map(response.files, (file) => ({
    ...file,
    localUrl: `${leemons.apiUrl}/api/leebrary/file/${
      file.id
    }?authorization=${getAuthorizationTokenForAllCenters()}`,
  }));
  return response;
}

export default listAllMyFiles;
