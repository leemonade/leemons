import React, { useEffect, useState } from 'react';
import { PageContainer, PageHeader, Card, Button, Select, Tree, useTree } from 'leemons-ui';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import { CenterService } from '@users/services';
import prefixPN from '@classroom/helpers/prefixPN';

import { listLevelSchemas } from '../../../src/services/levelSchemas';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de gestionar Clases
function TreePage() {
  useSession({ redirectTo: goLoginPage });

  useEffect(async () => {
    console.log(await listLevelSchemas());
  }, []);

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
      <div className="flex flex-col h-full">
        <PageHeader title={t('page_title')} />
        <PageContainer className="bg-white">
          <div className="page-description" dangerouslySetInnerHTML={{ __html: t('page_info') }} />
        </PageContainer>

        <div className="flex flex-1">
          <PageContainer>
            <div className="text-sm flex space-x-5">
              <Select
                className="w-full max-w-xs"
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
              {/* TREE ADMIN */}
              <div className="flex flex-1">
                <Card className="bg-white w-full h-full p-8">
                  <div className="h-full">
                    {initTree && (
                      <Tree
                        {...treeProps}
                        initialOpen={initialOpen}
                        onAdd={(parentId) => console.log(parentId)}
                        onDelete={(nodeId) => console.log(nodeId)}
                      />
                    )}
                  </div>
                </Card>
              </div>
              {/* TEMPLATE PANEL */}
              <div className="w-72">
                <Card className="bg-white p-8">
                  <div className="text-secondary-400 text-xl py-2 leading-tight">
                    {t('from_template_info.title')}
                  </div>
                  <div className="page-description py-2">{t('from_template_info.description')}</div>
                  <div className="py-2">
                    <Select outlined className="w-full">
                      <option>Spain</option>
                    </Select>
                  </div>
                  <div>
                    <Select outlined className="w-full" defaultValue="none">
                      <option disabled value="none">
                        {tc('select_template')}
                      </option>
                    </Select>
                  </div>
                  <div className="my-4">
                    <Button color="primary" rounded className="btn-sm w-full">
                      {t('from_template_info.btn')}
                    </Button>
                  </div>
                  <div className="page-description">
                    {t('from_template_info.hide_info.description')}
                  </div>
                  <div>
                    <Button color="primary" link className="btn-sm px-0">
                      {t('from_template_info.hide_info.btn')}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </PageContainer>
        </div>
      </div>
    </>
  );
}

export default withLayout(TreePage);
