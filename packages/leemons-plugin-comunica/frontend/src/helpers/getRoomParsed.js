import _ from 'lodash';
import isTeacherByRoom from '@comunica/helpers/isTeacherByRoom';
import getChatUserAgent from '@comunica/helpers/getChatUserAgent';

export function getRoomParsed(room) {
  const isTeacher = isTeacherByRoom(room);

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
  if (room.type === 'chat') {
    const userAgentData = getChatUserAgent(room.userAgents);
    config.name = `${userAgentData.userAgent.user.name}${
      userAgentData.userAgent.user.surnames ? ` ${userAgentData.userAgent.user.surnames}` : ''
    }`;
    config.image = userAgentData.userAgent.user.avatar;
    config.imageIsUrl = true;
    config.subName = userAgentData.userAgent.profile.name;
  }
  return config;
}

export default getRoomParsed;
