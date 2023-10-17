/* eslint-disable no-param-reassign */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Checkbox,
  InputWrapper,
  Paragraph,
  Stack,
  Title,
} from '@bubbles-ui/components';
import { filter, find, groupBy, isArray, map, remove, values } from 'lodash';
import { getCurriculumSelectedContentValueByKey } from '../../../helpers/getCurriculumSelectedContentValueByKey';

// eslint-disable-next-line import/prefer-default-export
export function CurriculumAdded({ store, render, t }) {
  function getKeyValues(key) {
    return getCurriculumSelectedContentValueByKey(key);
  }

  function clearAll() {
    store.value = [];
    store.selectedToRemove = [];
    render();
  }

  function clearSelected() {
    store.value = remove(store.value, (val) => store.selectedToRemove.indexOf(val) < 0);
    store.selectedToRemove = [];
    render();
  }

  function onChange(key) {
    if (!isArray(store.selectedToRemove)) store.selectedToRemove = [];
    const index = store.selectedToRemove.indexOf(key);
    if (index >= 0) {
      store.selectedToRemove.splice(index, 1);
    } else {
      store.selectedToRemove.push(key);
    }
    render();
  }

  const nodesWithValues = map(
    filter(store.treeData, (item) => item.node.valuesInside.length >= 1),
    'node'
  );

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <Title order={6}>{store.curriculumTitle}</Title>
      <Stack>
        <Box>
          <Button variant="link" onClick={clearSelected}>
            {t('clearSelected')}{' '}
            {store.selectedToRemove?.length ? `(${store.selectedToRemove.length})` : null}
          </Button>
        </Box>
        <Box sx={(theme) => ({ marginLeft: theme.spacing[8] })}>
          <Button variant="link" onClick={clearAll}>
            {t('clearAll')}
          </Button>
        </Box>
      </Stack>
      <Box sx={(theme) => ({ marginLeft: theme.spacing[4], marginTop: theme.spacing[4] })}>
        {nodesWithValues.map((node, i) => {
          const keyValues = map(node.valuesInside, (key) => getKeyValues(key));
          const keyValuesByProperty = values(groupBy(keyValues, 'property'));
          return (
            <Box sx={(theme) => ({ marginTop: theme.spacing[4] })} key={i}>
              <InputWrapper label={node.fullName}>
                {keyValuesByProperty.map((vals) => {
                  const property =
                    node._nodeLevel.schema.compileJsonSchema.properties[vals[0].property];
                  return (
                    <Box
                      key={i}
                      sx={(theme) => ({
                        marginLeft: theme.spacing[4],
                        marginTop: theme.spacing[2],
                      })}
                    >
                      <InputWrapper key={node} label={property.title}>
                        {vals.map((value, x) => {
                          const propValues = node.formValues[value.property];
                          let item = {};
                          if (isArray(propValues)) {
                            item = find(propValues, { id: value.value });
                          } else {
                            item = propValues;
                          }
                          return (
                            <Stack key={x} alignItems="start">
                              <Checkbox
                                checked={store.selectedToRemove?.indexOf(value.key) >= 0}
                                onChange={() => onChange(value.key)}
                              />
                              <Stack alignItems="baseline">
                                {item.metadata?.index ? (
                                  <Paragraph>{`${item.metadata?.index}`}</Paragraph>
                                ) : null}
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
                        })}
                      </InputWrapper>
                    </Box>
                  );
                })}
              </InputWrapper>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

CurriculumAdded.propTypes = {
  store: PropTypes.object,
  render: PropTypes.func,
  t: PropTypes.func,
};
