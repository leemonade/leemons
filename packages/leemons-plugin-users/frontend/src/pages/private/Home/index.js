import React from 'react';
import constants from '@users/constants';
import { logoutSession } from '@users/session';
import { goSelectProfilePage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import { useHistory } from 'react-router-dom';

function Home() {
  const history = useHistory();

  const logout = () => {
    logoutSession(history, `/${constants.base}`);
  };

  return (
    <div>
      <button
        className="absolute right-20 top-2 px-2 border border-gray-500 rounded"
        onClick={() => goSelectProfilePage(history)}
      >
        Cambiar perfil
      </button>

      <button
        className="absolute right-2 top-2 px-2 border border-gray-500 rounded"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
