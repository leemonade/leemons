/* eslint-disable no-param-reassign */

import React from 'react';
import PropTypes from 'prop-types';
import { Box, Col, Grid, Tree } from '@bubbles-ui/components';
import { find, values } from 'lodash';
import { CurriculumProp } from './CurriculumProp';

// eslint-disable-next-line import/prefer-default-export
export function CurriculumTab({ store, render }) {
  function onSelect({ node }) {
    store.selectedNode = {
      ...node,
      _nodeLevel: find(store.curriculum.nodeLevels, { id: node.nodeLevel }),
    };
    store.selectedNode._formProperties = store.selectedNode._nodeLevel?.schema?.compileJsonSchema
      ? values(store.selectedNode._nodeLevel.schema.compileJsonSchema.properties)
      : [];
    render();
  }

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <Grid columns={100}>
        <Col span={30}>
          <Tree rootId={0} treeData={store.treeData} onSelect={onSelect} />
        </Col>
        <Col span={70}>
          {store.selectedNode
            ? store.selectedNode._formProperties.map((prop) => (
                <CurriculumProp key={prop.id} store={store} render={render} item={prop} />
              ))
            : null}
        </Col>
      </Grid>
    </Box>
  );
}

CurriculumTab.propTypes = {
  store: PropTypes.object,
  render: PropTypes.func,
};
