import React, { useEffect } from 'react';
import { useSession } from '@users/session';
import { getUserProfilesRequest } from '@users/request';
import useTranslate from '@multilanguage/useTranslate';
import tLoader from '@multilanguage/helpers/tLoader';
import { goLoginPage } from '@users/navigate';
import prefixPN from '@users/helpers/prefixPN';
import { withLayout } from '@layout/hoc';
import { PageContainer, PageHeader } from 'leemons-ui';
import { SocketIoService } from '@socket-io/service';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
function Welcome() {
  useSession({ redirectTo: goLoginPage });

  const [translations] = useTranslate({ keysStartsWith: prefixPN('welcome_page') });
  const t = tLoader(prefixPN('welcome_page'), translations);

  SocketIoService.useOn('gatitos', (event, args) => {
    console.log(event, args, 'wow');
  });

  const sendMessage = () => {
    leemons.api({
      url: 'users/test-socket-io',
      allAgents: true,
    });
  };

  async function getProfiles() {
    try {
      const { profiles: _profiles } = await getUserProfilesRequest();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getProfiles();
  }, []);

  return (
    <>
      <PageHeader title={t('page_title')} description={t('page_description')} />
      <PageContainer>
        <button onClick={sendMessage}>sendMessage</button>
        Hola
      </PageContainer>
    </>
  );
}

export default withLayout(Welcome);
