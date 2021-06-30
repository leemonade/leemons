import Cookies from 'js-cookie';
import Router from 'next/router';

export default function Logout() {
  Cookies.remove('token');
  const urlParams = new URLSearchParams(window.location.search);
  let redirect = urlParams.get('redirectTo');
  if (!redirect) redirect = '/';
  Router.push(`/${decodeURIComponent(redirect)}`);
  return '<></>';
}
