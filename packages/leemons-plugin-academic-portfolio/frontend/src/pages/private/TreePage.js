import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Col,
  ContextContainer,
  Grid,
  PageContainer,
  Paper,
  Tree,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { SelectCenter } from '@users/components/SelectCenter';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { useQuery, useStore } from '@common';
import { find, map } from 'lodash';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import SelectProgram from '../../components/Selectors/SelectProgram';
import {
  getProgramTreeRequest,
  listSubjectCreditsForProgramRequest,
  updateCourseRequest,
  updateGroupRequest,
  updateKnowledgeRequest,
  updateProgramRequest,
  updateSubjectTypeRequest,
} from '../../request';
import { TreeProgramDetail } from '../../components/Tree/TreeProgramDetail';
import { getTreeProgramDetailTranslation } from '../../helpers/getTreeProgramDetailTranslation';
import { getTreeCourseDetailTranslation } from '../../helpers/getTreeCourseDetailTranslation';
import { TreeCourseDetail } from '../../components/Tree/TreeCourseDetail';
import { TreeGroupDetail } from '../../components/Tree/TreeGroupDetail';
import { getTreeGroupDetailTranslation } from '../../helpers/getTreeGroupDetailTranslation';
import { TreeSubjectTypeDetail } from '../../components/Tree/TreeSubjectTypeDetail';
import { getTreeSubjectTypeDetailTranslation } from '../../helpers/getTreeSubjectTypeDetailTranslation';
import { getTreeKnowledgeDetailTranslation } from '../../helpers/getTreeKnowledgeDetailTranslation';
import { TreeKnowledgeDetail } from '../../components/Tree/TreeKnowledgeDetail';

export default function TreePage() {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('tree_page'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [store, render] = useStore();

  const params = useQuery();

  async function onEdit(item) {
    console.log(item);
    store.editingItem = item;
    render();
  }

  async function getProgramTree() {
    const [{ tree }, { subjectCredits }] = await Promise.all([
      getProgramTreeRequest(store.programId),
      listSubjectCreditsForProgramRequest(store.programId),
    ]);

    const result = [];

    const editLabel = t('treeEdit');

    function processItem(item, parents, parentId, childIndex) {
      let text = item.value.name;
      if (item.nodeType === 'courses') {
        text = item.value.name
          ? `${item.value.name} (${item.value.index}º)`
          : `${item.value.index}º`;
      }
      if (item.nodeType === 'class') {
        const classSubjectCredits = find(subjectCredits, {
          subject: item.value.subject.id,
        });
        const course = find(parents, { nodeType: 'courses' });
        const groups = find(parents, { nodeType: 'groups' });
        const courseName = course ? course.value.index : '';
        const substageName = item.value.substages ? ` - ${item.value.substages.abbreviation}` : '';
        let groupName = '';
        if (!groups) {
          groupName = item.value.groups ? ` - ${item.value.groups.abbreviation}` : '';
        }
        text = `${courseName}${classSubjectCredits?.internalId} ${item.value.subject.name}${groupName}${substageName}`;
      }
      const treeId = `${childIndex}.${parentId}.${item.value.id}`;
      result.push({
        id: treeId,
        parent: parents[parents.length - 1] ? parentId : 0,
        text,
        actions: [
          {
            name: 'edit',
            tooltip: editLabel,
            showOnHover: true,
            handler: () => onEdit({ ...item, treeId }),
          },
          {
            name: 'delete',
          },
        ],
      });
      if (item.childrens && item.childrens.length) {
        item.childrens.forEach((child, index) =>
          processItem(child, [...parents, item], treeId, index)
        );
      }
    }

    processItem(tree, [], '0');
    store.program = tree.value;
    return result;
  }

  async function init() {
    store.centerId = params.center;
    store.programId = params.program;
    if (store.centerId && store.programId) {
      store.tree = await getProgramTree();
    }
    render();
  }

  const messages = useMemo(
    () => ({
      header: {
        title: t('page_title'),
        description: t('page_description'),
      },
      treeProgram: getTreeProgramDetailTranslation(t),
      treeCourse: getTreeCourseDetailTranslation(t),
      treeGroup: getTreeGroupDetailTranslation(t),
      treeSubjectType: getTreeSubjectTypeDetailTranslation(t),
      treeKnowledge: getTreeKnowledgeDetailTranslation(t),
    }),
    [t]
  );

  function onSelectCenter(centerId) {
    store.centerId = centerId;
    render();
  }

  async function onSelectProgram(programId) {
    store.programId = programId;
    store.tree = await getProgramTree();
    render();
  }

  useEffect(() => {
    if (!tLoading) init();
  }, [params, tLoading]);

  async function onSelect() {}

  async function onAdd() {}

  async function onSaveProgram({ id, name, abbreviation, credits }) {
    try {
      store.saving = true;
      render();
      await updateProgramRequest({ id, name, abbreviation, credits });
      store.tree = await getProgramTree();
      addSuccessAlert(t('programUpdated'));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
  }

  async function onSaveCourse({ id, name, credits }) {
    try {
      store.saving = true;
      render();
      await updateCourseRequest({ id, name, abbreviation: name, number: credits });
      store.tree = await getProgramTree();
      addSuccessAlert(t('courseUpdated'));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
  }

  async function onSaveGroup({ id, name, abbreviation }) {
    try {
      store.saving = true;
      render();
      await updateGroupRequest({ id, name, abbreviation });
      store.tree = await getProgramTree();
      addSuccessAlert(t('groupUpdated'));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
  }

  async function onSaveSubjectType({ id, name, groupVisibility, credits_course, credits_program }) {
    try {
      store.saving = true;
      render();
      await updateSubjectTypeRequest({
        id,
        name,
        groupVisibility: !!groupVisibility,
        credits_course,
        credits_program,
      });
      store.tree = await getProgramTree();
      addSuccessAlert(t('subjectTypeUpdated'));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
  }

  async function onSaveKnowledge({
    id,
    name,
    abbreviation,
    color,
    credits_course,
    credits_program,
  }) {
    try {
      store.saving = true;
      render();
      await updateKnowledgeRequest({
        id,
        name,
        abbreviation,
        color,
        credits_course,
        credits_program,
        icon: ' ',
      });
      store.tree = await getProgramTree();
      addSuccessAlert(t('knowledgeUpdated'));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.saving = false;
    render();
  }

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={messages.header} />

      <Paper color="solid" shadow="none" padding={0}>
        <PageContainer>
          <ContextContainer padded="vertical">
            <Grid grow>
              <Col span={5}>
                <Paper fullWidth padding={5}>
                  <ContextContainer divided>
                    <Grid grow>
                      <Col span={6}>
                        <SelectCenter
                          label={t('centerLabel')}
                          onChange={onSelectCenter}
                          value={store.centerId}
                        />
                      </Col>
                      <Col span={6}>
                        <SelectProgram
                          label={t('programLabel')}
                          onChange={onSelectProgram}
                          center={store.centerId}
                          value={store.programId}
                        />
                      </Col>
                    </Grid>
                    {store.tree ? (
                      <Box>
                        <Tree
                          treeData={store.tree}
                          selectedNode={store.editingItem ? { id: store.editingItem.treeId } : null}
                          allowDragParents={false}
                          onSelect={onSelect}
                          onAdd={onAdd}
                          initialOpen={map(store.tree, 'id')}
                        />
                      </Box>
                    ) : null}
                  </ContextContainer>
                </Paper>
              </Col>
              <Col span={7}>
                {store.editingItem ? (
                  <Paper fullWidth padding={5}>
                    {store.editingItem.nodeType === 'program' ? (
                      <TreeProgramDetail
                        onSave={onSaveProgram}
                        program={store.editingItem.value}
                        messages={messages.treeProgram}
                        saving={store.saving}
                      />
                    ) : null}
                    {store.editingItem.nodeType === 'courses' ? (
                      <TreeCourseDetail
                        onSave={onSaveCourse}
                        course={store.editingItem.value}
                        messages={messages.treeCourse}
                        saving={store.saving}
                      />
                    ) : null}
                    {store.editingItem.nodeType === 'groups' ? (
                      <TreeGroupDetail
                        onSave={onSaveGroup}
                        program={store.program}
                        group={store.editingItem.value}
                        messages={messages.treeGroup}
                        saving={store.saving}
                      />
                    ) : null}
                    {store.editingItem.nodeType === 'subjectType' ? (
                      <TreeSubjectTypeDetail
                        onSave={onSaveSubjectType}
                        subjectType={store.editingItem.value}
                        messages={messages.treeSubjectType}
                        saving={store.saving}
                      />
                    ) : null}
                    {store.editingItem.nodeType === 'knowledges' ? (
                      <TreeKnowledgeDetail
                        onSave={onSaveKnowledge}
                        program={store.program}
                        knowledge={store.editingItem.value}
                        messages={messages.treeKnowledge}
                        saving={store.saving}
                      />
                    ) : null}
                  </Paper>
                ) : null}
              </Col>
            </Grid>
          </ContextContainer>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}
