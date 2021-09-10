import React, { useEffect, useState } from 'react';
import { CenterService } from '@users/services';
import { Card, Tree, useTree } from 'leemons-ui';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';
import prefixPN from '@classroom/helpers/prefixPN';

export default function TreeAdmin({ locale }) {
  console.log(CenterService);
  const [translations] = useTranslate({
    keysStartsWith: prefixPN(''),
    locale: locale === 'default' ? undefined : locale,
  });
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
  );
}
