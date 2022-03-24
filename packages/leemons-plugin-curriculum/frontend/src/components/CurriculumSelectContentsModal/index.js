import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionButton,
  Button,
  ContextContainer,
  Modal,
  Stack,
  TabPanel,
  Tabs,
  Title,
} from '@bubbles-ui/components';
import { RemoveIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@curriculum/helpers/prefixPN';
import { useStore } from '@common';
import { forEach, isArray } from 'lodash';
import { detailCurriculumRequest } from '../../request';
import { CurriculumTab } from './components/CurriculumTab';

// eslint-disable-next-line import/prefer-default-export
export function CurriculumSelectContentsModal({
  curriculum: id,
  opened,
  title,
  value,
  onChange,
  onClose,
}) {
  const [t] = useTranslateLoader(prefixPN('selectContentModal'));
  const [store, render] = useStore({ value });

  function getTreeData() {
    const items = [];

    if (isArray(store.curriculum.nodes) && store.curriculum.nodes.length) {
      const addNodes = (nodes, parent, nextDeep) => {
        forEach(nodes, (node) => {
          items.push({
            id: node.id,
            parent,
            draggable: false,
            text: node.fullName,
            node,
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

  async function init() {
    try {
      const { curriculum } = await detailCurriculumRequest(id);
      store.curriculum = curriculum;
      store.treeData = getTreeData();
    } catch (error) {
      console.error(error);
    }
    render();
  }

  React.useEffect(() => {
    if (id) init();
  }, [id]);

  React.useEffect(() => {
    store.value = value;
    render();
  }, [JSON.stringify(value)]);

  return (
    <Modal trapFocus={false} size={1000} withCloseButton={false} opened={opened} onClose={onClose}>
      <ContextContainer>
        <Stack fullWidth justifyContent="space-between">
          <Title order={3}>{title || t('title')}</Title>
          <ActionButton icon={<RemoveIcon />} onClick={onClose} />
        </Stack>

        <Tabs>
          <TabPanel label={t('curriculum')}>
            <CurriculumTab store={store} render={render} />
          </TabPanel>
          <TabPanel label={t('added')}>Miau</TabPanel>
        </Tabs>

        <Stack justifyContent="end">
          <Button>{t('saveButtonLabel')}</Button>
        </Stack>
      </ContextContainer>
    </Modal>
  );
}

CurriculumSelectContentsModal.propTypes = {
  curriculum: PropTypes.string,
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
