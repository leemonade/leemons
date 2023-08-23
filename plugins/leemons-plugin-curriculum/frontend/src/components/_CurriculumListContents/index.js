import React from 'react';
import PropTypes from 'prop-types';
import { useStore } from '@common';
import { Box, InputWrapper, Paragraph, Stack, Text } from '@bubbles-ui/components';
import { find, groupBy, isArray, map, values } from 'lodash';
import { getDataForKeysRequest } from '../../request';
import { getCurriculumSelectedContentValueByKey } from '../../helpers/getCurriculumSelectedContentValueByKey';

// eslint-disable-next-line import/prefer-default-export
export function CurriculumListContents({ value }) {
  const [store, render] = useStore({
    groupByNode: [],
  });

  async function init() {
    try {
      const { data } = await getDataForKeysRequest(value);
      store.data = data;
      store.values = map(value, (val) => getCurriculumSelectedContentValueByKey(val));
      store.groupByNode = values(groupBy(store.values, 'node'));
    } catch (error) {
      console.error(error);
    }
    render();
  }

  React.useEffect(() => {
    if (value) init();
  }, [JSON.stringify(value)]);

  return store.groupByNode.map((nodeValues, i) => {
    const nodeLabel = store.data.nodes[nodeValues[0].node].fullName;
    const groupByProperty = values(groupBy(nodeValues, 'property'));
    return (
      <Box key={i} /* sx={(theme) => ({ marginTop: theme.spacing[4] })} */>
        {/* <InputWrapper label={nodeLabel}> */}
        {groupByProperty.map((propertyValues, x) => {
          const propertyLabel =
            store.data.nodeLevels[propertyValues[0].nodeLevel].compileJsonSchema.properties[
              propertyValues[0].property
            ].title;
          return (
            <Box
              key={x}
              sx={(theme) => ({
                marginLeft: theme.spacing[4],
                marginTop: theme.spacing[2],
              })}
            >
              {/* <InputWrapper label={propertyLabel}> */}
              <InputWrapper label={propertyLabel}>
                {propertyValues.map((propertyValue, j) => {
                  const formValue =
                    store.data.nodes[nodeValues[0].node].formValues[propertyValue.property];
                  const formValues = isArray(formValue) ? formValue : [formValue];
                  const item = find(formValues, { id: propertyValue.value });
                  return (
                    <Stack key={j} alignItems="baseline">
                      {item.metadata?.index ? (
                        <Text strong color="primary">{`${item.metadata?.index}`}</Text>
                      ) : null}
                      <Box sx={(theme) => ({ flex: 1, paddingLeft: theme.spacing[3] })}>
                        <Paragraph
                          dangerouslySetInnerHTML={{
                            __html: item.value,
                          }}
                        />
                      </Box>
                    </Stack>
                  );
                })}
              </InputWrapper>
              {/* </InputWrapper> */}
            </Box>
          );
        })}
        {/* </InputWrapper> */}
      </Box>
    );
  });
}

CurriculumListContents.propTypes = {
  value: PropTypes.array,
};

CurriculumListContents.defaultProps = {};
