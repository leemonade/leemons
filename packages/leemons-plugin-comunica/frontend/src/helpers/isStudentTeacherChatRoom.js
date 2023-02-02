export function isStudentTeacherChatRoom(room) {
  if (room?.type === 'chat') {
    const isStudentTeacherChat =
      (room.userAgents[0].userAgent.profile.sysName === 'student' &&
        room.userAgents[1].userAgent.profile.sysName === 'teacher') ||
      (room.userAgents[1].userAgent.profile.sysName === 'student' &&
        room.userAgents[0].userAgent.profile.sysName === 'teacher');
    return !isStudentTeacherChat;
  }
  return false;
}

export default isStudentTeacherChatRoom;
