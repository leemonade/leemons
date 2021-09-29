import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useListLevelSchema from '../../../../hooks/levelschema/useListLevelSchema';
import Tree from '../../../common/tree';

function findEntity(id, entities) {
  return entities.find(({ id: entityId }) => entityId === id);
}

export default function TreeAdmin({
  locale = 'en',
  onEdit = () => {},
  onAdd = () => {},
  onDelete = () => {},
  setUpdate = () => {},
  editingEntity = null,
  ...props
}) {
  // Get the DB LevelSchemas
  // data, setData, error, loading, request.current
  const [levelSchemas, , levelSchemasError, levelSchemasLoading, update] = useListLevelSchema(
    locale
  );
  const [entity, setEntity] = useState(null);

  const defaultEntity = {
    id: `LEVEL-ADD`,
    text: `Add Level`,
    parent: false,
    type: 'button',
    draggable: false,
    data: {
      editable: false,
      parent: false,
      action: 'add',
    },
  };

  useEffect(() => {
    if (editingEntity && editingEntity.active) {
      if (editingEntity.entity) {
        setEntity({
          ...editingEntity.entity,
          properties: { ...editingEntity.entity.properties, editing: true },
        });
      } else {
        setEntity({
          id: 'creating',
          parent: editingEntity.parent,
          isClass: false,
          name: editingEntity.newEntity?.name || 'Create Level',
          properties: {
            editing: true,
          },
        });
      }
    } else {
      setEntity(null);
    }
  }, [editingEntity]);

  // Give the update function to the parent
  useEffect(() => {
    setUpdate(update);
  }, []);

  return (
    <div className="w-full">
      {(() => {
        if (levelSchemasError) {
          return <p>{levelSchemasError.message}</p>;
        }
        if (!levelSchemas && levelSchemasLoading) {
          return <p>Loading ...</p>;
        }
        // showButtons={!editingEntity.active}
        return (
          <Tree
            childrenLimit={1}
            entities={
              entity ? [...levelSchemas.filter(({ id }) => id !== entity.id), entity] : levelSchemas
            }
            showButtons
            onEdit={(node) => {
              onEdit(findEntity(node.id, levelSchemas));
            }}
            onDelete={(node) => {
              onDelete(findEntity(node.id, levelSchemas));
            }}
            onAdd={(node) => onAdd(node)}
            {...props}
          />
        );
      })()}
    </div>
  );
}

TreeAdmin.propTypes = {
  locale: PropTypes.string,
  onDetails: PropTypes.func,
  onEdit: PropTypes.func,
  onAdd: PropTypes.func,
  setUpdate: PropTypes.func,
  editingEntity: PropTypes.object,
};
