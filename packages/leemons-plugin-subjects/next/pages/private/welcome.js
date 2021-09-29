import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import {
  PageContainer,
  PageHeader,
  Card,
  FormControl,
  Checkbox,
  Button,
  InlineSvg,
} from 'leemons-ui';
import prefixPN from '@subjects/helpers/prefixPN';
import { SettingsService } from '@subjects/services';
import { ChevronRightIcon, CloudUploadIcon } from '@heroicons/react/outline';
import hooks from 'leemons-hooks';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de gestionar Clases
function Welcome() {
  useSession({ redirectTo: goLoginPage });

  const [translations] = useTranslate({ keysStartsWith: prefixPN('welcome_page') });
  const t = tLoader(prefixPN('welcome_page'), translations);

  // ----------------------------------------------------------------------
  // SETTINGS
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
    <div className="flex h-full">
      <div className="w-2/5 flex justify-end bg-white">
        <div style={{ maxWidth: 500 }} className="p-16">
          <div className="relative w-10 h-10 mb-4">
            <InlineSvg src="/subjects/plugin-icon.svg" className="text-primary" />
          </div>
          <div className="text-2xl py-3">{t('page_title')}</div>
          <div className="font-inter font-normal text-lg py-3">{t('page_subtitle')}</div>
          <div className="page-description" dangerouslySetInnerHTML={{ __html: t('page_info') }} />

          <div className="py-3">
            <a href={t('docs_btn.url')} className="text-primary hover:underline text-sm">
              {t('docs_btn.label')}
            </a>
          </div>
          <div className="border-t border-gray-30 my-3"></div>
          <div>
            <FormControl
              label={t('hide_info_label')}
              labelPosition="right"
              className="font-inter font-normal"
            >
              <Checkbox color="primary" onChange={handleHideHelp} checked={settings?.hideWelcome} />
            </FormControl>
          </div>
        </div>
      </div>
      <div className="w-3/5 bg-gray-10">
        <div style={{ maxWidth: 1000 }} className="p-16">
          <div className="flex flex-col gap-6">
            {/* MANUAL CREATION */}
            <Card className="flex flex-row bg-white border border-gray-20 p-2">
              <div className="flex bg-gray-10 rounded h-60 w-60 items-center justify-center">
                <div className="relative w-12 h-12">
                  <InlineSvg src="/subjects/input_cursor.svg" className="text-gray-200" />
                </div>
              </div>
              <div className="flex flex-col px-12 flex-1 justify-center">
                <div className="text-xl font-medium py-4">{t('manual_load.title')}</div>
                <div
                  className="font-inter text-gray-300 text-sm"
                  dangerouslySetInnerHTML={{ __html: t('manual_load.description') }}
                ></div>
                <div className="mt-4 -ml-4">
                  <Link href="/subjects/private/tree">
                    <a className="btn btn-primary btn-text rounded-full" onClick={handleManualLoad}>
                      {t('manual_load.btn')}
                      <ChevronRightIcon className="inline-block w-5 h-5 ml-1 -mr-1 stroke-current" />
                    </a>
                  </Link>
                </div>
              </div>
            </Card>

            {/* TEMPLATE LOAD */}
            <Card className="flex flex-row bg-white border border-gray-20 p-2">
              <div className="flex bg-gray-10 rounded h-60 w-60 items-center justify-center">
                <div className="relative w-12 h-12">
                  <InlineSvg src="/subjects/file_upload.svg" className="text-gray-200" />
                </div>
              </div>
              <div className="flex flex-col px-12 flex-1 justify-center">
                <div className="text-xl font-medium py-4">{t('template_load.title')}</div>
                <div
                  className="font-inter text-gray-300 text-sm"
                  dangerouslySetInnerHTML={{ __html: t('template_load.description') }}
                ></div>
                <div className="mt-4 -ml-4">
                  <Button color="primary" text rounded>
                    {t('template_load.btn')}
                    <CloudUploadIcon className="inline-block w-5 h-5 ml-1 -mr-1 stroke-current" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withLayout(Welcome);
