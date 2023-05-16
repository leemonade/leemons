import { Badge, Box, createStyles, MultiSelect } from '@bubbles-ui/components';
import { ellipsis, htmlToText, useStore } from '@common';
import { getItemTitleNumberedWithParents } from '@curriculum/helpers/getItemTitleNumberedWithParents';
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

  function getGroupItem(itemId) {
    return _.find(blockData.elements, { id: itemId });
  }

  _.forEach(labels, (label) => {
    const ids = label.relatedTo.split('|');
    const nodeLevelId = ids[0];
    const formValueId = ids[1];
    const nodes = _.filter(flatNodes, { nodeLevel: nodeLevelId });

    _.forEach(nodes, (node) => {
      if (node.id !== nodeId) {
        const nodeLevel = nodeLevelsById[node.nodeLevel];
        const _blockData =
          nodeLevel.schema.compileJsonSchema.properties[formValueId].frontConfig.blockData;
        const _nodeValue = node?.formValues?.[formValueId];

        if (_nodeValue) {
          const nodeValues = _.isArray(_nodeValue) ? _nodeValue : [_nodeValue];

          _.forEach(nodeValues, (nodeValue) => {
            if (_.isArray(nodeValue.value)) {
              _.forEach(nodeValue.value, (val, index) => {
                const number = getItemTitleNumberedWithParents(
                  curriculum,
                  _blockData,
                  node.id,
                  nodeValue,
                  index
                );

                const rel = _.find(blockData.contentRelations, ({ relatedTo }) =>
                  relatedTo.indexOf(_blockData.id)
                );
                let text = `${number ? `${number} ` : ''}${htmlToText(val.value)}`;
                if (rel.showNumeration === 'numbering') {
                  text = number;
                } else if (rel.showNumeration === 'content') {
                  text = htmlToText(val.value);
                }
                selectData.push({
                  label: `${ellipsis(text, 36)}`,
                  value: `${nodeValue.id}|${val.id}`,
                });
              });
            } else if (_.isObject(nodeValue.value)) {
              _.forIn(nodeValue.value, (val, k) => {
                if (_.isArray(val.value)) {
                  _.forEach(val.value, (v, index) => {
                    const item = _.find(_blockData.elements, { id: k });
                    const number = getItemTitleNumberedWithParents(
                      curriculum,
                      _blockData,
                      node.id,
                      {
                        ...val,
                        metadata: { ...val?.metadata, parentRelated: val?.metadata?.parentRelated },
                      },
                      index,
                      item
                    );
                    const rel = _.find(blockData.contentRelations, ({ relatedTo }) =>
                      relatedTo.indexOf(_blockData.id)
                    );
                    let text = `${number ? `${number} ` : ''}${htmlToText(v.value)}`;
                    if (rel.showNumeration === 'numbering') {
                      text = number;
                    } else if (rel.showNumeration === 'content') {
                      text = htmlToText(v.value);
                    }
                    selectData.push({
                      label: ellipsis(text, 36),
                      value: `${nodeValue.id}|${val.id}|${v.id}`,
                    });
                  });
                } else if (val.value) {
                  selectData.push({
                    label: ellipsis(`${htmlToText(val.value)}`, 36),
                    value: `${nodeValue.id}|${val.id}`,
                  });
                }
              });
            } else if (nodeValue.value) {
              selectData.push({
                label: ellipsis(`${htmlToText(nodeValue.value)}`, 36),
                value: nodeValue.id,
              });
            }
          });
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
    <>
      {store.selectData?.length ? (
        <Box sx={(theme) => ({ marginBottom: theme.spacing[4] })}>
          <MultiSelect
            value={props.value || []}
            onChange={onChangeTags}
            data={store.selectData || []}
            label={t('selectTag')}
          />
        </Box>
      ) : null}
    </>
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
