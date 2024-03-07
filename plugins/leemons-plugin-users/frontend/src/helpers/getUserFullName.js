export default function getUserFullName(user) {
  return `${user.name ? user.name : ''}${user.surnames ? ` ${user.surnames}` : ''}${
    user.secondSurname ? ` ${user.secondSurname}` : ''
  }`;
}
