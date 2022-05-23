import React from 'react';
import mime from 'mime';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import {
  Checkbox,
  TagsInput,
  NumberInput,
  Stack,
  Text,
  ContextContainer,
} from '@bubbles-ui/components';

export default function File({ labels }) {
  const { control } = useFormContext();
  return (
    <ContextContainer>
      <Controller
        control={control}
        name="data.multipleFiles"
        render={({ field }) => (
          <Checkbox {...field} checked={field.value} label={labels?.multiFile} />
        )}
      />
      <Controller
        control={control}
        name="data.extensions"
        render={({ field }) => (
          <TagsInput
            {...field}
            value={Object.keys(field.value)}
            onChange={(extensions) => {
              const validExtensions = extensions.reduce((values, extension) => {
                if (field.value[extension]) {
                  return {
                    ...values,
                    [extension]: field.value[extension],
                  };
                }
                const type = mime.getType(extension);
                const ext = mime.getExtension(extension);

                if (type) {
                  return {
                    ...values,
                    [extension]: type,
                  };
                }
                if (ext) {
                  return {
                    ...values,
                    [extension]: extension,
                  };
                }

                return {
                  ...values,
                  [extension]: extension,
                };
              }, {});

              field.onChange(validExtensions);
            }}
            label={labels?.type}
            placeholder={labels?.typePlaceholder}
          />
        )}
      />
      <Stack direction="row" alignItems="end">
        <Controller
          control={control}
          name="data.maxSize"
          render={({ field }) => <NumberInput {...field} label={labels?.maxSize} />}
        />
        <Text>MB</Text>
      </Stack>
    </ContextContainer>
  );
}

File.propTypes = {
  labels: PropTypes.shape({
    multiFile: PropTypes.string,
    type: PropTypes.string,
    typePlaceholder: PropTypes.string,
    maxSize: PropTypes.string,
  }),
};
