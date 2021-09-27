import React, { useEffect, useState } from 'react';
import { Avatar, Button, FormControl, Input, Radio } from 'leemons-ui';
import { PencilIcon, ArrowsExpandIcon } from '@heroicons/react/solid';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import { CenterService } from '@users/services';
import prefixPN from '@classroom/helpers/prefixPN';
import EditLevelTutor from '@classroom/components/wip-ui/pages/edit-level/edit-level-tutor';
import EditLevelStudent from '@classroom/components/wip-ui/pages/edit-level/edit-level-students';
import SearchResults from '@classroom/components/wip-ui/pages/edit-level/search-results';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de gestionar Clases
function ClassList() {
  useSession({ redirectTo: goLoginPage });

  // --------------------------------------------------------
  // LANG PICKER
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [updateEntities, setUpdateEntities] = useState(null);
  const session = useSession({ redirectTo: goLoginPage });
  const [showEdit, toggleShowEdit] = useState({ active: false });

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
  const t = tLoader(prefixPN('edit_level_page'), translations);
  const tc = tLoader(prefixPN('common'), translations);

  return (
    <>
      <div className="bg-primary-content w-full h-screen overflow-auto">
        <div className="w-full h-full flex-nowrap">
          <h1 className="text-2xl text-secondary pt-12 pb-6 px-6 border-b border-base-200">
            {t('page_title')}
          </h1>
          <div className="w-full h-full flex">
            <div className=" w-full max-w-xs py-8 px-6 border-r border-base-200">
              {' '}
              TREE COMPONENT
            </div>
            <div className="w-full">
              <div className="w-full max-w-3xl pt-8 pb-6 px-6">
                <div className="page-header-l2 relative mb-8">
                  <h2 className="page-title-l2">Class B</h2>
                  <p className="page-description">Grupo avanzado de primero de primaria</p>
                  <Button color="primary" className="absolute top-3 right-3">
                    Save
                  </Button>
                </div>
                <EditLevelTutor></EditLevelTutor>
                <EditLevelStudent></EditLevelStudent>
              </div>
              <SearchResults></SearchResults>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withLayout(ClassList);
