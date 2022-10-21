import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Badge, Box, createStyles, MultiSelect } from '@bubbles-ui/components';
import { htmlToText, useStore } from '@common';

const useStyle = createStyles((theme) => ({
  card: {
    border: `1px solid ${theme.colors.ui01}`,
    borderRadius: '8px',
    overflow: 'hidden',
    padding: theme.spacing[4],
  },
}));

export function getTagRelationSelectData(curriculum, blockData, nodeId) {
  const nodeLevelsById = _.keyBy(curriculum.nodeLevels, 'id');
  const labels = _.filter(blockData.contentRelations, {
    typeOfRelation: 'label',
  });
  const selectData = [];
  const flatNodes = [];

  function flatten(childrens) {
    _.forEach(childrens, (child) => {
      flatNodes.push(child);
      if (_.isArray(child.childrens)) {
        flatten(child.childrens);
      }
    });
  }

  flatten(curriculum.nodes);

  _.forEach(labels, (label) => {
    const ids = label.relatedTo.split('|');
    const nodeLevelId = ids[0];
    const formValueId = ids[1];
    const nodes = _.filter(flatNodes, { nodeLevel: nodeLevelId });
    _.forEach(nodes, (node) => {
      if (node.id !== nodeId) {
        const nodeLevel = nodeLevelsById[node.nodeLevel];
        const nodeLevelName = nodeLevel.schema.compileJsonSchema.properties[formValueId].title;
        const nodeValue = node?.formValues?.[formValueId];

        if (nodeValue) {
          if (_.isArray(nodeValue.value)) {
            _.forEach(nodeValue.value, (val) => {
              selectData.push({
                label: `${node.name}: ${nodeLevelName} - ${htmlToText(val.value)}`,
                value: `${nodeValue.id}|${val.id}`,
              });
            });
          } else if (_.isObject(nodeValue.value)) {
            _.forIn(nodeValue.value, (val) => {
              if (_.isArray(val.value)) {
                _.forEach(val.value, (v) => {
                  selectData.push({
                    label: `${node.name}: ${nodeLevelName} - ${htmlToText(v.value)}`,
                    value: `${nodeValue.id}|${val.id}|${v.id}`,
                  });
                });
              } else if (val.value) {
                selectData.push({
                  label: `${node.name}: ${nodeLevelName} - ${htmlToText(val.value)}`,
                  value: `${nodeValue.id}|${val.id}`,
                });
              }
            });
          } else if (nodeValue.value) {
            selectData.push({
              label: `${node.name}: ${nodeLevelName} - ${htmlToText(nodeValue.value)}`,
              value: nodeValue.id,
            });
          }
        }
      }
    });
  });
  return selectData;
}

const TagRelation = ({ readonly, blockData, curriculum, isShow, id, t, ...props }) => {
  const { classes } = useStyle();
  const [store, render] = useStore();

  function onChangeTags(values) {
    props.onChange(values);
  }

  React.useEffect(() => {
    let show = false;
    if (_.isArray(blockData.contentRelations)) {
      const labels = _.filter(blockData.contentRelations, {
        typeOfRelation: 'label',
      });
      if (labels.length) {
        store.selectData = getTagRelationSelectData(curriculum, blockData, id);
        store.selectDataByValue = _.keyBy(store.selectData, 'value');
        if (store.selectData?.length) {
          show = true;
        }
        render();
      }
    }
    isShow(show);
  }, []);

  return readonly ? (
    <>
      {props.value?.map((val) => {
        if (store.selectDataByValue?.[val]?.label) {
          return (
            <Box sx={(theme) => ({ margin: theme.spacing[1], display: 'inline-block' })}>
              <Badge color="stroke" closable={false} label={store.selectDataByValue[val].label} />
            </Box>
          );
        }
      })}
    </>
  ) : (
    <Box sx={(theme) => ({ marginBottom: theme.spacing[4] })}>
      <MultiSelect
        value={props.value || []}
        onChange={onChangeTags}
        data={store.selectData || []}
        label={t('selectTag')}
      />
    </Box>
  );
};

TagRelation.propTypes = {
  blockData: PropTypes.any,
  onChange: PropTypes.func,
  curriculum: PropTypes.any,
  readonly: PropTypes.boolean,
  isShow: PropTypes.any,
  value: PropTypes.any,
  id: PropTypes.string,
  t: PropTypes.func,
};

export { TagRelation };
