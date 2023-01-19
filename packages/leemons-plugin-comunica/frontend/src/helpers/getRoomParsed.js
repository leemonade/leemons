import _ from 'lodash';
import { getCentersWithToken } from '@users/session';

export function getRoomParsed(room) {
  const { userAgentId } = getCentersWithToken()[0];
  const _userAgent = _.find(_.map(room.userAgents, 'userAgent'), { id: userAgentId });
  const isTeacher = _userAgent.profile.sysName === 'teacher';

  const config = {
    ...room,
  };
  if (isTeacher && room.type === 'plugins.assignables.assignation.user') {
    const student = _.find(
      _.map(room.userAgents, 'userAgent'),
      (userAgent) => userAgent.profile.sysName === 'student'
    );
    config.name = `${student.user.name}${student.user.surnames ? ` ${student.user.surnames}` : ''}`;
    config.image = student.user.avatar;
    config.imageIsUrl = true;
  }
  return config;
}

export default getRoomParsed;
