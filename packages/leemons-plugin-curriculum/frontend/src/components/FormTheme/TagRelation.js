import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Box, createStyles, MultiSelect } from '@bubbles-ui/components';
import { useStore } from '@common';

const useStyle = createStyles((theme) => ({
  card: {
    border: `1px solid ${theme.colors.ui01}`,
    borderRadius: '8px',
    overflow: 'hidden',
    padding: theme.spacing[4],
  },
}));

const TagRelation = ({ blockData, curriculum, isShow, id, t, ...props }) => {
  const { classes } = useStyle();
  const [store, render] = useStore();

  function onChangeTags(values) {
    console.log(values);
    /*
    props.onChange({
      ...(props.value || { value: [], metadata: {} }),
      metadata: {
        ...(props.value?.metadata || {}),
        parentRelated: nodeValueId,
      },
    });

     */
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

  React.useEffect(() => {
    let show = false;
    if (_.isArray(blockData.contentRelations)) {
      const labels = _.filter(blockData.contentRelations, {
        typeOfRelation: 'label',
      });
      if (labels.length) {
        _.forEach(labels, (label) => {
          const ids = label.relatedTo.split('|');
          const nodeLevelId = ids[0];
          const formValueId = ids[1];
          const nodes = _.filter(flatNodes, { nodeLevel: nodeLevelId });

          _.forEach(nodes, (node) => {
            if (node.id !== id) {
              const nodeValue = node?.formValues?.[formValueId];

              if (nodeValue) {
                // console.log(nodeValue);
                show = true;
                render();
              }
            }
          });
        });
      }
    }
    isShow(show);
  }, []);

  return (
    <Box sx={(theme) => ({ marginBottom: theme.spacing[4] })}>
      <MultiSelect
        value={props.value?.metadata?.tagRelated}
        onChange={onChangeTags}
        data={store.selectData || []}
        label={t('parentBlock', { name: store.selectParentName })}
      />
    </Box>
  );
};

TagRelation.propTypes = {
  blockData: PropTypes.any,
  onChange: PropTypes.func,
  curriculum: PropTypes.any,
  value: PropTypes.any,
  id: PropTypes.string,
  t: PropTypes.func,
};

export { TagRelation };
