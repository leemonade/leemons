import { Tree, useTree } from 'leemons-ui';
import { useEffect } from 'react';

// TODO: Get multicenters

function tree({
  entities,
  schemas,

  onAdd = () => {},
  onSelect = () => {},
  showButtons = true,
  selectedNode = null,
  initialSelected = null,
  childrenLimit = 0,
}) {
  const treeProps = useTree();

  // Regenerate Tree Data when the entities prop change
  useEffect(() => {
    if (!entities) {
      return;
    }

    const useSchemas = entities.every(({ schema }) => schema) && schemas;

    // Addition buttons
    // TODO: If a schema exists, use schema name on Add Level
    const buttons = [];

    if (showButtons) {
      if (useSchemas) {
        buttons.push(
          ...schemas
            .filter((schema) => schema.properties.assignable !== false)
            .map((schema) =>
              entities
                .filter((level) => level.schema === schema.parent)
                .filter(
                  (level) =>
                    !childrenLimit ||
                    entities.filter(
                      ({ schema: _schema, parent }) => parent === level.id && _schema === schema.id
                    ).length < childrenLimit
                )
                .map((level) => ({
                  id: `${schema.id}-${level.id}-ADD`,
                  text: `Add ${schema.name} (to ${level.name})`,
                  parent: level.id,
                  type: 'button',
                  draggable: false,
                  data: {
                    editable: level.properties?.editable,
                    action: 'add',
                    parent: level.id,
                    schema: schema.id,
                  },
                }))
            )
            .flat()
        );
      } else {
        buttons.push(
          ...entities
            ?.filter(
              (entity) =>
                !entity.isClass &&
                // Can add many to a level or does not have
                (childrenLimit === 0 ||
                  entities.filter(({ parent }) => parent === entity.id).length < childrenLimit)
            )
            .map((entity) => ({
              id: `${entity.id}-ADD`,
              text: `Add level to ${entity.name}`,
              parent: entity.id,
              type: 'button',
              draggable: false,
              data: {
                editable: entity.properties.editable,
                parent: entity.id,
                action: 'add',
              },
            }))
        );
        // If the Entities without parent are lower than the limit, show add Entity to top level button
        if (
          childrenLimit === 0 ||
          entities.filter(({ parent }) => parent === null).length < childrenLimit
        ) {
          buttons.push({
            id: `center-ADD`,
            text: `Add level (to organization)`,
            parent: 'center',
            type: 'button',
            draggable: false,
            data: {
              parent: null,
              action: 'add',
            },
          });
        }
      }
    }

    // The actual Levels
    treeProps.setTreeData([
      // { id: 'center', text: useSchemas ? 'Colegio HDP' : 'Organization/center', parent: 0 },
      ...entities?.map((entity) => ({
        ...entity,
        text: entity.name,
        parent: entity.parent || 0,
      })),
      ...(showButtons ? buttons : []),
    ]);

    // treeProps.;
  }, [entities, schemas]);

  useEffect(() => {
    treeProps.setSelectedNode(selectedNode);
  }, [selectedNode]);

  treeProps.initialSelected = [initialSelected];

  return <Tree {...treeProps} onAdd={onAdd} onSelect={onSelect} />;
}

export default tree;
