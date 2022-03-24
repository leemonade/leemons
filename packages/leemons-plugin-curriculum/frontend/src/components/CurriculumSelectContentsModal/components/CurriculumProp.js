/* eslint-disable no-param-reassign */

import React from 'react';
import PropTypes from 'prop-types';
import { Box, Checkbox, InputWrapper, Paragraph, Stack } from '@bubbles-ui/components';
import { isArray, isNil, isString } from 'lodash';

function Value({ item, store, render, property }) {
  console.log(item);
  const key = ``;

  function onChange(e) {}

  return (
    <Stack fullWidth alignItems="start">
      <Checkbox onChange={onChange} />
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
  const values = store.selectedNode.formValues[item.id];
  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
      <InputWrapper label={item.name}>
        {isNil(values) ? '-' : null}
        {isString(values) ? (
          <Value store={store} render={render} item={values} property={item} />
        ) : null}
        {isArray(values)
          ? values.map((value) => (
              <Value store={store} render={render} item={value} property={item} />
            ))
          : null}
      </InputWrapper>
    </Box>
  );
}

CurriculumProp.propTypes = {
  store: PropTypes.object,
  render: PropTypes.func,
  item: PropTypes.object,
};
