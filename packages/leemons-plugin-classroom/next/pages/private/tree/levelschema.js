import { useState } from 'react';
import useListLevelSchema from '@classroom/hooks/levelschema/useListLevelSchema';
import LevelSchemaTree from '@classroom/components/levelSchema/tree';
import AddLevel from '@classroom/components/levelSchema/add';

import LocalePicker from '@multilanguage/components/LocalePicker';
import { useGetLocales } from '@multilanguage/helpers/getLocales';

export default function levelschema() {
  const [locale, setLocale] = useState(undefined);
  const [levelSchemas, levelSchemasError, levelSchemasLoading] = useListLevelSchema(locale || 'en');
  const [addLevel, setAddLevel] = useState({ active: false, parent: null });
  const { data: locales, error: localesError } = useGetLocales();

  if (levelSchemasLoading && !levelSchemas) {
    return <p>Loading</p>;
  }
  if (levelSchemasError) {
    console.log(levelSchemasError);
    return <p>{levelSchemasError.message}</p>;
  }
  return (
    <div>
      <LocalePicker
        locales={locales || []}
        selected={locale || undefined}
        setLocale={({ code: newLocale }) => {
          console.log(newLocale);
          setLocale(newLocale);
        }}
      />
      <LevelSchemaTree
        levelSchemas={levelSchemas}
        onAdd={(parent) => {
          setAddLevel({ active: true, parent });
        }}
      />
      {addLevel.active && <AddLevel levelSchemas={levelSchemas} parentId={addLevel.parent} />}
    </div>
  );
}
