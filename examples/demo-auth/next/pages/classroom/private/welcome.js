import React, { useEffect } from 'react';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { useSession } from '@users/session';
import { getUserProfilesRequest } from '@users/request';
import { goLoginPage } from '@users/navigate';
import prefixPN from '@classroom/helpers/prefixPN';
import { withLayout } from '@layout/hoc';
import { PageContainer, PageHeader, Card } from 'leemons-ui';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
function Welcome() {
  useSession({ redirectTo: goLoginPage });

  const [translations] = useTranslate({ keysStartsWith: prefixPN('welcome_page') });
  const t = tLoader(prefixPN('welcome_page'), translations);

  return (
    <>
      <PageHeader title={t('page_title')} />
      <PageContainer>
        <div className="page-description" dangerouslySetInnerHTML={{ __html: t('page_info') }} />

        <div className="grid grid-cols-2 mt-8">
          <Card className="border border-base-200 p-8">Hola</Card>
          <Card className="border border-base-200 p-8">Mundo</Card>
        </div>
      </PageContainer>
    </>
  );
}

export default withLayout(Welcome);
