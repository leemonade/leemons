import * as _ from 'lodash';
import { useMemo } from 'react';
import { FormControl, Select } from 'leemons-ui';

export default function LevelSchemaSelect({
  levelSchema,
  isFirstLevel = true,
  values = [],
  parentValue = null,
  onChange = () => {},
}) {
  const [value, ...restOfValues] = values;

  const levels = useMemo(() => {
    return _.filter(levelSchema.levels, { parent: parentValue?.id || null });
  }, [levelSchema, parentValue]);

  const onSelectChange = (ev) => {
    if (ev.target.value === '_') {
      onChange([]);
    } else {
      onChange([_.find(levels, { id: ev.target.value })]);
    }
  };

  const onChildChange = (ev) => {
    onChange([value, ...ev]);
  };

  return (
    <>
      <FormControl label={levelSchema.name}>
        <Select
          outlined
          value={value?.id || '_'}
          disabled={!isFirstLevel && !parentValue}
          onChange={onSelectChange}
        >
          <option value="_">{levelSchema.name}</option>

          {levels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.name}
            </option>
          ))}
        </Select>
      </FormControl>
      {levelSchema.childSchemas && levelSchema.childSchemas.length ? (
        <LevelSchemaSelect
          isFirstLevel={false}
          levelSchema={levelSchema.childSchemas[0]}
          values={restOfValues}
          parentValue={value}
          onChange={onChildChange}
        />
      ) : null}
    </>
  );
}
