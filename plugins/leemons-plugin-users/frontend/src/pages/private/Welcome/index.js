import React, { useEffect } from 'react';

import { getUserProfilesRequest } from '@users/request';
import useTranslate from '@multilanguage/useTranslate';
import tLoader from '@multilanguage/helpers/tLoader';

import prefixPN from '@users/helpers/prefixPN';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
function Welcome() {
  const [translations] = useTranslate({ keysStartsWith: prefixPN('welcome_page') });
  const t = tLoader(prefixPN('welcome_page'), translations);

  async function getProfiles() {
    try {
      const { profiles } = await getUserProfilesRequest();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getProfiles();
  }, []);

  return (
    <>
      {t('page_title')}
      <br />
      {t('page_description')}
    </>
  );
}

export default Welcome;
