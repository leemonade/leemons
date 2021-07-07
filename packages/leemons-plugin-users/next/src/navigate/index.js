import Router from 'next/router';

export function goBasePage() {
  return Router.push('/users');
}

export function goLoginPage() {
  return Router.push('/users/public/login');
}

export function goResetPage() {
  return Router.push('/users/public/reset');
}

export function goRecoverPage() {
  return Router.push('/users/public/recover');
}

export function goRegisterPage() {
  return Router.push('/users/public/register');
}

export function goSelectProfilePage() {
  return Router.push('/users/private/select-profile');
}

export function goListUsersPage() {
  return Router.push('/users/private/users/list');
}

export function goDetailUserPage() {
  return Router.push('/users/private/users/detail');
}

export function goListProfilesPage() {
  return Router.push('/users/private/profiles/list');
}

export function goDetailProfilePage(uri) {
  if (uri) return Router.push(`/users/private/profiles/detail/${uri}`);
  return Router.push('/users/private/profiles/detail');
}
