import React from 'react';
import { useHistory } from 'react-router-dom';
import constants from '@users/constants';
import hooks from 'leemons-hooks';
import Cookies from 'js-cookie';

export default function Logout() {
  const history = useHistory();

  Cookies.remove('token');
  history.push(`/${constants.base}`);
  hooks.fireEvent('user:cookie:session:change');

  return null;
}
