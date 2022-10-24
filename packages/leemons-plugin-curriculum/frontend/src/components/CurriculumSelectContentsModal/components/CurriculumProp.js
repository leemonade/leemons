/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Badge,
  Box,
  Checkbox,
  InputWrapper,
  Paragraph,
  Stack,
  TAGIFY_TAG_REGEX,
  Text,
  Title,
} from '@bubbles-ui/components';
import _, { forEach, forIn, isArray, isNil, isObject } from 'lodash';
import { ParentRelation } from '@curriculum/components/FormTheme/ParentRelation';
import { getTagRelationSelectData } from '@curriculum/components/FormTheme/TagRelation';

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

function NewValue({ blockData, showCheckboxs, store, value, render, baseValueId }) {
  const key = `curriculum.${store.curriculum.id}|nodeLevel.${store.selectedNode.nodeLevel}|node.${store.selectedNode.id}|property.${baseValueId}`;

  const flatNodes = React.useMemo(() => {
    const result = [];

    function flatten(childrens) {
      _.forEach(childrens, (child) => {
        result.push(child);
        if (_.isArray(child.childrens)) {
          flatten(child.childrens);
        }
      });
    }

    flatten(store.curriculum.nodes);
    return result;
  }, [store.curriculum]);

  const tags = React.useMemo(() => {
    const results = [];
    if (value.metadata?.tagRelated?.length) {
      const tagValues = getTagRelationSelectData(
        store.curriculum,
        blockData,
        store.selectedNode.id
      );
      const tagValuesByValue = _.keyBy(tagValues, 'value');
      forEach(value.metadata.tagRelated, (tag) => {
        if (tagValuesByValue[tag]) {
          results.push(tagValuesByValue[tag].label);
        }
      });
    }
    return results.map((tag, index) => (
      <Box key={index} sx={(theme) => ({ margin: theme.spacing[1], display: 'inline-block' })}>
        <Badge color="stroke" closable={false} label={tag} />
      </Box>
    ));
  }, [value, flatNodes]);

  function onChange(id) {
    if (!isArray(store.value)) store.value = [];
    const index = store.value.indexOf(id);
    if (index >= 0) {
      store.value.splice(index, 1);
    } else {
      store.value.push(id);
    }
    render();
  }

  function CheckBoxComponent(id, item, title) {
    return (
      <Box>
        <Stack fullWidth alignItems="start">
          {showCheckboxs ? (
            <Checkbox checked={store.value?.indexOf(id) >= 0} onChange={() => onChange(id)} />
          ) : null}
          <Stack sx={() => ({ marginTop: 6 })} alignItems="center">
            {item.metadata?.index ? (
              <Text role="productive" color="primary" strong>{`${item.metadata?.index}`}</Text>
            ) : null}
            <Box sx={(theme) => ({ flex: 1 })}>
              <Text
                strong
                color="primary"
                role="productive"
                dangerouslySetInnerHTML={{
                  __html: title || item.value,
                }}
              />
            </Box>
          </Stack>
        </Stack>
        {title ? (
          <Box
            sx={(theme) => ({
              paddingLeft: theme.spacing[2],
              marginTop: -2,
              marginBottom: theme.spacing[1],
            })}
          >
            <Text
              role="productive"
              dangerouslySetInnerHTML={{
                __html: item.value,
              }}
            />
          </Box>
        ) : null}
      </Box>
    );
  }

  function getGroupTitle(itemId) {
    let finalText = blockData.showAs;
    let array;
    const item = _.find(blockData.elements, { id: itemId });
    // eslint-disable-next-line no-cond-assign
    while ((array = TAGIFY_TAG_REGEX.exec(blockData.showAs)) !== null) {
      const json = JSON.parse(array[0])[0][0];
      finalText = finalText.replace(array[0], item[json.id]);
    }
    return finalText;
  }

  if (isObject(value)) {
    if (value.id) {
      // Listado
      return (
        <Box>
          {CheckBoxComponent(`${key}|value.${value.id}`, value)}
          {tags}
        </Box>
      );
    }
    // Grupo
    const toReturn = [];
    forIn(value, (val, k) => {
      const checks = [];
      if (isArray(val.value)) {
        const che = [];
        forEach(val.value, (v) => {
          che.push(CheckBoxComponent(`${key}|value.${val.id}|value2.${v.id}`, v));
        });
        checks.push(
          <Box>
            <Text
              strong
              color="primary"
              role="productive"
              dangerouslySetInnerHTML={{
                __html: getGroupTitle(k),
              }}
            />
            {che}
          </Box>
        );
      } else {
        checks.push(CheckBoxComponent(`${key}|value.${val.id}`, val, getGroupTitle(k)));
      }
      toReturn.push(
        <Box>
          {checks}
          {tags}
        </Box>
      );
    });
    return toReturn;
  }
  // Texto
  return (
    <Box>
      {CheckBoxComponent(key, value)}
      {tags}
    </Box>
  );
}

NewValue.propTypes = {
  value: PropTypes.any,
  store: PropTypes.object,
  render: PropTypes.func,
  blockData: PropTypes.any,
  baseValueId: PropTypes.string,
  showCheckboxs: PropTypes.bool,
};

// eslint-disable-next-line import/prefer-default-export
export function CurriculumProp({ t2, store, render, item, showCheckboxs = true }) {
  const [parentProperty, setParentProperty] = React.useState(null);

  let values;
  if (store.selectedNode?.formValues) {
    values = store.selectedNode?.formValues[item.id];
  }

  function onParentFound(show, { property } = {}) {
    if (show && property) setParentProperty(property);
  }

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
      <InputWrapper
        label={
          <Title
            order={6}
            sx={(theme) => ({ marginTop: theme.spacing[2], marginBottom: theme.spacing[2] })}
          >
            {parentProperty ? `${parentProperty.title} & ` : ''}
            {item.title}
          </Title>
        }
      >
        {isNil(values) ? (
          '-'
        ) : (
          <>
            <ParentRelation
              curriculum={store.curriculum}
              blockData={item.frontConfig.blockData}
              value={values}
              onChange={() => {}}
              isShow={onParentFound}
              id={store.selectedNode.id}
              hideLabel
              t={t2}
            >
              {isArray(values.value) ? (
                values.value.map((value, index) => (
                  <NewValue
                    key={index}
                    render={render}
                    store={store}
                    baseValueId={values.id}
                    value={value}
                    blockData={item.frontConfig.blockData}
                    showCheckboxs={showCheckboxs}
                  />
                ))
              ) : (
                <NewValue
                  render={render}
                  store={store}
                  baseValueId={values.id}
                  value={values.value}
                  blockData={item.frontConfig.blockData}
                  showCheckboxs={showCheckboxs}
                />
              )}
            </ParentRelation>
          </>
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
  t2: PropTypes.func,
};
