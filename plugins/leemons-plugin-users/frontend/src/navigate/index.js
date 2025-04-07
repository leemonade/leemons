export function goBasePage(navigate, returnUrl) {
  const uri = "/users";
  return returnUrl === true ? uri : navigate(uri);
}

export function goLoginPage(navigate, returnUrl) {
  const uri = "/users/login";
  return returnUrl === true ? uri : navigate(uri);
}

export function goResetPage(navigate, returnUrl) {
  const uri = "/users/reset";
  return returnUrl === true ? uri : navigate(uri);
}

export function goRecoverPage(navigate, returnUrl) {
  const uri = "/users/recover";
  return returnUrl === true ? uri : navigate(uri);
}

export function goRegisterPage(navigate, returnUrl) {
  const uri = "/users/register";
  return returnUrl === true ? uri : navigate(uri);
}

export function goSelectProfilePage(navigate, returnUrl) {
  const uri = "/protected/users/select-profile";
  return returnUrl === true ? uri : navigate(uri);
}

export function goListUsersPage(navigate, returnUrl) {
  const uri = "/private/users/list";
  return returnUrl === true ? uri : navigate(uri);
}

export function goDetailUserPage(navigate, returnUrl) {
  const uri = "/private/users/detail";
  return returnUrl === true ? "/users" : navigate("");
}

export function goListProfilesPage(navigate, returnUrl) {
  const uri = "/private/users/profiles/list";
  return returnUrl === true ? uri : navigate(uri);
}

export function goDetailProfilePage(navigate, uri, returnUrl) {
  if (uri) {
    return returnUrl === true
      ? `/private/users/profiles/detail/${uri}`
      : navigate(`/private/users/profiles/detail/${uri}`);
  }

  return returnUrl === true
    ? "/private/users/profiles/detail"
    : navigate("/private/users/profiles/detail");
}
