export function isStudentTeacherChatRoom(room) {
  if (room?.type === 'chat') {
    return (
      (room.userAgents[0].userAgent.profile.sysName === 'student' &&
        room.userAgents[1].userAgent.profile.sysName === 'teacher') ||
      (room.userAgents[1].userAgent.profile.sysName === 'student' &&
        room.userAgents[0].userAgent.profile.sysName === 'teacher')
    );
  }
  return false;
}

export default isStudentTeacherChatRoom;
