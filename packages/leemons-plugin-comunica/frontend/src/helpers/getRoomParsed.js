import _ from 'lodash';
import isTeacherByRoom from '@comunica/helpers/isTeacherByRoom';

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
  return config;
}

export default getRoomParsed;
