import React, { useEffect } from 'react';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { useSession } from '@users/session';
import { getUserProfilesRequest } from '@users/request';
import { goLoginPage } from '@users/navigate';
import prefixPN from '@users/helpers/prefixPN';
import { withLayout } from '@layout/hoc';
import { PageContainer, PageHeader, Card } from 'leemons-ui';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
function Welcome() {
  useSession({ redirectTo: goLoginPage });

  const [translations] = useTranslate({ keysStartsWith: prefixPN('welcome_page') });
  const t = tLoader(prefixPN('welcome_page'), translations);

  return (
    <>
      <PageHeader title={t('page_title')} description={t('page_description')} />
      <PageContainer>
        <div className="grid grid-cols-2">
          <Card></Card>
        </div>
      </PageContainer>
    </>
  );
}

export default withLayout(Welcome);
