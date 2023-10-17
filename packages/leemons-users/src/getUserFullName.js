function getUserFullName({ userSession }) {
  return `${userSession.name ? userSession.name : ''}${
    userSession.surnames ? ` ${userSession.surnames}` : ''
  }${userSession.secondSurname ? ` ${userSession.secondSurname}` : ''}`;
}

module.exports = { getUserFullName };
