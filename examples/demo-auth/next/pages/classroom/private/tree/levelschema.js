import { useState } from 'react';
import useListLevelSchema from '@classroom/hooks/levelschema/useListLevelSchema';
import useListLevel from '@classroom/hooks/level/useListLevel';
import { useSession } from '@users/session';
import { useGetLocales } from '@multilanguage/helpers/getLocales';

import { withLayout } from '@layout/hoc';

import { goLoginPage } from '@users/navigate';

import LevelSchemaTree from '@classroom/components/common/tree';
import AddLevel from '@classroom/components/levelSchema/add';
import LocalePicker from '@multilanguage/components/LocalePicker';

import { Select } from 'leemons-ui';

// TODO: modify tree when adding item

function Levelschema() {
  const session = useSession({ redirectTo: goLoginPage });
  console.log('Session', session);

  const [locale, setLocale] = useState('en');
  const [
    levelSchemas,
    setLevelSchemas,
    levelSchemasError,
    levelSchemasLoading,
  ] = useListLevelSchema(locale || 'en');

  const [levels, setLevels, levelsError, levelsLoading] = useListLevel(locale || 'en');

  console.log('New Locale', locale, levelSchemas, levels);

  const [addLevelSchema, setAddLevelSchema] = useState({ active: false, parent: null });
  const [addLevel, setAddLevel] = useState({ active: false, parent: null, schema: null });

  const { data: locales, error: localesError } = useGetLocales();

  if ((levelSchemasLoading && !levelSchemas) || (levelsLoading && !levels)) {
    return <p>Loading</p>;
  }
  if (levelSchemasError) {
    console.log(levelSchemasError);
    return <p>{levelSchemasError.message}</p>;
  }
  if (levelsError) {
    console.log(levelsError);
    return <p>{levelsError.message}</p>;
  }
  return (
    <div>
      <LocalePicker
        locales={locales || []}
        // selected={locales.length && locale ? locale : undefined}
        setLocale={({ code: newLocale }) => {
          setLocale(newLocale);
        }}
      />
      <h1>LevelSchemas</h1>
      <LevelSchemaTree
        entities={levelSchemas}
        childrenLimit={1}
        onAdd={({ data: { parent } }) => {
          setAddLevelSchema({ active: true, parent });
        }}
        onSelect={(node, toggle) => {
          if (node.properties.editable !== false) {
            setAddLevelSchema({ active: true, entityId: node.id });
          } else {
            toggle();
          }
        }}
      />
      {addLevelSchema.active && (
        <AddLevel
          levelSchemas={levelSchemas}
          entities={levelSchemas}
          parentId={addLevelSchema.parent}
          entityId={addLevelSchema.entityId}
          onClose={(newLevelSchema) => {
            setAddLevelSchema({ active: false });
            if (!newLevelSchema) {
              return;
            }
            setLevelSchemas([
              ...levelSchemas,
              {
                ...newLevelSchema,
                name: newLevelSchema.names.find(({ locale: nameLocale }) => nameLocale === locale)
                  ?.value,
              },
            ]);
          }}
        />
      )}
      <br />
      <h1>Levels</h1>
      <LevelSchemaTree
        entities={levels}
        schemas={levelSchemas}
        childrenLimit={2}
        onAdd={({ data: { parent, schema } }) => {
          setAddLevel({ active: true, parent, schema });
        }}
        onSelect={(node, toggle) => {
          if (node.properties.editable !== false) {
            setAddLevel({ active: true, entityId: node.id });
          } else {
            toggle();
          }
        }}
      />

      {addLevel.active && (
        <AddLevel
          entities={levels}
          schemas={levelSchemas}
          schemaId={addLevel.schema}
          entityId={addLevel.entityId}
          parentId={addLevel.parent}
          onClose={(newLevel) => {
            setAddLevel({ active: false });
            if (!newLevel) {
              return;
            }
            setLevels([
              ...levels,
              {
                ...newLevel,
                name: newLevel.names.find(({ locale: nameLocale }) => nameLocale === locale)?.value,
              },
            ]);
          }}
        />
      )}
    </div>
  );
}

export default withLayout(Levelschema);
