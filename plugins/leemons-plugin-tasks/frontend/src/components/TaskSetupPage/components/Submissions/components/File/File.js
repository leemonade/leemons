import React from 'react';
import _ from 'lodash';
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
  const {
    control,
    formState: { errors },
  } = useFormContext();
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
        rules={{
          validate: (value) => {
            if (_.isEmpty(value)) {
              return labels?.required;
            }
          },
        }}
        render={({ field }) => (
          <TagsInput
            {...field}
            value={field.value ? Object.keys(field.value) : []}
            required
            error={errors.data?.extensions}
            onChange={(extensions) => {
              const validExtensions = extensions.reduce((values, extension) => {
                if (field.value && field.value[extension]) {
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
            label={labels?.format}
            placeholder={labels?.formatPlaceholder}
          />
        )}
      />
      <Stack direction="row" alignItems="end">
        <Controller
          control={control}
          name="data.maxSize"
          rules={{
            validate: (value) => {
              if (value <= 0 || !value) {
                return labels?.required;
              }
            },
          }}
          render={({ field }) => (
            <NumberInput
              {...field}
              required
              error={errors.data?.maxSize}
              label={`${labels?.maxSize} (MB)`}
            />
          )}
        />
      </Stack>
    </ContextContainer>
  );
}

File.propTypes = {
  labels: PropTypes.shape({
    multiFile: PropTypes.string,
    format: PropTypes.string,
    formatPlaceholder: PropTypes.string,
    maxSize: PropTypes.string,
  }),
};
