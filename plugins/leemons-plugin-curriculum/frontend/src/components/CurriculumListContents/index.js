import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from '@bubbles-ui/components';
import { filter, find, forEach, forIn, isArray, map } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@curriculum/helpers/prefixPN';
import { useStore } from '@common';
import { detailCurriculumRequest } from '@curriculum/request';
import { CurriculumTab } from '@curriculum/components/CurriculumSelectContentsModal/components/CurriculumTab';
import { getCurriculumSelectedContentValueByKey } from '@curriculum/helpers/getCurriculumSelectedContentValueByKey';

// eslint-disable-next-line import/prefer-default-export
export function CurriculumListContents({ value, subjects: _subjects }) {
  const subjects = isArray(_subjects) ? _subjects : _subjects ? [_subjects] : _subjects;
  const values = map(value, (val) => getCurriculumSelectedContentValueByKey(val));

  // eslint-disable-next-line no-nested-ternary
  const [t] = useTranslateLoader(prefixPN('selectContentModal'));
  const [t2] = useTranslateLoader('plugins.multilanguage.formWithTheme');
  const [store, render] = useStore({ value });

  function getTreeData() {
    const items = [];

    if (isArray(store.curriculum.nodes) && store.curriculum.nodes.length) {
      const addNodes = (nodes, parent, nextDeep) => {
        forEach(nodes, (node) => {
          const valuesInside = filter(store.value, (val) => val.indexOf(`node.${node.id}`) >= 0);
          items.push({
            id: node.id,
            parent,
            draggable: false,
            text: node.fullName,
            node: {
              ...node,
              valuesInside,
              _nodeLevel: find(store.curriculum.nodeLevels, { id: node.nodeLevel }),
            },
            actions: [
              {
                name: 'badge',
                icon: () =>
                  valuesInside.length ? (
                    <Badge closable={false} label={valuesInside.length} />
                  ) : null,
              },
            ],
          });
          if (node.childrens) {
            addNodes(node.childrens, node.id, nextDeep + 1);
          }
        });
      };
      addNodes(store.curriculum.nodes, 0, 1);
    }
    return items;
  }

  function changeNodeFormValues(nodes) {
    forEach(nodes, (node) => {
      const nodeLevel = find(store.curriculum.nodeLevels, { id: node.nodeLevel });
      forIn(node.formValues, (formValue, key) => {
        formValue._nodeLevelId = node.nodeLevel;
        formValue._nodeId = node.id;
        formValue._blockData =
          nodeLevel.schema.compileJsonSchema.properties[key].frontConfig.blockData;
      });
      if (node.childrens) changeNodeFormValues(node.childrens);
    });
  }

  async function init() {
    try {
      const { curriculum } = await detailCurriculumRequest(values[0].curriculum, {
        withProgram: true,
      });
      store.curriculum = curriculum;
      changeNodeFormValues(store.curriculum.nodes);
      store.treeData = getTreeData();
    } catch (error) {
      console.error(error);
    }
    render();
  }

  React.useEffect(() => {
    if (values && values.length) init();
  }, [JSON.stringify(values)]);

  React.useEffect(() => {
    if (store.curriculum) {
      store.treeData = getTreeData();
      render();
    }
  }, [JSON.stringify(store.value)]);

  React.useEffect(() => {
    store.value = value;
    render();
  }, [JSON.stringify(value)]);

  if (!values.length) return null;

  return (
    <CurriculumTab
      t2={t2}
      hideNoSelecteds
      subjects={subjects}
      t={t}
      store={store}
      render={render}
    />
  );
}

CurriculumListContents.propTypes = {
  value: PropTypes.array,
  subjects: PropTypes.any,
};

CurriculumListContents.defaultProps = {};
