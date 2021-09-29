import React, { useEffect, useState } from 'react';
import { PageHeader, Avatar, Button } from 'leemons-ui';
import { PencilIcon, ArrowsExpandIcon } from '@heroicons/react/solid';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import { CenterService } from '@users/services';
import prefixPN from '@classroom/helpers/prefixPN';
import Details from '@classroom/components/wip-ui/pages/admin-level/details';
import Infolayer from '@classroom/components/wip-ui/pages/admin-level/info-layer';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de gestionar Clases
function ClassList() {
  useSession({ redirectTo: goLoginPage });

  // --------------------------------------------------------
  // LANG PICKER
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(async () => {
    const request = await leemons.api(
      {
        url: 'multilanguage/locales',
        allAgents: true,
      },
      {
        method: 'GET',
      }
    );
    if (request.locales && Array.isArray(request.locales)) {
      setLanguages(request.locales);
    }
  }, []);

  const [translations] = useTranslate({
    keysStartsWith: prefixPN(''),
    locale: selectedLanguage === 'default' ? undefined : selectedLanguage,
  });
  const t = tLoader(prefixPN('class_list'), translations);
  const tc = tLoader(prefixPN('common'), translations);

  return (
    <>
      <div className="bg-primary-content  w-full h-screen overflow-auto ">
        <div className="w-full h-full max-w-4xl border-r border-gray-20">
          <PageHeader
            separator={false}
            className="pb-2 max-w-md mb-8"
            title={t('page_title')}
            description={t('page_info')}
          />
          <div className="p-6">
            <Details></Details>
          </div>
        </div>
      </div>

      <Infolayer></Infolayer>
    </>
  );
}

export default withLayout(ClassList);
