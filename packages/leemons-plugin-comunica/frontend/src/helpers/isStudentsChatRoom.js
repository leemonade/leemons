
export function isStudentsChatRoom(room) {
  if (room?.type === 'chat') {
    const isStudentsChat =
      room.userAgents[0].userAgent.profile.sysName === 'student' &&
      room.userAgents[1].userAgent.profile.sysName === 'student';
    return !isStudentsChat;
  }
  return false;
}

export default isStudentsChatRoom;
