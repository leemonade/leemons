import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { forEach } from 'lodash';
import { Box, TagifyInput, Button, TAGIFY_TAG_REGEX } from '@bubbles-ui/components';
import BranchBlockListCustomOrderFieldOrder, {
  getExampleTextForListOrderedConfig,
} from './BranchBlockListCustomOrderFieldOrder';

function BranchBlockListCustomOrder({ ...props }) {
  const [showAddOrder, setShowAddOrder] = useState(false);
  const {
    messages,
    errorMessages,
    selectData,
    form: {
      control,
      setValue,
      getValues,
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

  function addOrderField(data) {
    setValue(
      'listOrderedText',
      `${getValues('listOrderedText') || ''} [[${JSON.stringify({
        ...data,
        value: getExampleTextForListOrderedConfig(data),
      })}]]`
    );
  }

  const listOrderedText = watch('listOrderedText');
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
      <Controller
        name="listOrderedText"
        control={control}
        rules={{
          required: errorMessages.listOrderedTextRequired,
        }}
        render={({ field }) => (
          <TagifyInput
            value={field.value}
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
        )}
      />
      {canAddOrder ? (
        <Button onClick={() => setShowAddOrder(true)}>(Test)Añadir numeración</Button>
      ) : null}

      <BranchBlockListCustomOrderFieldOrder
        messages={messages}
        errorMessages={errorMessages}
        selectData={selectData}
        opened={showAddOrder}
        setOpened={setShowAddOrder}
        onSave={addOrderField}
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
};

export default BranchBlockListCustomOrder;
