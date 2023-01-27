import _ from 'lodash';
import { getCentersWithToken } from '@users/session';

export function getChatUserAgent(userAgents) {
  const agentId = getCentersWithToken()[0].userAgentId;
  return _.find(userAgents, (item) => item.userAgent.id !== agentId);
}

export default getChatUserAgent;
