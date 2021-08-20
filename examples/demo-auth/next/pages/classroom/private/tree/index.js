import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import { PageContainer, PageHeader, Card, FormControl, Checkbox, Button, Select } from 'leemons-ui';
import prefixPN from '@classroom/helpers/prefixPN';
import hooks from 'leemons-hooks';
import { CenterService } from '@users/services';
import { TreeView } from '@classroom/components/treeview';

const TREE_DATA = [
  {
    id: '1',
    title: 'Organization A',
    expanded: true,
    children: [
      {
        id: '2',
        title: 'Center A',
        children: [
          { id: '3', title: 'Level 1' },
          {
            id: '4',
            title: 'Level 2',
            children: [
              { id: '41', title: 'Level 21' },
              { id: '42', title: 'Level 22' },
            ],
          },
          { id: '5', title: 'Level 3' },
          { title: 'Add level', type: 'add' },
        ],
      },
      {
        id: '6',
        title: 'Center B',
        children: [
          { id: '7', title: 'Level 1' },
          { title: 'New level', type: 'new' },
        ],
      },
    ],
  },
  {
    id: '10',
    title: 'Organization B',
    children: [
      {
        id: '12',
        title: 'Center AB',
        children: [
          { id: '13', title: 'Level 1B' },
          { id: '14', title: 'Level 2B' },
          { id: '15', title: 'Level 3B' },
          { title: 'Add level', type: 'add' },
        ],
      },
      {
        id: '16',
        title: 'Center BB',
        children: [
          { id: '17', title: 'Level 1' },
          { title: 'New level', type: 'new' },
        ],
      },
    ],
  },
];

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de gestionar Clases
function Tree() {
  useSession({ redirectTo: goLoginPage });

  const [translations] = useTranslate({ keysStartsWith: prefixPN('') });
  const t = tLoader(prefixPN('tree_page'), translations);
  const tc = tLoader(prefixPN('common'), translations);

  // --------------------------------------------------------
  // CENTERS
  const [centers, setCenters] = useState([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await CenterService.listCenters({ page: 0, size: 99999 });
      if (mounted && data) {
        setCenters(data.items);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // --------------------------------------------------------
  // TREE
  const [treeData, setTreeData] = useState(TREE_DATA);

  return (
    <>
      <div className="flex flex-col h-full">
        <PageHeader title={t('page_title')} />
        <PageContainer>
          <div className="page-description" dangerouslySetInnerHTML={{ __html: t('page_info') }} />
        </PageContainer>

        <div className="bg-gray-100 text-sm flex flex-1">
          <PageContainer>
            <div className="flex space-x-5">
              {/* TREE ADMIN */}
              <div className="flex flex-1">
                <Card className="bg-white w-full h-full p-8">
                  <div className="h-full">
                    <TreeView
                      treeData={treeData}
                      setTreeData={setTreeData}
                      onAddNode={(rowInfo) => console.log(rowInfo)}
                      onDeleteNode={(rowInfo) => console.log(rowInfo)}
                    />
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

export default withLayout(Tree);
