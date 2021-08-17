import React, { useEffect, useState } from 'react';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import { PageContainer, PageHeader, Card, FormControl, Checkbox } from 'leemons-ui';
import prefixPN from '@classroom/helpers/prefixPN';
import SettingsService from '@classroom/services/settings';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de gestionar Clases
function Welcome() {
  useSession({ redirectTo: goLoginPage });

  const [translations] = useTranslate({ keysStartsWith: prefixPN('welcome_page') });
  const t = tLoader(prefixPN('welcome_page'), translations);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const response = await SettingsService.getSettings();
      console.log(response);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleHideHelp = () => {};

  return (
    <>
      <PageHeader title={t('page_title')} />
      <PageContainer>
        <div className="page-description" dangerouslySetInnerHTML={{ __html: t('page_info') }} />

        <FormControl label={t('hide_info_label')} labelPosition="right" className="font-inter">
          <Checkbox color="primary" onChange={handleHideHelp} />
        </FormControl>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <Card className="border border-base-200 p-8">Hola</Card>
          <Card className="border border-base-200 p-8">Mundo</Card>
        </div>
      </PageContainer>
    </>
  );
}

export default withLayout(Welcome);
