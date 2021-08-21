import React, { useEffect } from 'react';
import { XIcon } from '@heroicons/react/outline';
import { Tree, useTree, Button, Divider } from '../../src/components/ui';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';

const TREE_DATA = [
  {
    id: 'ID1',
    parent: 0,
    droppable: true,
    text: 'Organization A',
  },
  {
    id: 'ID2',
    parent: 'ID1',
    droppable: true,
    text: 'Center AA (Master)',
  },
  {
    id: 'ID3',
    parent: 'ID2',
    text: 'Class ABC',
  },
  {
    id: 'ID31',
    parent: 'ID2',
    text: 'Class DEF',
  },
  {
    id: 'ID2-ADD',
    parent: 'ID2',
    text: 'Add Class',
    data: {
      type: 'button',
    },
  },
  {
    id: 'ID4',
    parent: 0,
    droppable: true,
    text: 'Organization B',
  },
  {
    id: 'ID5',
    parent: 'ID4',
    droppable: true,
    text: 'Center BA',
  },
];

function TreePage() {
  const data = {
    showType: true,
    components: [],
    utilities: [],
  };

  const { treeData, setTreeData, ...treeProps } = useTree();
  useEffect(() => setTreeData(TREE_DATA), []);

  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Tree</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper className="flex flex-wrap items-start flex-col" title="Tree">
          <Tree {...treeProps} treeData={treeData} setTreeData={setTreeData} selectedNodeId="ID5" />
        </Wrapper>

        <Divider className="my-6" />
        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default TreePage;
