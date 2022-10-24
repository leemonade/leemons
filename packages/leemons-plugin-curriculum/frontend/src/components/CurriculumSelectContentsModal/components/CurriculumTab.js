/* eslint-disable no-param-reassign */

import React from 'react';
import PropTypes from 'prop-types';
import { TabPanel, Tabs } from '@bubbles-ui/components';
import { find, forEach, forIn, groupBy, isArray } from 'lodash';
import { CurriculumProp } from './CurriculumProp';

// eslint-disable-next-line import/prefer-default-export
export function CurriculumTab({ subjects, store, render, t, t2 }) {
  function onSelect({ node }) {
    store.selectedNode = {
      ...node,
      _nodeLevel: find(store.curriculum.nodeLevels, { id: node.nodeLevel }),
      propertiesByType: [],
    };

    // TODO Añadir que se saquen de los padres todos los campos que no esten por algun hijo configurado como padre
    store.selectedNode._formProperties = [];
    if (store.selectedNode._nodeLevel?.schema?.compileJsonSchema) {
      forIn(store.selectedNode._nodeLevel.schema.compileJsonSchema.properties, (value, key) => {
        store.selectedNode._formProperties.push({
          ...value,
          id: key,
        });
      });
    }

    const group = groupBy(
      store.selectedNode._formProperties,
      'frontConfig.blockData.curricularContent'
    );

    forIn(group, (value, key) => {
      store.selectedNode.propertiesByType.push({ value, key });
    });

    render();
  }

  function clearAll() {
    store.value = [];
    render();
  }

  function getNodeByAcademicItem(nodes, academicItem) {
    let item = null;
    forEach(nodes, (node) => {
      if (node.academicItem === academicItem) {
        item = node;
        return false;
      }
      if (node.childrens) {
        item = getNodeByAcademicItem(node.childrens, academicItem);
        if (item) return false;
      }
    });
    return item;
  }

  React.useEffect(() => {
    if (isArray(subjects) && subjects.length && store.curriculum) {
      onSelect({ node: getNodeByAcademicItem(store.curriculum.nodes, subjects[0]) });
    }
  }, [JSON.stringify(subjects), store.curriculum]);

  return (
    <Tabs>
      {store.selectedNode?.propertiesByType.map(({ value, key }) => {
        let count = 0;
        forEach(value, ({ id }) => {
          forEach(store.value, (str) => {
            if (str.indexOf(`property.${store.selectedNode?.formValues[id].id}`) >= 0) count++;
          });
        });
        return (
          <TabPanel key={key} label={t(key)} notification={count || null}>
            {value.map((prop, i) => (
              <CurriculumProp t2={t2} key={i} store={store} render={render} item={prop} />
            ))}
          </TabPanel>
        );
      })}
    </Tabs>
  );

  /*
  return (
    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
      <Box sx={(theme) => ({ marginBottom: theme.spacing[2] })}>
        <Grid columns={100}>
          <Col span={100}>
            <Stack fullWidth alignItems="center" justifyContent="space-between">
              <Title order={6}>{store.curriculumTitle}</Title>
              <Button variant="link" onClick={clearAll}>
                {t('clearAll')}
              </Button>
            </Stack>
          </Col>
        </Grid>
      </Box>
      <Grid columns={100}>

        <Col span={33}>
          <Tree rootId={0} treeData={store.treeData} onSelect={onSelect} />
        </Col>


        <Col span={100}>
          {store.selectedNode
            ? store.selectedNode._formProperties.map((prop, i) => (
                <CurriculumProp t2={t2} key={i} store={store} render={render} item={prop} />
              ))
            : null}
        </Col>
      </Grid>
    </Box>
  );

   */
}

CurriculumTab.propTypes = {
  store: PropTypes.object,
  subjects: PropTypes.any,
  render: PropTypes.func,
  t: PropTypes.func,
  t2: PropTypes.func,
};
