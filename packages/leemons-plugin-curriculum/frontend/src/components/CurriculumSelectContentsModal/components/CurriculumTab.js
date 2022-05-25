/* eslint-disable no-param-reassign */

import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Col, Grid, Stack, Title, Tree } from '@bubbles-ui/components';
import { find, values } from 'lodash';
import { CurriculumProp } from './CurriculumProp';

// eslint-disable-next-line import/prefer-default-export
export function CurriculumTab({ store, render, t }) {
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

  function clearAll() {
    store.value = [];
    render();
  }

  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <Box sx={(theme) => ({ marginBottom: theme.spacing[2] })}>
        <Grid columns={100}>
          <Col span={33}>
            <Stack fullWidth alignItems="center" justifyContent="space-between">
              <Title order={6}>{t('selectFromCurriculum')}</Title>
              <Button variant="link" onClick={clearAll}>
                {t('clearAll')}
              </Button>
            </Stack>
          </Col>
          <Col span={67}></Col>
        </Grid>
      </Box>
      <Grid columns={100}>
        <Col span={33}>
          <Tree rootId={0} treeData={store.treeData} onSelect={onSelect} />
        </Col>
        <Col span={67}>
          {store.selectedNode
            ? store.selectedNode._formProperties.map((prop, i) => (
                <CurriculumProp key={i} store={store} render={render} item={prop} />
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
  t: PropTypes.func,
};
