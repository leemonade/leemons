import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import { PageContainer, PageHeader, Card, FormControl, Checkbox, Button } from 'leemons-ui';
import prefixPN from '@classroom/helpers/prefixPN';
import { SettingsService } from '@classroom/services';
import hooks from 'leemons-hooks';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de gestionar Clases
function Welcome() {
  useSession({ redirectTo: goLoginPage });

  const [translations] = useTranslate({ keysStartsWith: prefixPN('welcome_page') });
  const t = tLoader(prefixPN('welcome_page'), translations);

  // ----------------------------------------------------------------------
  // CLASSROOM SETTINGS
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const response = await SettingsService.getSettings();
      if (mounted) {
        setSettings(response.settings);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const updateSettings = async (data) => {
    await SettingsService.updateSettings(data);
  };

  // ----------------------------------------------------------------------
  // UI CONTROLS
  const handleHideHelp = () => {
    const newSettings = { ...settings, hideWelcome: !settings?.hideWelcome };
    setSettings(newSettings);
    updateSettings(newSettings);
  };

  const handleManualLoad = async () => {
    // Let's enable Tree menu item
    const itemKey = 'tree';
    await SettingsService.enableMenuItem(itemKey);
    await hooks.fireEvent('menu-builder:user:updateItem', itemKey);
  };

  return (
    <>
      <PageHeader title={t('page_title')} />
      <PageContainer className="bg-white">
        <div className="page-description" dangerouslySetInnerHTML={{ __html: t('page_info') }} />

        <FormControl label={t('hide_info_label')} labelPosition="right" className="font-inter">
          <Checkbox color="primary" onChange={handleHideHelp} checked={settings?.hideWelcome} />
        </FormControl>
      </PageContainer>

      <PageContainer>
        <div className="grid grid-cols-2 gap-6">
          {/* BULK LOAD */}
          <Card className="p-8 bg-white flex flex-col">
            <div className="h-20 bg-gray-10 rounded"></div>
            <div className="flex flex-col items-center px-12">
              <div className="text-2xl font-semibold py-8">{t('bulk_load.title')}</div>
              <div
                className="font-inter text-secondary-300 font-light leading-tight text-center"
                dangerouslySetInnerHTML={{ __html: t('bulk_load.description') }}
              ></div>
              <div className="mt-8">
                <Button color="primary" rounded>
                  {t('bulk_load.btn')}
                </Button>
              </div>
            </div>
          </Card>

          {/* MANUAL CREATION */}
          <Card className="p-8 bg-white flex flex-col">
            <div className="h-20 bg-gray-10 rounded"></div>
            <div className="flex flex-col items-center px-12">
              <div className="text-2xl font-semibold py-8">{t('manual_load.title')}</div>
              <div
                className="font-inter text-secondary-300 font-light leading-tight text-center"
                dangerouslySetInnerHTML={{ __html: t('manual_load.description') }}
              ></div>
              <div className="mt-8">
                <Link href="/classroom/private/tree">
                  <a className="btn btn-primary rounded-full" onClick={handleManualLoad}>
                    {t('manual_load.btn')}
                  </a>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </PageContainer>
    </>
  );
}

export default withLayout(Welcome);
