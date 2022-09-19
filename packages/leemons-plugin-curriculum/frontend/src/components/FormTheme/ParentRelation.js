import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Box, createStyles, Select, TextInput } from '@bubbles-ui/components';
import { useStore } from '@common';

const useStyle = createStyles((theme) => ({
  card: {
    border: `1px solid ${theme.colors.ui01}`,
    borderRadius: '8px',
    overflow: 'hidden',
    padding: theme.spacing[4],
  },
}));

const ParentRelation = ({ blockData, curriculum, isShow, id, t, ...props }) => {
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

    flatten(curriculum.nodes);
    return result;
  }, [curriculum]);

  const parentNodes = React.useMemo(() => {
    const result = [];

    function getParent(item) {
      if (item.parentNode) {
        const parent = _.find(flatNodes, { id: item.parentNode });
        result.push(parent);
        getParent(parent);
      }
    }

    getParent(_.find(flatNodes, { id }));
    return result;
  }, [flatNodes]);

  const parentRelatedValueText = React.useMemo(() => {
    if (store.parentNodeValue) {
      if (_.isArray(store.parentNodeValue)) {
        return _.find(store.parentNodeValue, { id: props.value?.metadata?.parentRelated })?.value;
      }
      return store.parentNodeValue;
    }
  }, [props.value?.metadata?.parentRelated, store.parentNodeValue]);

  React.useEffect(() => {
    isShow(false);
    if (_.isArray(blockData.contentRelations)) {
      const parent = _.find(blockData.contentRelations, {
        typeOfRelation: 'parent',
      });
      if (parent) {
        const ids = parent.relatedTo.split('|');
        const nodeLevelId = ids[0];
        const formValueId = ids[1];
        const node = _.find(parentNodes, { nodeLevel: nodeLevelId });
        const nodeValue = node.formValues[formValueId];
        if (nodeValue) {
          const nodeLevel = _.find(curriculum.nodeLevels, { id: nodeLevelId });
          store.parentNodeValue = nodeValue.value;
          store.selectParentName = `${nodeLevel.name} - ${node.name}`;
          if (_.isArray(nodeValue.value)) {
            store.type = 'select';
            store.selectData = _.map(nodeValue.value, (v) => ({ label: v.value, value: v.id }));
          } else {
            store.type = 'input';
            onChangeParent(nodeValue.id);
          }
          isShow(true);
          render();
        }
      }
    }
  }, []);

  return (
    <Box sx={(theme) => ({ marginBottom: theme.spacing[4] })}>
      {store.type === 'input' ? (
        <TextInput
          value={parentRelatedValueText}
          readOnly
          label={t('parentBlock', { name: store.selectParentName })}
        />
      ) : null}
      {store.type === 'select' ? (
        <Select
          value={props.value?.metadata?.parentRelated}
          onChange={onChangeParent}
          data={store.selectData}
          label={t('parentBlock', { name: store.selectParentName })}
        />
      ) : null}
    </Box>
  );
};

ParentRelation.propTypes = {
  blockData: PropTypes.any,
  onChange: PropTypes.func,
  curriculum: PropTypes.any,
  value: PropTypes.any,
  id: PropTypes.string,
  t: PropTypes.func,
};

export { ParentRelation };
