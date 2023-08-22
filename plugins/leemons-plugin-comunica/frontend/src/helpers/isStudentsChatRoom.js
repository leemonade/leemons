export function isStudentsChatRoom(room) {
  if (room?.type === 'chat') {
    return (
      room.userAgents[0].userAgent.profile.sysName === 'student' &&
      room.userAgents[1].userAgent.profile.sysName === 'student'
    );
  }
  return false;
}

export default isStudentsChatRoom;
