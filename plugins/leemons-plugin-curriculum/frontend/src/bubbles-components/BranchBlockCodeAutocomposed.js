import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { forEach } from 'lodash';
import { Box, TagifyInput } from '@bubbles-ui/components';

function BranchBlockCodeAutocomposed({ ...props }) {
  const {
    messages,
    errorMessages,
    selectData,
    form: {
      control,
      formState: { errors },
      watch,
      unregister,
    },
  } = props;

  const whitelist = useMemo(() => {
    const result = [];
    if (selectData.parentNodeLevels) {
      forEach(selectData.parentNodeLevels, (item) => {
        forEach(selectData.nodeLevelsFields[item.value], (subitem) => {
          result.push({
            nodeLevel: item.value,
            field: subitem.value,
            value: `${item.label}:${subitem.label}`,
          });
        });
      });
    }
    return result;
  }, [selectData?.parentNodeLevels, selectData?.nodeLevelsFields]);

  return (
    <Box style={{ position: 'relative' }}>
      <Controller
        name="codeText"
        control={control}
        rules={{
          required: errorMessages.codeNodeLevelRequired,
        }}
        render={({ field }) => (
          <>
            yeeeh
            <TagifyInput
              value={field.value}
              error={errors.codeText}
              onChange={(e) => field.onChange(e.detail.value)}
              settings={{
                mode: 'mix',
                pattern: /@/,
                editTags: false,
                dropdown: {
                  enabled: 1,
                  position: 'text',
                },
                whitelist,
              }}
              label={messages.codeComposerLabel}
              required
            />
          </>
        )}
      />
    </Box>
  );
}

BranchBlockCodeAutocomposed.propTypes = {
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
  selectData: PropTypes.object,
  form: PropTypes.object,
};

export default BranchBlockCodeAutocomposed;
