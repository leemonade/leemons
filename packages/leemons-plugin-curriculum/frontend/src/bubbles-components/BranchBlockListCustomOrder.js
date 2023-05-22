import {
  Box,
  Button,
  createStyles,
  Stack,
  TagifyInput,
  TAGIFY_TAG_REGEX,
} from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/outline';
import { forEach } from 'lodash';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import BranchBlockListCustomOrderFieldOrder, {
  getExampleTextForListOrderedConfig,
} from './BranchBlockListCustomOrderFieldOrder';

const useStyle = createStyles((theme) => ({
  label: {
    width: '100%',
    '> div:first-child': {
      whiteSpace: 'nowrap',
    },
  },
}));

function BranchBlockListCustomOrder({ ...props }) {
  const { classes } = useStyle();
  const [showAddOrder, setShowAddOrder] = useState(false);
  const {
    messages,
    errorMessages,
    selectData,
    withPrevious = true,
    tagifyProps,
    form: {
      control,
      setValue,
      getValues,
      formState: { errors },
      watch,
      unregister,
    },
  } = props;

  const listOrderedText = watch('listOrderedText');

  const whitelist = React.useMemo(() => {
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

  function addOrderField(data) {
    setValue(
      'listOrderedText',
      `${getValues('listOrderedText') || ''} [[${JSON.stringify({
        ...data,
        value: getExampleTextForListOrderedConfig(data),
      })}]]`
    );
  }

  let canAddOrder = true;
  if (listOrderedText) {
    let array;
    while ((array = TAGIFY_TAG_REGEX.exec(listOrderedText)) !== null) {
      if (Object.hasOwnProperty.call(JSON.parse(array[0].slice(2, -2)), 'numberingStyle')) {
        canAddOrder = false;
      }
    }
  }

  return (
    <Box style={{ position: 'relative' }}>
      <Stack fullWidth alignItems="start" spacing={2}>
        <Controller
          name="listOrderedText"
          control={control}
          rules={{
            required: errorMessages.listOrderedTextRequired,
          }}
          render={({ field }) => (
            <TagifyInput
              className={classes.label}
              value={field.value}
              onRemove={(e) => {
                if (e?.detail) field.onChange(e.detail.tagify.getInputValue());
              }}
              onChange={(e) => {
                field.onChange(e.detail.value);
              }}
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
              {...tagifyProps}
            />
          )}
        />
        {canAddOrder ? (
          <Box sx={(theme) => ({ marginTop: theme.spacing[5] })}>
            <Button
              variant="light"
              leftIcon={<AddCircleIcon />}
              onClick={() => setShowAddOrder(true)}
            >
              {messages.addNumeration}
            </Button>
          </Box>
        ) : null}
      </Stack>
      <BranchBlockListCustomOrderFieldOrder
        messages={messages}
        errorMessages={errorMessages}
        selectData={selectData}
        opened={showAddOrder}
        setOpened={setShowAddOrder}
        onSave={addOrderField}
        withPrevious={withPrevious}
      />
    </Box>
  );
}

BranchBlockListCustomOrder.propTypes = {
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
  selectData: PropTypes.object,
  form: PropTypes.object,
  withPrevious: PropTypes.bool,
};

export default BranchBlockListCustomOrder;
