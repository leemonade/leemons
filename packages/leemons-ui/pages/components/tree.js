import React, { useEffect } from 'react';
import Highlight from 'react-highlight';
import { Tree, useTree, Button, Divider } from '../../src/components/ui';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';

const TREE_DATA_1 = [
  {
    id: 'ID1',
    parent: 0,
    text: 'Organization A',
    actions: [
      {
        name: 'rename',
        showOnHover: false,
        icon: () => <span>R</span>,
        handler: () => alert('Handler works'),
      },
      'edit',
      {
        name: 'delete',
      },
    ],
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

const TREE_DATA_3 = [
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
    text: 'Grade 1',
  },
  {
    id: 'ID3-ADD',
    parent: 'ID3',
    text: 'Add Class',
    type: 'button',
    draggable: false,
    data: {
      action: 'add',
    },
  },
  {
    id: 'ID4',
    parent: 'ID2',
    text: 'Grade 2',
  },
  {
    id: 'ID4-ADD',
    parent: 'ID4',
    text: 'Add Class',
    type: 'button',
    draggable: false,
    data: {
      action: 'add',
    },
  },
  {
    id: 'ID2-ADD',
    parent: 'ID2',
    text: 'Add Grade',
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

function TreePage() {
  const data = {
    showType: true,
    components: [],
    utilities: [],
  };

  const tree1 = useTree();
  const tree2 = useTree();
  const tree3 = useTree();
  const tree4 = useTree();
  useEffect(() => {
    tree1.setTreeData(TREE_DATA_1);
    tree2.setTreeData(TREE_DATA_2);
    tree3.setTreeData(TREE_DATA_3);
    tree4.setTreeData(TREE_DATA_3);
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
              onDelete={(node) => alert(`Delete nodeId: ${node.id}`)}
              onEdit={(node) => alert(`Editing ${node.id}`)}
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

        <div className="grid grid-cols-2">
          <Wrapper className="flex flex-wrap items-start flex-col" title="Tree + setSelected">
            <div>
              <Button color="primary" className="mr-2" link onClick={() => tree3.setSelectedNode()}>
                Clear Selected Node
              </Button>
              <Button
                color="primary"
                onClick={() =>
                  // Provide the ID you wan to select, it won't modify the children branches
                  tree3.setSelectedNode('ID2')
                }
              >
                Set Selected Node
              </Button>
              <Tree {...tree3} rootId={0} />
            </div>
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
            title="Tree + custom setSelected"
          >
            <div>
              <Button
                color="primary"
                link
                onClick={() =>
                  // You can also provide inclusive, replace flags
                  tree4.setSelectedNode({ fold: 'ID1' })
                }
                className="mr-2"
              >
                Clear Selected Node (Collapse)
              </Button>
              <Button
                color="primary"
                onClick={() =>
                  /* You can add the flags:
                   * inclusive: to also expand the selected node or not
                   * replace: to force the tree to set the exact state (it folds the lower opened branched)
                   */
                  tree4.setSelectedNode({ id: 'ID2', inclusive: false, replace: true })
                }
              >
                Set Selected Node (Custom)
              </Button>

              <Tree {...tree4} rootId={0} />
            </div>
          </Wrapper>
          <Wrapper className="flex flex-wrap items-start flex-col" title="Tree Data" nocode>
            <Highlight className="javascript p-4 text-xs rounded-box h-72">
              {JSON.stringify(TREE_DATA_1, undefined, 4)}
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
