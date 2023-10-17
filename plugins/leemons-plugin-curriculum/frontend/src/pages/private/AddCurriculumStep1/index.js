import React from 'react';
import PropTypes from 'prop-types';
import { forEach, map } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@curriculum/helpers/prefixPN';
import { FolderIcon } from '@bubbles-ui/icons/outline';
import {
  Box,
  Button,
  Checkbox,
  ContextContainer,
  InputWrapper,
  Stack,
  Tree,
  useTree,
} from '@bubbles-ui/components';
import { useHistory } from 'react-router-dom';
import { useStore } from '@common';
import { addNodeLevelsRequest } from '../../../request';

function AddCurriculumStep1({ curriculum, onNext }) {
  const [t, translations] = useTranslateLoader(prefixPN('addCurriculumStep1'));
  const defaultNodeLevels = [];
  defaultNodeLevels[0] = 'program';
  defaultNodeLevels[10] = 'subject';
  const [store, render] = useStore({
    loading: true,
    saving: false,
    nodeLevels: defaultNodeLevels,
  });

  const tree = useTree();
  const history = useHistory();

  function onCheckboxChange(event, nodeLevel, levelOrder) {
    if (event) {
      store.nodeLevels[levelOrder] = nodeLevel;
    } else {
      delete store.nodeLevels[levelOrder];
    }
    render();
  }

  React.useEffect(() => {
    let parent = 0;
    const treeData = [];
    treeData.push({
      id: parent + 1,
      parent,
      draggable: false,
      text: (
        <InputWrapper
          label={
            <>
              <Box
                sx={(theme) => ({
                  marginRight: theme.spacing[2],
                  display: 'inline-block',
                  verticalAlign: 'middle',
                })}
              >
                <FolderIcon />
              </Box>
              {t('program')}
            </>
          }
        />
      ),
    });
    parent++;
    if (curriculum.program.haveKnowledge) {
      treeData.push({
        id: parent + 1,
        parent,
        draggable: false,
        text: (
          <Checkbox
            label={t('knowledges')}
            checked={store.nodeLevels.indexOf('knowledges') >= 0}
            onChange={(e) => {
              onCheckboxChange(e, 'knowledges', 1);
            }}
          />
        ),
      });
      parent++;
    }

    treeData.push({
      id: parent + 1,
      parent,
      draggable: false,
      text: (
        <Checkbox
          label={t('subjectType')}
          checked={store.nodeLevels.indexOf('subjectType') >= 0}
          onChange={(e) => {
            onCheckboxChange(e, 'subjectType', 2);
          }}
        />
      ),
    });
    parent++;

    if (curriculum.program.cycles?.length) {
      treeData.push({
        id: parent + 1,
        parent,
        draggable: false,
        text: (
          <Checkbox
            label={t('cycles')}
            checked={store.nodeLevels.indexOf('cycles') >= 0}
            onChange={(e) => {
              onCheckboxChange(e, 'cycles', 3);
            }}
          />
        ),
      });
      parent++;
    }
    if (curriculum.program.courses.length) {
      treeData.push({
        id: parent + 1,
        parent,
        draggable: false,
        text: (
          <Checkbox
            label={t('courses')}
            checked={store.nodeLevels.indexOf('courses') >= 0}
            onChange={(e) => {
              onCheckboxChange(e, 'courses', 4);
            }}
          />
        ),
      });
      parent++;
    }

    treeData.push({
      id: parent + 1,
      parent,
      draggable: false,
      text: (
        <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
          <InputWrapper label={t('subject')} />
        </Box>
      ),
    });
    parent++;

    tree.setTreeData(treeData);
  }, [translations, store.nodeLevels, curriculum]);

  async function save() {
    try {
      store.saving = true;
      render();
      const toSend = [];
      forEach(store.nodeLevels, (nodeLevel) => {
        if (nodeLevel) {
          toSend.push({
            name: t(nodeLevel),
            type: nodeLevel,
            listType: 'not-ordered',
            levelOrder: toSend.length,
          });
        }
      });
      await addNodeLevelsRequest(curriculum.id, toSend);
      onNext();
    } catch (e) {
      // Nothing
    }
    store.saving = false;
    render();
  }

  return (
    <ContextContainer title={t('title')} description={t('description')} divided>
      <Box>
        <ContextContainer>
          <Tree
            {...tree}
            rootId={0}
            initialOpen={map(tree.treeData, 'id')}
            canToggleItems={false}
            canSelectItems={false}
          />
        </ContextContainer>
      </Box>
      <Stack justifyContent="end">
        <Button onClick={save} loading={store.saving} type="submit">
          {t('saveButtonLabel')}
        </Button>
      </Stack>
    </ContextContainer>
  );
}

AddCurriculumStep1.propTypes = {
  curriculum: PropTypes.any,
  onNext: PropTypes.func,
};

export default AddCurriculumStep1;
