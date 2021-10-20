export function goBasePage(history, returnUrl) {
  const uri = '/users';
  return returnUrl === true ? uri : history.push(uri);
}

export function goLoginPage(history, returnUrl) {
  const uri = '/users/public/login';
  return returnUrl === true ? uri : history.push(uri);
}

export function goResetPage(history, returnUrl) {
  const uri = '/users/public/reset';
  return returnUrl === true ? uri : history.push(uri);
}

export function goRecoverPage(history, returnUrl) {
  const uri = '/users/public/recover';
  return returnUrl === true ? uri : history.push(uri);
}

export function goRegisterPage(history, returnUrl) {
  const uri = '/users/public/register';
  return returnUrl === true ? uri : history.push(uri);
}

export function goSelectProfilePage(history, returnUrl) {
  const uri = '/users/private/select-profile';
  return returnUrl === true ? uri : history.push(uri);
}

export function goListUsersPage(history, returnUrl) {
  const uri = '/users/private/users/list';
  return returnUrl === true ? uri : history.push(uri);
}

export function goDetailUserPage(history, returnUrl) {
  const uri = '/users/private/users/detail';
  return returnUrl === true ? '/users' : history.push('');
}

export function goListProfilesPage(history, returnUrl) {
  const uri = '/users/private/profiles/list';
  return returnUrl === true ? uri : history.push(uri);
}

export function goDetailProfilePage(history, uri, returnUrl) {
  if (uri)
    return returnUrl === true
      ? `/users/private/profiles/detail/${uri}`
      : history.push(`/users/private/profiles/detail/${uri}`);
  return returnUrl === true
    ? '/users/private/profiles/detail'
    : history.push('/users/private/profiles/detail');
}
