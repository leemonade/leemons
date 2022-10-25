/* eslint-disable no-param-reassign */
import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionButton,
  Badge,
  Button,
  ContextContainer,
  Modal,
  Stack,
  Title,
} from '@bubbles-ui/components';
import { RemoveIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@curriculum/helpers/prefixPN';
import { useStore } from '@common';
import { filter, find, forEach, forEachRight, forIn, isArray } from 'lodash';
import { detailCurriculumRequest } from '../../request';
import { CurriculumTab } from './components/CurriculumTab';

// eslint-disable-next-line import/prefer-default-export
export function CurriculumSelectContentsModal({
  curriculum: id,
  subjects: _subjects,
  opened,
  title,
  value,
  onChange,
  onClose,
}) {
  // eslint-disable-next-line no-nested-ternary
  const subjects = isArray(_subjects) ? _subjects : _subjects ? [_subjects] : _subjects;
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
      const { curriculum } = await detailCurriculumRequest(id, { withProgram: true });
      store.curriculum = curriculum;

      changeNodeFormValues(store.curriculum.nodes);

      let course = null;
      const subject = find(store.curriculum.program.subjects, { id: subjects[0] });

      if (subject && subject.course) {
        course = find(store.curriculum.program.courses, { id: subject.course });
      }
      store.curriculumTitle = `${course ? `${course.index}º ` : ''}${
        store.curriculum.program.name
      } ${subject ? `- ${subject.name}` : ''}`;
      store.treeData = getTreeData();
    } catch (error) {
      console.error(error);
    }
    render();
  }

  function unSelect() {
    const properties = store.currentTab
      ? find(store.selectedNode.propertiesByType, { key: store.currentTab })
      : store.selectedNode.propertiesByType[0];
    forEach(properties.value, (prop) => {
      forEachRight(store.value, (str, index) => {
        if (str.indexOf(`property.${store.selectedNode?.formValues[prop.id].id}`) >= 0) {
          store.value.splice(index, 1);
        }
      });
    });
    render();
  }

  React.useEffect(() => {
    if (id) init();
  }, [id]);

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

  return (
    <Modal trapFocus={false} size={1000} withCloseButton={false} opened={opened} onClose={onClose}>
      <ContextContainer>
        <Stack fullWidth justifyContent="space-between">
          <Title order={3}>{title || store.curriculum?.name || ''}</Title>
          <ActionButton icon={<RemoveIcon />} onClick={onClose} />
        </Stack>

        <CurriculumTab t2={t2} subjects={subjects} t={t} store={store} render={render} />

        <Stack justifyContent="space-between">
          <Button variant="light" onClick={unSelect}>
            {t('unSelect')}
          </Button>
          <Button onClick={() => onChange(store.value)}>{t('saveButtonLabel')}</Button>
        </Stack>
      </ContextContainer>
    </Modal>
  );
}

CurriculumSelectContentsModal.propTypes = {
  curriculum: PropTypes.string,
  subjects: PropTypes.any,
  opened: PropTypes.bool,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  title: PropTypes.string,
  value: PropTypes.array,
};

CurriculumSelectContentsModal.defaultProps = {
  opened: false,
  onChange: () => {},
  onClose: () => {},
};
