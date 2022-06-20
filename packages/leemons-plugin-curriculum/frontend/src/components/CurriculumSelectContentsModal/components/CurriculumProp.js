/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */

import React from 'react';
import PropTypes from 'prop-types';
import { Box, Checkbox, InputWrapper, Paragraph, Stack, Text } from '@bubbles-ui/components';
import { isArray, isNil } from 'lodash';
import { RatingStarIcon } from '@bubbles-ui/icons/outline';

function Value({ item, store, render, property, showCheckboxs }) {
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
      {showCheckboxs ? (
        <Checkbox checked={store.value?.indexOf(key) >= 0} onChange={onChange} />
      ) : null}
      <Stack alignItems="baseline">
        {item.metadata?.index ? <Text strong>{`${item.metadata?.index}`}</Text> : null}
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
  showCheckboxs: PropTypes.bool,
};

// eslint-disable-next-line import/prefer-default-export
export function CurriculumProp({ store, render, item, showCheckboxs = true }) {
  let values;
  let isEvaluationCriteria = false;
  if (store.selectedNode?.formValues) {
    values = store.selectedNode?.formValues[item.id];
  }
  if (
    store.selectedNode?.nodeLevel?.schema?.compileJsonSchema?.properties?.[item.id]?.frontConfig
      ?.blockData?.evaluationCriteria ||
    store.selectedNode?._nodeLevel?.schema?.compileJsonSchema?.properties?.[item.id]?.frontConfig
      ?.blockData?.evaluationCriteria
  ) {
    isEvaluationCriteria = true;
  }

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
      <InputWrapper
        label={
          <Box>
            {isEvaluationCriteria ? (
              <Box
                sx={(theme) => ({
                  display: 'inline-block',
                  verticalAlign: 'center',
                  marginRight: theme.spacing[2],
                })}
              >
                <RatingStarIcon />
              </Box>
            ) : null}
            {item.title}
          </Box>
        }
      >
        {isNil(values) ? (
          '-'
        ) : isArray(values) ? (
          values.map((value) => (
            <Value
              key={value.id}
              showCheckboxs={showCheckboxs}
              store={store}
              render={render}
              item={value}
              property={item}
            />
          ))
        ) : (
          <Value
            store={store}
            showCheckboxs={showCheckboxs}
            render={render}
            item={values}
            property={item}
          />
        )}
      </InputWrapper>
    </Box>
  );
}

CurriculumProp.propTypes = {
  store: PropTypes.object,
  render: PropTypes.func,
  item: PropTypes.object,
  showCheckboxs: PropTypes.bool,
};
