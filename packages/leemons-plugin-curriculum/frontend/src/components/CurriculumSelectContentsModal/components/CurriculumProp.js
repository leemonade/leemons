/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */

import React from 'react';
import PropTypes from 'prop-types';
import { Box, Checkbox, InputWrapper, Paragraph, Stack } from '@bubbles-ui/components';
import { isArray, isNil } from 'lodash';

function Value({ item, store, render, property }) {
  const key = `curriculum.${store.curriculum.id}|nodeLevel.${store.selectedNode.nodeLevel}|node.${store.selectedNode.id}|property.${property.id}|value.${item.id}`;

  function onChange() {
    if (!isArray(store.value)) store.value = [];
    const index = store.value.indexOf(key);
    if (index >= 0) {
      store.value.splice(index, 1);
    } else {
      store.value.push(key);
    }
    render();
  }

  return (
    <Stack fullWidth alignItems="start">
      <Checkbox checked={store.value?.indexOf(key) >= 0} onChange={onChange} />
      <Stack alignItems="baseline">
        {item.metadata?.index ? <Paragraph>{`${item.metadata?.index}`}</Paragraph> : null}
        <Box sx={(theme) => ({ flex: 1, paddingLeft: theme.spacing[3] })}>
          <Paragraph
            dangerouslySetInnerHTML={{
              __html: item.value,
            }}
          />
        </Box>
      </Stack>
    </Stack>
  );
}

Value.propTypes = {
  store: PropTypes.object,
  render: PropTypes.func,
  item: PropTypes.any,
  property: PropTypes.any,
};

// eslint-disable-next-line import/prefer-default-export
export function CurriculumProp({ store, render, item }) {
  let values;
  if (store.selectedNode?.formValues) {
    values = store.selectedNode?.formValues[item.id];
  }
  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
      <InputWrapper label={item.title}>
        {isNil(values) ? (
          '-'
        ) : isArray(values) ? (
          values.map((value) => (
            <Value key={value.id} store={store} render={render} item={value} property={item} />
          ))
        ) : (
          <Value store={store} render={render} item={values} property={item} />
        )}
      </InputWrapper>
    </Box>
  );
}

CurriculumProp.propTypes = {
  store: PropTypes.object,
  render: PropTypes.func,
  item: PropTypes.object,
};
