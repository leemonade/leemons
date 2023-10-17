export function goBasePage(history, returnUrl) {
  const uri = '/users';
  return returnUrl === true ? uri : history.push(uri);
}

export function goLoginPage(history, returnUrl) {
  const uri = '/users/login';
  return returnUrl === true ? uri : history.push(uri);
}

export function goResetPage(history, returnUrl) {
  const uri = '/users/reset';
  return returnUrl === true ? uri : history.push(uri);
}

export function goRecoverPage(history, returnUrl) {
  const uri = '/users/recover';
  return returnUrl === true ? uri : history.push(uri);
}

export function goRegisterPage(history, returnUrl) {
  const uri = '/users/register';
  return returnUrl === true ? uri : history.push(uri);
}

export function goSelectProfilePage(history, returnUrl) {
  const uri = '/private/users/select-profile';
  return returnUrl === true ? uri : history.push(uri);
}

export function goListUsersPage(history, returnUrl) {
  const uri = '/private/users/list';
  return returnUrl === true ? uri : history.push(uri);
}

export function goDetailUserPage(history, returnUrl) {
  const uri = '/private/users/detail';
  return returnUrl === true ? '/users' : history.push('');
}

export function goListProfilesPage(history, returnUrl) {
  const uri = '/private/users/profiles/list';
  return returnUrl === true ? uri : history.push(uri);
}

export function goDetailProfilePage(history, uri, returnUrl) {
  if (uri)
    return returnUrl === true
      ? `/private/users/profiles/detail/${uri}`
      : history.push(`/private/users/profiles/detail/${uri}`);
  return returnUrl === true
    ? '/private/users/profiles/detail'
    : history.push('/private/users/profiles/detail');
}
