import Router from 'next/router';

export function goBasePage(returnUrl) {
  const uri = '/users';
  return returnUrl ? uri : Router.push(uri);
}

export function goLoginPage(returnUrl) {
  const uri = '/users/public/login';
  return returnUrl ? uri : Router.push(uri);
}

export function goResetPage(returnUrl) {
  const uri = '/users/public/reset';
  return returnUrl ? uri : Router.push(uri);
}

export function goRecoverPage(returnUrl) {
  const uri = '/users/public/recover';
  return returnUrl ? uri : Router.push(uri);
}

export function goRegisterPage(returnUrl) {
  const uri = '/users/public/register';
  return returnUrl ? uri : Router.push(uri);
}

export function goSelectProfilePage(returnUrl) {
  const uri = '/users/private/select-profile';
  return returnUrl ? uri : Router.push(uri);
}

export function goListUsersPage(returnUrl) {
  const uri = '/users/private/users/list';
  return returnUrl ? uri : Router.push(uri);
}

export function goDetailUserPage(returnUrl) {
  const uri = '/users/private/users/detail';
  return returnUrl ? '/users' : Router.push('');
}

export function goListProfilesPage(returnUrl) {
  const uri = '/users/private/profiles/list';
  return returnUrl ? uri : Router.push(uri);
}

export function goDetailProfilePage(uri, returnUrl) {
  if (uri)
    return returnUrl
      ? `/users/private/profiles/detail/${uri}`
      : Router.push(`/users/private/profiles/detail/${uri}`);
  return returnUrl
    ? '/users/private/profiles/detail'
    : Router.push('/users/private/profiles/detail');
}
