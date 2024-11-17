import { Box, createStyles, InputWrapper, Select, TextInput } from '@bubbles-ui/components';
import { htmlToText, useStore } from '@common';
import { getParentNodes } from '@curriculum/helpers/getParentNodes';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

const useStyle = createStyles((theme) => ({
  card: {
    border: `1px solid ${theme.colors.ui01}`,
    borderRadius: '8px',
    overflow: 'hidden',
    padding: theme.spacing[4],
  },
}));

export function getParentNodeIfHave(blockData, parentNodes) {
  if (_.isArray(blockData.contentRelations)) {
    const parent = _.find(blockData.contentRelations, {
      typeOfRelation: 'parent',
    });
    if (parent) {
      const ids = parent.relatedTo.split('|');
      const nodeLevelId = ids[0];
      const formValueId = ids[1];
      const node = _.find(parentNodes, { nodeLevel: nodeLevelId });
      const nodeValue = node?.formValues?.[formValueId];
      return {
        node,
        nodeValue,
        nodeLevelId,
        formValueId,
      };
    }
  }
  return {
    node: null,
    nodeValue: null,
    nodeLevelId: null,
    formValueId: null,
  };
}

const ParentRelation = ({
  children,
  hideLabel,
  blockData,
  curriculum,
  isEditMode = true,
  isShow,
  numbering,
  id,
  t,
  ...props
}) => {
  const { classes } = useStyle();
  const [store, render] = useStore();

  function onChangeParent(nodeValueId) {
    props.onChange({
      ...(props.value || { value: [], metadata: {} }),
      metadata: {
        ...(props.value?.metadata || {}),
        parentRelated: nodeValueId,
      },
    });
  }

  const parentNodes = React.useMemo(() => getParentNodes(curriculum.nodes, id), [curriculum]);

  const parentRelatedValueText = React.useMemo(() => {
    if (store.parentNodeValue) {
      if (store.selectData) {
        const found = _.find(store.selectData, { value: props.value?.metadata?.parentRelated });
        if (found) {
          return found.label;
        }
      }
      if (_.isArray(store.parentNodeValue)) {
        return _.find(store.parentNodeValue, { id: props.value?.metadata?.parentRelated })?.value;
      }
      return store.parentNodeValue;
    }
  }, [props.value?.metadata?.parentRelated, store.parentNodeValue]);

  React.useEffect(() => {
    isShow(false);
    const {
      node,
      nodeValue: _nodeValue,
      nodeLevelId,
      formValueId,
    } = getParentNodeIfHave(blockData, parentNodes);
    if (node && _nodeValue) {
      const nodeLevel = _.find(curriculum.nodeLevels, { id: nodeLevelId });

      store.selectParentName = `${nodeLevel.name} - ${node.name}`;
      const nodeValues = _.isArray(_nodeValue) ? _nodeValue : [_nodeValue];
      store.parentNodeValue = _.flatten(_.map(_nodeValue, 'value'));
      _.forEach(nodeValues, (nodeValue) => {
        if (_.isArray(nodeValue.value)) {
          store.type = 'select';
          store.selectData = _.map(nodeValue.value, (v) => ({
            label: htmlToText(v.value),
            value: v.id,
          }));
        } else if (_.isPlainObject(nodeValue.value)) {
          store.type = 'select';
          store.selectData = [];
          _.forIn(nodeValue.value, (item) => {
            if (_.isArray(item.value)) {
              _.forEach(item.value, (v) => {
                store.selectData.push({
                  label: htmlToText(v.value),
                  value: `${nodeValue.id}|${item.id}|${v.id}`,
                });
              });
            } else {
              store.selectData.push({
                label: htmlToText(item.value),
                value: `${nodeValue.id}|${item.id}`,
              });
            }
          });
        } else {
          store.type = 'input';
          onChangeParent(nodeValue.id);
        }
      });

      isShow(true, {
        node,
        nodeLevel,
        property: nodeLevel.schema.compileJsonSchema.properties[formValueId],
      });
      render();
    }
  }, []);

  React.useEffect(() => {
    if (!props.value?.metadata?.parentRelated && store.selectData?.length) {
      onChangeParent(store.selectData[0].value);
    }
  }, [store.selectData, props.value?.metadata?.parentRelated]);

  function print() {
    if (isEditMode) {
      if (store.type === 'input') {
        return (
          <TextInput
            value={parentRelatedValueText}
            readOnly
            label={hideLabel ? null : t('parentBlock', { name: store.selectParentName })}
          />
        );
      }
      if (store.type === 'select') {
        return (
          <Select
            value={props.value?.metadata?.parentRelated}
            onChange={onChangeParent}
            placeholder={t('selectBlock')}
            data={store.selectData}
            label={hideLabel ? null : t('parentBlock', { name: store.selectParentName })}
          />
        );
      }
    } else {
      if (store.type === 'input' && parentRelatedValueText) {
        return (
          <InputWrapper
            label={hideLabel ? null : t('parentBlock', { name: store.selectParentName })}
          >
            <Box sx={(theme) => ({ paddingBottom: theme.spacing[2] })}>
              {numbering ? `${numbering} ` : ''}
              {parentRelatedValueText}
            </Box>
          </InputWrapper>
        );
      }
      if (store.type === 'select' && props.value?.metadata?.parentRelated) {
        const item = _.find(store.selectData, { value: props.value?.metadata?.parentRelated });
        if (item) {
          return (
            <InputWrapper
              label={hideLabel ? null : t('parentBlock', { name: store.selectParentName })}
            >
              <Box sx={(theme) => ({ paddingBottom: theme.spacing[2] })}>
                {numbering ? `${numbering} ` : ''}
                {item.label}
              </Box>
            </InputWrapper>
          );
        }
        return null;
      }
      return null;
    }
    return null;
  }

  return (
    <>
      <Box sx={(theme) => ({ marginBottom: theme.spacing[4] })}>
        {print()}
        {children ? (
          <Box sx={(theme) => ({ paddingLeft: theme.spacing[4] })}>{children}</Box>
        ) : null}
      </Box>
    </>
  );
};

ParentRelation.propTypes = {
  isEditMode: PropTypes.bool,
  blockData: PropTypes.any,
  onChange: PropTypes.func,
  curriculum: PropTypes.any,
  hideLabel: PropTypes.bool,
  isShow: PropTypes.any,
  children: PropTypes.any,
  numbering: PropTypes.any,
  value: PropTypes.any,
  id: PropTypes.string,
  t: PropTypes.func,
};

export { ParentRelation };
