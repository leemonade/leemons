import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Checkbox, TagsInput, NumberInput, Stack, Text } from '@bubbles-ui/components';

export default function File() {
  const { control } = useFormContext();
  return (
    <>
      <Controller
        control={control}
        name="data.multipleFiles"
        render={({ field }) => <Checkbox {...field} label="Allow multiple files" />}
      />
      <Controller
        control={control}
        name="data.extensions"
        render={({ field }) => <TagsInput {...field} label="Type" placeholder="Add extension" />}
      />
      <Stack direction="row">
        <Controller
          control={control}
          name="data.maxSize"
          render={({ field }) => <NumberInput {...field} label="Max size" />}
        />
        <Text>Kb</Text>
      </Stack>
    </>
  );
}
