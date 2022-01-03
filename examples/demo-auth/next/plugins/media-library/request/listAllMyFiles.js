import * as _ from 'lodash';
import { getAuthorizationTokenForAllCenters } from '@users/session';

async function listAllMyFiles() {
  const response = await leemons.api('media-library/files/my', {
    allAgents: true,
  });
  response.files = _.map(response.files, (file) => ({
    ...file,
    localUrl: `${window.location.origin}/api/media-library/file/${
      file.id
    }?authorization=${getAuthorizationTokenForAllCenters()}`,
  }));
  return response;
}

export default listAllMyFiles;
