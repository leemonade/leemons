import React, { useEffect, useState } from 'react';
import { PageContainer, PageHeader, Card, Button, Select, Tree, useTree } from 'leemons-ui';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import { CenterService } from '@users/services';
import prefixPN from '@classroom/helpers/prefixPN';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de gestionar Clases
function TreePage() {
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
  const t = tLoader(prefixPN('tree_page'), translations);
  const tc = tLoader(prefixPN('common'), translations);

  const TREE_DATA = [
    {
      id: 'stage',
      text: 'Etapa',
      parent: 0,
    },
    {
      id: 'stage-ADD',
      text: tc('add_level'),
      type: 'button',
      parent: 'stage',
    },
    {
      id: 'level',
      text: 'Curso',
      parent: 'stage',
    },
    {
      id: 'level-ADD',
      text: tc('add_level'),
      type: 'button',
      parent: 'level',
    },
    {
      id: 'group',
      text: 'Grupo',
      parent: 'level',
    },
  ];

  // --------------------------------------------------------
  // TREE
  const [initTree, setInitTree] = useState(false);
  const [initialOpen, setInitialOpen] = useState([]);
  const treeProps = useTree();

  // --------------------------------------------------------
  // INITIAL DATA

  useEffect(async () => {
    let mounted = true;
    // We only need to know if there are multiple centers
    const { data } = await CenterService.listCenters({ page: 0, size: 2 });
    if (mounted && data && translations?.items) {
      const tempTreeData = [];
      if (Array.isArray(data.items) && data.items.length > 1) {
        // MultiCenter:  display organization and center in separate levels
        tempTreeData.push({ id: 'organization', text: tc('organization'), parent: 0 });
        tempTreeData.push({ id: 'center', text: tc('center'), parent: 'organization' });
      } else {
        // MonoCenter:  display organization and center in the same level
        tempTreeData.push({
          id: 'organization/center',
          text: `${tc('organization')} / ${tc('center')}`,
          parent: 0,
        });
      }

      const lastParentID = tempTreeData[tempTreeData.length - 1].id;
      tempTreeData.push({
        id: `${lastParentID}-ADD`,
        text: tc('add_level'),
        parent: lastParentID,
        type: 'button',
        data: {
          action: 'add',
        },
      });

      const [firstElement, ...treeData] = TREE_DATA;
      tempTreeData.push({ ...firstElement, parent: lastParentID });
      tempTreeData.push(...treeData);
      setInitialOpen([`${lastParentID}-ADD`]);
      treeProps.setTreeData(tempTreeData);
      setInitTree(true);
    }

    return () => {
      mounted = false;
    };
  }, [translations]);

  return (
    <>
      <div className="bg-secondary-content  edit-mode w-full h-screen overflow-auto grid">
        <div className="bg-primary-content w-full">
          <PageHeader separator={false} className="pb-2" title={t('page_title')} />
          <div className="page-description  pb-12 max-w-screen-xl w-full mx-auto px-6" dangerouslySetInnerHTML={{ __html: t('page_info') }} />
          <Select
            className="w-full max-w-xs absolute top-10 right-10"
            outlined={true}
            onChange={(event) => setSelectedLanguage(event.target.value)}
          >
            <option key="null" value={'default'}>
              default
            </option>
            {languages.map((locale) => (
              <option key={locale.id} value={locale.code}>
                {locale.name} ({locale.code})
              </option>
            ))}
          </Select>
        </div>
        <div className="flex max-w-screen-xl w-full mx-auto px-6">
          <div className="tree_editWrapper flex-1 my-2 mb-2">

            {/* TREE ADMIN */}
            <div className="tree">
              {initTree && (
                <Tree
                  {...treeProps}
                  initialOpen={initialOpen}
                  onAdd={(parentId) => console.log(parentId)}
                  onDelete={(nodeId) => console.log(nodeId)}
                />
              )}

            </div>
          </div>
          {/* TEMPLATE PANEL */}
          <div className="flex-1 m2">
            <aside className="help-wizard">
              {/*TO DO LIBRERIA ICONOS PROPIA - No existe similar a este en HeroIcons */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="help-wizard_ico">
                <g clip-path="url(#clip0)">
                  <path d="M0.75 0.747986H5.25V5.24799H0.75V0.747986Z" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M0.75 18.748H5.25V23.248H0.75V18.748Z" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M17.25 0.747986H21.75V5.24799H17.25V0.747986Z" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M17.25 18.748H21.75V23.248H17.25V18.748Z" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M5.25 2.24799H17.25" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M20.25 5.24799V18.748" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M17.25 21.748H5.25" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M2.25 18.748V5.24799" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M6.75 8.99999C6.74974 8.70434 6.80774 8.41155 6.9207 8.13833C7.03365 7.86512 7.19935 7.61685 7.4083 7.4077C7.61726 7.19856 7.86539 7.03265 8.1385 6.91945C8.41161 6.80625 8.70436 6.74799 9 6.74799H13.5C13.7956 6.74799 14.0884 6.80625 14.3615 6.91945C14.6346 7.03265 14.8827 7.19856 15.0917 7.4077C15.3007 7.61685 15.4663 7.86512 15.5793 8.13833C15.6923 8.41155 15.7503 8.70434 15.75 8.99999" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M11.25 6.74799V17.248" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M8.21899 17.248H14.219" stroke="#5B6577" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="32" height="32" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <h2 className="help-wizard_name">
                {t('from_template_info.title')}
              </h2>
              <p className="help-wizard_description">
                {t('from_template_info.description')}
              </p>
              <Select outlined className="w-full">
                <option>Spain</option>
              </Select>

              <Select outlined className="w-full" defaultValue="none">
                <option disabled value="none">
                  {tc('select_template')}
                </option>
              </Select>

              <Button color="primary" rounded className="btn-sm w-full">
                {t('from_template_info.btn')}
              </Button>
              <div className="help-wizard_legend">
                {t('from_template_info.hide_info.description')}
                <Button color="primary" link className="btn-sm px-0">
                  {t('from_template_info.hide_info.btn')}
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}

export default withLayout(TreePage);
