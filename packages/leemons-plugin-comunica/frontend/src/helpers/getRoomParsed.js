import _ from 'lodash';
import isTeacherByRoom from '@comunica/helpers/isTeacherByRoom';
import getChatUserAgent from '@comunica/helpers/getChatUserAgent';
import { getCentersWithToken } from '@users/session';

function getName(userAgent) {
  return `${userAgent.user.name}${userAgent.user.surnames ? ` ${userAgent.user.surnames}` : ''}`;
}

export function getRoomParsed(room) {
  const isTeacher = isTeacherByRoom(room);

  const config = {
    ...room,
  };
  if (isTeacher && room.type === 'plugins.assignables.assignation.user') {
    const student = _.find(
      _.map(room.userAgents, 'userAgent'),
      (userAgent) => userAgent?.profile?.sysName === 'student'
    );
    config.name = getName(student);
    config.image = student.user.avatar;
    config.imageIsUrl = true;
  }
  if (room.type === 'chat') {
    const userAgentData = getChatUserAgent(room.userAgents);
    config.name = getName(userAgentData.userAgent);
    config.image = userAgentData.userAgent.user.avatar;
    config.imageIsUrl = true;
    config.subName = userAgentData.userAgent?.profile?.name;
  }
  if (room.type === 'group') {
    const agentId = getCentersWithToken()[0].userAgentId;
    const userAgents = _.filter(
      room.userAgents,
      (item) => item.userAgent.id !== agentId && !item.deleted
    );
    config.subName = '';
    _.forEach(userAgents, (item, index) => {
      config.subName += `${index > 0 ? ', ' : ''}${getName(item.userAgent)}`;
    });
  }
  return config;
}

export default getRoomParsed;
