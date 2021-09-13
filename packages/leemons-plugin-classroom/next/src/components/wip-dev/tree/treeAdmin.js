import useListLevelSchema from '../../../hooks/levelschema/useListLevelSchema';
import Tree from '../../common/tree';

export default function TreeAdmin() {
  const [
    levelSchemas,
    setLevelSchemas,
    levelSchemasError,
    levelSchemasLoading,
  ] = useListLevelSchema('en');
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
              if (node.properties.editable !== false) {
                console.log('Edit', node.id);
                // setAddLevelSchema({ active: true, entityId: node.id });
              } else {
                toggle();
              }
            }}
          />
        );
      })()}
    </div>
  );
}
