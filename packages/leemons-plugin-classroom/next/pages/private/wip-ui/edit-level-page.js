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
import EditLevelTutor from './edit-level-tutor';

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
      <div className="bg-primary-content w-full h-screen overflow-auto ">
        <div className="w-full h-full">
          <h1 className="text-2xl text-secondary pt-12 pb-6 px-6 border-b border-base-200">
            {t('page_title')}
          </h1>
          <div className="w-full h-full flex">
            <div className=" w-full max-w-xs py-8 px-6 border-r border-base-200">
              {' '}
              TREE COMPONENT
            </div>
            <div className="w-full max-w-3xl pt-8 pb-6 px-6">
              <div className="page-header-l2 sticky top-0  mb-8">
                <h2 className="page-title-l2">Class B</h2>
                <p className="page-description">Grupo avanzado de primero de primaria</p>
                <Button color="primary" className="absolute top-3 right-3">
                  Save
                </Button>
              </div>
              <EditLevelTutor></EditLevelTutor>
              <fielset className="edit-section border-t border-base-200 pt-8 flex gap-10">
                <div className=" w-4/12">
                  <legend className="edit-section-title text-xl text-secondary">
                    {t('students.title')}
                  </legend>
                  <p className="edit-section-description font-inter text-sm text-secondary-300">
                    {t('students.description')}
                  </p>
                </div>
                <div className=" w-8/12">
                  <div className="flex flex-nowrap justify-between mb-3">
                    <FormControl label={t('students.option01')} labelPosition="right">
                      <Radio name="opt" />
                    </FormControl>
                    <FormControl label={t('students.option02')} labelPosition="right">
                      <Radio name="opt" />
                    </FormControl>
                    <FormControl label={t('students.option03')} labelPosition="right">
                      <Radio name="opt" />
                    </FormControl>
                  </div>
                  <FormControl label={t('students.label')} className="read-only-label">
                    <Input placeholder={t('students.placeholder')} outlined={true}></Input>
                  </FormControl>
                </div>
              </fielset>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default withLayout(ClassList);
