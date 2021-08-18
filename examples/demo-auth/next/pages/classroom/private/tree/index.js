import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import { PageContainer, PageHeader, Card, FormControl, Checkbox, Button } from 'leemons-ui';
import prefixPN from '@classroom/helpers/prefixPN';
import hooks from 'leemons-hooks';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de gestionar Clases
function Tree() {
  useSession({ redirectTo: goLoginPage });

  const [translations] = useTranslate({ keysStartsWith: prefixPN('tree_page') });
  const t = tLoader(prefixPN('tree_page'), translations);

  return (
    <>
      <PageHeader title={t('page_title')} />
      <PageContainer>
        <div className="page-description" dangerouslySetInnerHTML={{ __html: t('page_info') }} />
      </PageContainer>
    </>
  );
}

export default withLayout(Tree);
