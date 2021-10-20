import React from 'react';
import constants from '@users/constants';
import { logoutSession, useSession } from '@users/session';
import { goLoginPage, goSelectProfilePage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import { useHistory } from 'react-router-dom';

function Home() {
  useSession({ redirectTo: goLoginPage });

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

export default withLayout(Home);
