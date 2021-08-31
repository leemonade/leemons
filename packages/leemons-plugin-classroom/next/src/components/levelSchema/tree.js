import { Tree, useTree } from 'leemons-ui';
import { useEffect } from 'react';

function tree({
  levelSchemas,
  onAdd = () => {},
  showButtons = true,
  selectedNode = null,
  initialSelected = null,
}) {
  const treeProps = useTree();
  useEffect(() => {
    if (!levelSchemas) {
      return;
    }
    const buttons = [
      {
        id: `center-ADD`,
        text: `Add level (to organization)`,
        parent: 'center',
        type: 'button',
        draggable: false,
        data: {
          action: 'add',
        },
      },
      ...levelSchemas
        ?.filter((levelSchema) => !levelSchema.isClass)
        .map((levelSchema) => ({
          id: `${levelSchema.id}-ADD`,
          text: `Add level to ${levelSchema.name}`,
          parent: levelSchema.id,
          type: 'button',
          draggable: false,
          data: {
            action: 'add',
          },
        })),
    ];
    treeProps.setTreeData([
      { id: 'center', text: 'Organization', parent: 0 },
      ...levelSchemas?.map((levelSchema) => ({
        ...levelSchema,
        text: levelSchema.name,
        parent: levelSchema.parent || 'center',
      })),
      ...(showButtons ? buttons : []),
    ]);

    // treeProps.;
  }, [levelSchemas]);

  useEffect(() => {
    treeProps.setSelectedNode(selectedNode);
  }, [selectedNode]);

  treeProps.initialSelected = [initialSelected];

  return <Tree {...treeProps} onAdd={onAdd} />;
}

export default tree;
