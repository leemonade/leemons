import { useEffect } from 'react';
import useListLevelSchema from '../../../../hooks/levelschema/useListLevelSchema';
import Tree from '../../../common/tree';

function findEntity(id, entities) {
  return entities.find(({ id: entityId }) => entityId === id);
}

export default function TreeAdmin({
  onDetails = () => {},
  onEdit = () => {},
  onAdd = () => {},
  setUpdate = () => {},
}) {
  const [
    levelSchemas,
    setLevelSchemas,
    levelSchemasError,
    levelSchemasLoading,
    update,
  ] = useListLevelSchema('en');

  useEffect(() => {
    setUpdate(update);
  }, []);
  return (
    <div className="tree_editWrapper flex-1 my-2 mb-2">
      {(() => {
        if (levelSchemasError) {
          return <p>{levelSchemasError}</p>;
        }
        if (!levelSchemas && levelSchemasLoading) {
          return <p>Loading ...</p>;
        }
        return (
          <Tree
            entities={levelSchemas}
            onSelect={(node, toggle) => {
              toggle();
              if (node.properties.editable !== false) {
                onEdit(findEntity(node.id, levelSchemas));
              } else {
                onDetails(findEntity(node.id, levelSchemas));
              }
            }}
            onAdd={(node) => onAdd(node.data.parent)}
          />
        );
      })()}
    </div>
  );
}
