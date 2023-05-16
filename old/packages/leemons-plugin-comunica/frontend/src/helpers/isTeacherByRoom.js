import _ from 'lodash';
import { getCentersWithToken } from '@users/session';

export function isTeacherByRoom(room) {
  const { userAgentId } = getCentersWithToken()[0];
  const _userAgent = _.find(_.map(room.userAgents, 'userAgent'), { id: userAgentId });
  return _userAgent?.profile.sysName === 'teacher';
}

export default isTeacherByRoom;
