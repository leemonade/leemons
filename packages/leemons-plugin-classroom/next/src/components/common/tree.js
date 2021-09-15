import { Tree as UITree, useTree } from 'leemons-ui';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';

function Tree({
  entities,
  schemas,

  onAdd = () => {},
  onSelect = () => {},
  showButtons = true,
  selectedNode = null,
  initialSelected = null,
  childrenLimit = 0,
}) {
  const [translations] = useTranslate({ keysStartsWith: 'plugins.classroom.tree.' });
  const t = tLoader('plugins.classroom.tree', translations);

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
                  text: `${t('new.prefix.level')} ${schema.name}`,
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
            ?.filter((entity) => entity.properties.assignable !== false)
            .filter(
              (entity) =>
                !entity.isClass &&
                // Can add many to a level or does not have
                (childrenLimit === 0 ||
                  entities.filter(({ parent }) => parent === entity.id).length < childrenLimit)
            )
            .map((entity) => ({
              id: `${entity.id}-ADD`,
              text: `${t('new.prefix.levelSchema')}`,
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
            text: t('new.prefix.levelSchema'),
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
      ...entities?.map((entity) => {
        if (entity.properties.editing) {
          console.log('editing', entity.name);
          treeProps.selectedNode = entity.id;
          treeProps.setSelectedNode(entity.id);
        }
        return {
          ...entity,
          text: entity.name,
          parent: entity.parent || 0,
          draggable: false,
        };
      }),
      ...(showButtons ? buttons : []),
    ]);

    // treeProps.;
  }, [entities, schemas, translations]);

  useEffect(() => {
    treeProps.setSelectedNode(selectedNode);
  }, [selectedNode]);

  treeProps.initialSelected = [initialSelected];

  return <UITree {...treeProps} onAdd={onAdd} onSelect={onSelect} />;
}

Tree.propTypes = {
  entities: PropTypes.array,
  schemas: PropTypes.array,

  onAdd: PropTypes.func,
  onSelect: PropTypes.func,
  showButtons: PropTypes.bool,
  selectedNode: PropTypes.string,
  initialSelected: PropTypes.string,
  childrenLimit: PropTypes.number,
};

export default Tree;
