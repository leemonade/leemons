/* eslint-disable no-param-reassign */

import { TabPanel, Tabs } from '@bubbles-ui/components';
import { PluginSubjectsIcon } from '@bubbles-ui/icons/outline';
import { CutStarIcon, StarIcon } from '@bubbles-ui/icons/solid';
import { getParentNodes } from '@curriculum/helpers/getParentNodes';
import _, { filter, find, forEach, forIn, groupBy, isArray } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { CurriculumProp } from './CurriculumProp';

// eslint-disable-next-line import/prefer-default-export
export function CurriculumTab({ subjects, hideNoSelecteds, store, render, t, t2 }) {
  function onSelect({ node }) {
    // console.log(node);
    store.selectedNode = {
      ...node,
      _nodeLevel: find(store.curriculum.nodeLevels, { id: node.nodeLevel }),
      propertiesByType: [],
    };

    const parentsCantUse = [];

    // Sacamos los campos del nodo seleccionado
    store.selectedNode._formProperties = [];
    if (store.selectedNode._nodeLevel?.schema?.compileJsonSchema) {
      forIn(store.selectedNode._nodeLevel.schema.compileJsonSchema.properties, (value, key) => {
        const parentEl = find(value.frontConfig.blockData.contentRelations, {
          typeOfRelation: 'parent',
        });
        if (parentEl) parentsCantUse.push(parentEl.relatedTo.split('|')[1]);
        store.selectedNode._formProperties.push({
          ...value,
          id: key,
        });
      });
    }

    // Sacamos todos los padres y nos los recorremos sacando tambien sus campos
    const parentNodes = getParentNodes(store.curriculum.nodes, store.selectedNode.id);
    forEach(parentNodes, (parent) => {
      store.selectedNode.formValues = {
        ...store.selectedNode.formValues,
        ...parent.formValues,
      };
      const nodeLevel = find(store.curriculum.nodeLevels, { id: parent.nodeLevel });
      if (nodeLevel?.schema?.compileJsonSchema) {
        forIn(nodeLevel.schema.compileJsonSchema.properties, (value, key) => {
          const parentEl = find(value.frontConfig.blockData.contentRelations, {
            typeOfRelation: 'parent',
          });
          if (parentEl) parentsCantUse.push(parentEl.relatedTo.split('|')[1]);
          store.selectedNode._formProperties.push({
            ...value,
            id: key,
          });
        });
      }
    });

    // Filtramos los capos y quitamos los que esten relacionados como padres
    store.selectedNode._formProperties = filter(
      store.selectedNode._formProperties,
      (prop) => parentsCantUse.indexOf(prop.id) < 0
    );

    // Agrupamos por tipo de contenido para mostrarlo en tabs
    const group = groupBy(
      store.selectedNode._formProperties,
      'frontConfig.blockData.curricularContent'
    );
    forIn(group, (value, key) => {
      store.selectedNode.propertiesByType.push({ value, key });
    });

    store.selectedNode.propertiesByType = _.filter(
      store.selectedNode.propertiesByType,
      ({ key }) => key !== 'non-qualifying-criteria'
    );

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
      const node = getNodeByAcademicItem(store.curriculum.nodes, subjects[0]);
      if (node) onSelect({ node });
    }
  }, [JSON.stringify(subjects), store.curriculum]);

  function getIcon(curricularContent) {
    switch (curricularContent) {
      case 'knowledges':
        return <PluginSubjectsIcon />;
      case 'qualifying-criteria':
        return <StarIcon />;
      case 'non-qualifying-criteria':
        return <CutStarIcon />;
      default:
        return null;
    }
  }

  return (
    <Tabs
      onChange={(e) => {
        store.currentTab = e;
      }}
    >
      {store.selectedNode?.propertiesByType.map(({ value, key }) => {
        let count = 0;
        forEach(value, ({ id }) => {
          forEach(store.value, (str) => {
            if (_.isArray(store.selectedNode?.formValues[id])) {
              forEach(store.selectedNode?.formValues[id], (v, i) => {
                if (str.indexOf(`property.${store.selectedNode?.formValues[id][i]?.id}`) >= 0)
                  count++;
              });
            } else if (str.indexOf(`property.${store.selectedNode?.formValues[id]?.id}`) >= 0)
              count++;
          });
        });
        return (
          <TabPanel key={key} label={t(key)} rightIcon={getIcon(key)} notification={count || null}>
            {value.map((prop, i) => (
              <CurriculumProp
                hideNoSelecteds={hideNoSelecteds}
                showCheckboxs={!hideNoSelecteds}
                t2={t2}
                key={i}
                store={store}
                render={render}
                item={prop}
              />
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
  hideNoSelecteds: PropTypes.bool,
};
