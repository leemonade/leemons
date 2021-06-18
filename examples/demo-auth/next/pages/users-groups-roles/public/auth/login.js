import Router from 'next/router';
import Cookies from 'js-cookie';

export default function Login() {
  const urlParams = new URLSearchParams(window.location.search);
  Cookies.set('token', urlParams.get('token'));
  let redirect = urlParams.get('redirectTo');
  if (!redirect) redirect = '/';
  Router.push(`/${decodeURIComponent(redirect)}`);
  return '<></>';
}
