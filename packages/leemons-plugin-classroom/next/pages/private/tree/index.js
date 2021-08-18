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

      <div className="bg-gray-100">
        <PageContainer>
          <div className="flex">
            {/* TREE ADMIN */}
            <div className="flex flex-1">
              <div className="card bg-white"></div>
            </div>
            {/* TEMPLATE PANEL */}
            <div className="w-60">
              <Card className="bg-white p-8">
                <div className="font-semibold py-2">{t('from_template_info.title')}</div>
                <div className="font-inter text-secondary-300 font-light py-2">
                  {t('from_template_info.description')}
                </div>
                <div className="mt-4">
                  <Button color="primary" rounded>
                    {t('from_template_info.btn')}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </PageContainer>
      </div>
    </>
  );
}

export default withLayout(Tree);
