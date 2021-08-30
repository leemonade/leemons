import React, { useEffect } from 'react';
import Highlight from 'react-highlight';
import { Tree, useTree, Button, Divider } from '../../src/components/ui';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';

const TREE_DATA = [
  {
    id: 'ID1',
    parent: 0,
    text: 'Organization A',
  },
  {
    id: 'ID2',
    parent: 'ID1',
    text: 'Center AA (Master)',
  },
  {
    id: 'ID1-ADD',
    parent: 'ID1',
    text: 'Add Center',
    type: 'button',
    draggable: false,
    data: {
      action: 'add',
    },
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
    type: 'button',
    draggable: false,
    data: {
      action: 'add',
    },
  },
  {
    id: 'ID4',
    parent: 0,
    text: 'Organization B',
  },
  {
    id: 'ID5',
    parent: 'ID4',
    text: 'Center BA',
  },
];

const TREE_DATA_1 = [
  {
    id: 'ID1',
    parent: 0,
    text: 'Organization A',
  },
  {
    id: 'ID2',
    parent: 'ID1',
    text: 'Center A (Master)',
  },
  {
    id: 'ID3',
    parent: 'ID2',
    text: 'Class 1',
  },
  {
    id: 'ID4',
    parent: 'ID2',
    text: 'Class 2',
  },
  {
    id: 'ID2-ADD',
    parent: 'ID2',
    text: 'Add Class',
    type: 'button',
    draggable: false,
    data: {
      action: 'add',
    },
  },
  {
    id: 'ID5',
    parent: 'ID1',
    text: 'Center B',
  },
  {
    id: 'ID5-ADD',
    parent: 'ID5',
    text: 'Add Class',
    type: 'button',
    draggable: false,
    data: {
      action: 'add',
    },
  },
  {
    id: 'ID1-ADD',
    parent: 'ID1',
    text: 'Add Center',
    type: 'button',
    draggable: false,
    data: {
      action: 'add',
    },
  },
];

const TREE_DATA_2 = [
  {
    id: 'ID1',
    parent: 0,
    text: 'Organization A',
  },
  {
    id: 'ID2',
    parent: 'ID1',
    text: 'Center A (Master)',
  },
  {
    id: 'ID-TEMP',
    parent: 'ID2',
    draggable: false,
    text: 'New Level',
  },
];

function TreePage() {
  const data = {
    showType: true,
    components: [],
    utilities: [],
  };

  const { treeData, setTreeData, ...treeProps } = useTree();
  const tree1 = useTree();
  const tree2 = useTree();
  useEffect(() => {
    tree1.setTreeData(TREE_DATA_1);
    tree2.setTreeData(TREE_DATA_2);
  }, []);

  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Tree</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <div className="grid grid-cols-2">
          <Wrapper className="flex flex-wrap items-start flex-col" title="Tree">
            <Tree
              {...tree1}
              rootId={0}
              onAdd={(id) => alert(`Add Node inside parentId: ${id}`)}
              onDelete={(id) => alert(`Delete nodeId: ${id}`)}
            />
          </Wrapper>
          <Wrapper className="flex flex-wrap items-start flex-col" title="Tree Data" nocode>
            <Highlight className="javascript p-4 text-xs rounded-box h-72">
              {JSON.stringify(TREE_DATA_1, undefined, 4)}
            </Highlight>
          </Wrapper>
        </div>

        <div className="grid grid-cols-2">
          <Wrapper
            className="flex flex-wrap items-start flex-col"
            title="Tree + Initial Open node + Allow drag parents"
          >
            <Tree
              {...tree1}
              rootId={0}
              initialOpen={['ID2']}
              allowDragParents
              onAdd={(id) => alert(`Add Node inside parentId: ${id}`)}
              onDelete={(id) => alert(`Delete nodeId: ${id}`)}
            />
          </Wrapper>
          <Wrapper className="flex flex-wrap items-start flex-col" title="Tree Data" nocode>
            <Highlight className="javascript p-4 text-xs rounded-box h-72">
              {JSON.stringify(TREE_DATA_1, undefined, 4)}
            </Highlight>
          </Wrapper>
        </div>

        <div className="grid grid-cols-2">
          <Wrapper
            className="flex flex-wrap items-start flex-col"
            title="Tree + Initial Selected node + Disable draggable"
          >
            <Tree {...tree2} rootId={0} initialSelected={['ID-TEMP']} />
          </Wrapper>
          <Wrapper className="flex flex-wrap items-start flex-col" title="Tree Data" nocode>
            <Highlight className="javascript p-4 text-xs rounded-box h-72">
              {JSON.stringify(TREE_DATA_2, undefined, 4)}
            </Highlight>
          </Wrapper>
        </div>

        <Divider className="my-6" />
        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default TreePage;
