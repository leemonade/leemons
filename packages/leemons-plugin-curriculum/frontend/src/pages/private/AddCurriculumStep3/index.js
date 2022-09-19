import React, { useMemo } from 'react';
import { filter, find, findIndex, forEach, forIn, isArray, keyBy, map, orderBy } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@curriculum/helpers/prefixPN';
import { getPermissionsWithActionsIfIHaveRequest, listCentersRequest } from '@users/request';
import { ChevLeftIcon, RatingStarIcon, RedoIcon, RemoveIcon } from '@bubbles-ui/icons/outline';
import {
  ActionButton,
  Box,
  Button,
  Col,
  ContextContainer,
  Grid,
  LoadingOverlay,
  Stack,
  Text,
  Tree,
  useTree,
} from '@bubbles-ui/components';

import { useHistory, useParams } from 'react-router-dom';
import { detailProgramRequest } from '@academic-portfolio/request';
import { useStore } from '@common';
import { CurriculumProp } from '@curriculum/components/CurriculumSelectContentsModal/components/CurriculumProp';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import {
  addNodeRequest,
  detailCurriculumRequest,
  generateNodesFromAcademicPortfolioRequest,
  publishCurriculumRequest,
  saveNodeRequest,
} from '../../../request';
import {
  NEW_BRANCH_VALUE_ERROR_MESSAGES,
  NEW_BRANCH_VALUE_MESSAGES,
} from '../../../bubbles-components/NewBranchValue';
import NewBranchDetailValue from '../../../bubbles-components/NewBranchDetailValue';

/*
function AddCurriculumStep3({ onPrev }) {
  const [store, render] = useStore({
    loading: true,
  });
  const [t] = useTranslateLoader(prefixPN('addCurriculumStep3'));

  const history = useHistory();
  const tree = useTree();
  const { id } = useParams();

  const messagesBranchValues = useMemo(() => {
    const result = {};
    forIn(NEW_BRANCH_VALUE_MESSAGES, (value, key) => {
      result[key] = t(`newBranchValue.${key}`);
    });
    return result;
  }, [t]);

  const errorMessagesBranchValues = useMemo(() => {
    const result = {};
    forIn(NEW_BRANCH_VALUE_ERROR_MESSAGES, (value, key) => {
      result[key] = t(`newBranchValue.${key}`);
    });
    return result;
  }, [t]);

  async function load(hideLoading = false) {
    try {
      if (!hideLoading) {
        store.loading = true;
        render();
      }
      const [
        { curriculum: c },
        {
          data: { items: centers },
        },
        {
          permissions: [{ actionNames }],
        },
      ] = await Promise.all([
        detailCurriculumRequest(id),
        listCentersRequest({ page: 0, size: 999999 }),
        getPermissionsWithActionsIfIHaveRequest(['plugins.curriculum.curriculum']),
      ]);

      const isEditMode = actionNames.includes('admin') || actionNames.includes('edit');

      const { program } = await detailProgramRequest(c.program);

      store.isEditMode = isEditMode;
      c.program = program;
      c.center = find(centers, { id: c.center });
      c.nodeLevels = orderBy(c.nodeLevels, ['levelOrder'], ['asc']);

      store.curriculum = c;
      store.loading = false;
    } catch (e) {
      store.loading = false;
    }
    render();
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (store.curriculum) {
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
            if (store.curriculum.nodeLevels[nextDeep] && store.isEditMode) {
              items.push({
                id: `add-button-${node.id}`,
                parent: node.id,
                text: t('addNode', { name: store.curriculum.nodeLevels[nextDeep].name }),
                type: 'button',
                draggable: false,
                node,
                data: {
                  action: 'add',
                },
              });
            }
          });
        };
        addNodes(store.curriculum.nodes, 0, 1);
      }
      if (store.isEditMode) {
        items.push({
          id: 'add-button',
          parent: 0,
          text: t('addNode', { name: store.curriculum.nodeLevels[0].name }),
          type: 'button',
          draggable: false,
          node: null,
          data: {
            action: 'add',
          },
        });
      }

      tree.setTreeData(items);
    }
  }, [store.curriculum]);

  function getDataForNode() {
    const nodeLevelsById = keyBy(store.curriculum.nodeLevels, 'id');

    const academicItemIds = [];

    function getAcademicIds(nodes) {
      forEach(nodes, (nod) => {
        academicItemIds.push(nod.academicItem);
        if (nod.childrens) getAcademicIds(nod.childrens);
      });
    }

    getAcademicIds(store.curriculum.nodes);

    const unUsedSubjects = filter(
      store.curriculum.program.subjects,
      (a) => !academicItemIds.includes(a.id)
    );
    return { unUsedSubjects, nodeLevelsById };
  }

  async function onSelect({ node }) {
    const { nodeLevelsById, unUsedSubjects } = getDataForNode();

    store.activeNode = {
      ...node,
      nodeLevel: nodeLevelsById[node.nodeLevel],
      unUsedSubjects: map(unUsedSubjects, (sub) => ({ label: sub.name, value: sub.id })),
    };
    store.activeNode.isSubject = store.activeNode.nodeLevel.type === 'subject';
    const subject = find(store.curriculum.program.subjects, { id: node.academicItem });
    if (subject) {
      store.activeNode.unUsedSubjects.push({
        label: subject.name,
        value: subject.id,
      });
    }

    forIn(store.activeNode.nodeLevel?.schema?.compileJsonSchema?.properties, (prop, index) => {
      store.activeNode.nodeLevel.schema.compileJsonUI[index]['ui:title'] = (
        <>
          {prop?.frontConfig?.blockData?.evaluationCriteria ? (
            <Box
              sx={(theme) => ({
                display: 'inline-block',
                verticalAlign: 'middle',
                marginRight: theme.spacing[2],
              })}
            >
              <RatingStarIcon />
            </Box>
          ) : null}
          {prop.title}
        </>
      );
    });

    store.activeRightSection = 'detail-branch-value';
    render();
  }

  async function onAdd({ node }) {
    const { nodeLevelsById, unUsedSubjects } = getDataForNode();

    const parentNodeLevelIndex = findIndex(store.curriculum.nodeLevels, {
      id: node.nodeLevel,
    });
    const nodeLevelId = store.curriculum.nodeLevels[parentNodeLevelIndex + 1].id;

    store.activeNode = {
      ...node,
      nodeLevel: nodeLevelsById[nodeLevelId],
      unUsedSubjects: map(unUsedSubjects, (sub) => ({ label: sub.name, value: sub.id })),
    };
    store.activeNode.isSubject = store.activeNode.nodeLevel.type === 'subject';

    store.activeRightSection = 'add-branch-value';
    render();
  }

  function back() {
    onPrev();
  }

  async function publish() {
    try {
      if (store.curriculum.published) {
        addSuccessAlert(t('published'));
      } else {
        store.publishing = true;
        render();
        await publishCurriculumRequest(store.curriculum.id);
        addSuccessAlert(t('published'));
        store.curriculum.published = true;
        render();
      }
      history.push('/private/curriculum/list');
    } catch (e) {}
  }

  async function onAddBranchValue(data) {
    try {
      store.saving = true;
      render();
      if (!data.id) {
        const toSend = {
          curriculum: store.curriculum.id,
          name: data.name,
          nodeLevel: store.curriculum.nodeLevels[0].id,
          parentNode: null,
          nodeOrder: store.curriculum.nodes.length,
        };
        if (data.academicItem) {
          toSend.academicItem = data.academicItem;
        }
        if (store.activeNode) {
          const parentNodeLevelIndex = findIndex(store.curriculum.nodeLevels, {
            id: store.activeNode.nodeLevel,
          });
          toSend.nodeLevel = store.curriculum.nodeLevels[parentNodeLevelIndex + 1].id;
          toSend.parentNode = store.activeNode.id;
          toSend.nodeOrder = store.activeNode.childrens.length;
        }
        await addNodeRequest(toSend);
      } else {
        await saveNodeRequest(data);
      }
      await load(true);
      store.activeRightSection = null;
      store.activeNode = null;
      store.saving = false;
    } catch (err) {
      console.error(err);
      store.saving = false;
    }
    render();
  }

  let groupChilds = null;

  if (store.activeRightSection === 'add-branch-value') {
    groupChilds = (
      <NewBranchValue
        isSubject={store.activeNode.isSubject}
        subjectData={store.activeNode.unUsedSubjects}
        academicItem={store.activeNode.academicItem}
        messages={messagesBranchValues}
        errorMessages={errorMessagesBranchValues}
        onSubmit={onAddBranchValue}
        isLoading={store.saving}
        onCloseBranch={() => {
          store.activeRightSection = null;
          store.activeNode = null;
          render();
        }}
      />
    );
  }
  if (store.activeRightSection === 'detail-branch-value') {
    if (store.isEditMode) {
      groupChilds = (
        <NewBranchDetailValue
          isSubject={store.activeNode.isSubject}
          subjectData={store.activeNode.unUsedSubjects}
          messages={messagesBranchValues}
          errorMessages={errorMessagesBranchValues}
          onSubmit={onAddBranchValue}
          isLoading={store.saving}
          defaultValues={{
            academicItem: store.activeNode.academicItem,
            name: store.activeNode.name,
            id: store.activeNode.id,
          }}
          schema={
            store.activeNode.nodeLevel.schema
              ? {
                  jsonSchema: store.activeNode.nodeLevel.schema.compileJsonSchema,
                  jsonUI: store.activeNode.nodeLevel.schema.compileJsonUI,
                }
              : null
          }
          schemaFormValues={store.activeNode.formValues}
          onCloseBranch={() => {
            store.activeRightSection = null;
            store.activeNode = null;
            render();
          }}
        />
      );
    } else {
      store.selectedNode = store.activeNode;
      const items = [];
      if (store.activeNode.nodeLevel?.schema?.compileJsonSchema) {
        forIn(store.activeNode.nodeLevel.schema.compileJsonSchema.properties, (value, key) => {
          items.push({
            ...value,
            id: key,
          });
        });
      }

      groupChilds = (
        <ContextContainer divided>
          <Stack fullWidth justifyContent="space-between">
            <Box>
              <Text strong size="lg" color="primary">
                {store.selectedNode.nodeLevel.name}
              </Text>
              <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
                <Text strong size="md" color="primary">
                  {store.selectedNode.name}
                </Text>
              </Box>
            </Box>
            <ActionButton
              icon={<RemoveIcon />}
              onClick={() => {
                store.activeRightSection = null;
                store.activeNode = null;
                render();
              }}
            />
          </Stack>
          <Box>
            {items.length
              ? items.map((prop, i) => (
                  <CurriculumProp
                    showCheckboxs={false}
                    key={i}
                    store={store}
                    render={render}
                    item={prop}
                  />
                ))
              : null}
          </Box>
        </ContextContainer>
      );
    }
  }

  if (store.loading) {
    return <LoadingOverlay visible />;
  }

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={{
          title: `${store.curriculum.name} (${store.curriculum.center.name}|${store.curriculum.program.name})`,
          description: store.isEditMode ? t('description1') : null,
        }}
      />

      <Paper fullHeight color="solid" shadow="none" padding={0}>
        <PageContainer>
          <ContextContainer divided>
            <ContextContainer padded="vertical">
              <Grid grow>
                <Col span={5}>
                  <Paper fullWidth padding={5}>
                    <ContextContainer divided>
                      <Tree
                        {...tree}
                        rootId={0}
                        onAdd={onAdd}
                        onDelete={(node) => alert(`Delete nodeId: ${node.id}`)}
                        onEdit={(node) => alert(`Editing ${node.id}`)}
                        onSelect={onSelect}
                        initialOpen={tree.treeData ? [tree.treeData?.[0]?.id] : []}
                        selectedNode={store.activeNode?.id}
                      />
                    </ContextContainer>
                  </Paper>
                  {!store.isEditMode ? (
                    <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                      <Box
                        sx={(theme) => ({
                          display: 'inline',
                          verticalAlign: 'middle',
                          marginRight: theme.spacing[1],
                        })}
                      >
                        <RatingStarIcon />
                      </Box>
                      <Text color="primary">{t('starDescription')}</Text>
                    </Box>
                  ) : null}
                </Col>
                <Col span={7}>
                  {groupChilds ? (
                    <>
                      <Paper fullWidth padding={5}>
                        {groupChilds}
                      </Paper>
                    </>
                  ) : null}
                </Col>
              </Grid>
            </ContextContainer>
            {store.isEditMode ? (
              <Box sx={(theme) => ({ marginBottom: theme.spacing[10] })}>
                <Stack justifyContent="space-between" fullWidth>
                  <Button variant="outline" onClick={back} loading={store.publishing}>
                    {t('back')}
                  </Button>
                  <Button onClick={publish} loading={store.publishing}>
                    {t('publish')}
                  </Button>
                </Stack>
              </Box>
            ) : null}
          </ContextContainer>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}
*/
function AddCurriculumStep3New({ onPrev }) {
  const [store, render] = useStore({
    loading: true,
  });
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [t] = useTranslateLoader(prefixPN('addCurriculumStep3'));

  const history = useHistory();
  const tree = useTree();
  const { id } = useParams();

  const messagesBranchValues = useMemo(() => {
    const result = {};
    forIn(NEW_BRANCH_VALUE_MESSAGES, (value, key) => {
      result[key] = t(`newBranchValue.${key}`);
    });
    return result;
  }, [t]);

  const errorMessagesBranchValues = useMemo(() => {
    const result = {};
    forIn(NEW_BRANCH_VALUE_ERROR_MESSAGES, (value, key) => {
      result[key] = t(`newBranchValue.${key}`);
    });
    return result;
  }, [t]);

  async function load(hideLoading = false) {
    try {
      if (!hideLoading) {
        store.loading = true;
        render();
      }
      const [
        { curriculum: c },
        {
          data: { items: centers },
        },
        {
          permissions: [{ actionNames }],
        },
      ] = await Promise.all([
        detailCurriculumRequest(id),
        listCentersRequest({ page: 0, size: 999999 }),
        getPermissionsWithActionsIfIHaveRequest(['plugins.curriculum.curriculum']),
      ]);

      const isEditMode = actionNames.includes('admin') || actionNames.includes('edit');

      const { program } = await detailProgramRequest(c.program);

      store.isEditMode = isEditMode;
      c.program = program;
      c.center = find(centers, { id: c.center });
      c.nodeLevels = orderBy(c.nodeLevels, ['levelOrder'], ['asc']);

      store.curriculum = c;
      store.loading = false;
    } catch (e) {
      store.loading = false;
    }
    render();
  }

  async function sync() {
    try {
      store.loading = true;
      render();
      await generateNodesFromAcademicPortfolioRequest(store.curriculum.id);
      await load();
      addSuccessAlert(t('syncTreeDone'));
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
    store.loading = false;
    render();
  }

  React.useEffect(() => {
    load();
  }, []);

  React.useEffect(() => {
    if (store.curriculum) {
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

      tree.setTreeData(items);
    }
  }, [store.curriculum]);

  function getDataForNode() {
    const nodeLevelsById = keyBy(store.curriculum.nodeLevels, 'id');

    const academicItemIds = [];

    function getAcademicIds(nodes) {
      forEach(nodes, (nod) => {
        academicItemIds.push(nod.academicItem);
        if (nod.childrens) getAcademicIds(nod.childrens);
      });
    }

    getAcademicIds(store.curriculum.nodes);

    const unUsedSubjects = filter(
      store.curriculum.program.subjects,
      (a) => !academicItemIds.includes(a.id)
    );
    return { unUsedSubjects, nodeLevelsById };
  }

  async function onSelect({ node }) {
    const { nodeLevelsById, unUsedSubjects } = getDataForNode();

    store.activeNode = {
      ...node,
      nodeLevel: nodeLevelsById[node.nodeLevel],
      unUsedSubjects: map(unUsedSubjects, (sub) => ({ label: sub.name, value: sub.id })),
    };
    store.activeNode.isSubject = store.activeNode.nodeLevel.type === 'subject';
    const subject = find(store.curriculum.program.subjects, { id: node.academicItem });
    if (subject) {
      store.activeNode.unUsedSubjects.push({
        label: subject.name,
        value: subject.id,
      });
    }

    forIn(store.activeNode.nodeLevel?.schema?.compileJsonSchema?.properties, (prop, index) => {
      store.activeNode.nodeLevel.schema.compileJsonUI[index]['ui:title'] = (
        <>
          {prop?.frontConfig?.blockData?.evaluationCriteria ? (
            <Box
              sx={(theme) => ({
                display: 'inline-block',
                verticalAlign: 'middle',
                marginRight: theme.spacing[2],
              })}
            >
              <RatingStarIcon />
            </Box>
          ) : null}
          {prop.title}
        </>
      );
    });

    store.activeRightSection = 'detail-branch-value';
    render();
  }

  function back() {
    onPrev();
  }

  async function publish() {
    try {
      if (store.curriculum.published) {
        addSuccessAlert(t('published'));
      } else {
        store.publishing = true;
        render();
        await publishCurriculumRequest(store.curriculum.id);
        addSuccessAlert(t('published'));
        store.curriculum.published = true;
        render();
      }
      history.push('/private/curriculum/list');
    } catch (e) {}
  }

  async function onAddBranchValue(data, noClose) {
    try {
      store.saving = true;
      render();
      if (!data.id) {
        const toSend = {
          curriculum: store.curriculum.id,
          name: data.name,
          nodeLevel: store.curriculum.nodeLevels[0].id,
          parentNode: null,
          nodeOrder: store.curriculum.nodes.length,
        };
        if (data.academicItem) {
          toSend.academicItem = data.academicItem;
        }
        if (store.activeNode) {
          const parentNodeLevelIndex = findIndex(store.curriculum.nodeLevels, {
            id: store.activeNode.nodeLevel,
          });
          toSend.nodeLevel = store.curriculum.nodeLevels[parentNodeLevelIndex + 1].id;
          toSend.parentNode = store.activeNode.id;
          toSend.nodeOrder = store.activeNode.childrens.length;
        }
        await addNodeRequest(toSend);
      } else {
        await saveNodeRequest(data);
      }
      await load(true);
      if (!noClose) {
        store.activeRightSection = null;
        store.activeNode = null;
      }
      store.saving = false;
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
      store.saving = false;
    }
    render();
  }

  let groupChilds = null;

  if (store.activeRightSection === 'detail-branch-value') {
    if (store.isEditMode) {
      groupChilds = (
        <NewBranchDetailValue
          isSubject={store.activeNode.isSubject}
          subjectData={store.activeNode.unUsedSubjects}
          messages={messagesBranchValues}
          errorMessages={errorMessagesBranchValues}
          onSubmit={onAddBranchValue}
          isLoading={store.saving}
          curriculum={store.curriculum}
          defaultValues={{
            academicItem: store.activeNode.academicItem,
            name: store.activeNode.name,
            id: store.activeNode.id,
          }}
          schema={
            store.activeNode.nodeLevel.schema
              ? {
                  jsonSchema: store.activeNode.nodeLevel.schema.compileJsonSchema,
                  jsonUI: store.activeNode.nodeLevel.schema.compileJsonUI,
                }
              : null
          }
          schemaFormValues={store.activeNode.formValues}
          onCloseBranch={() => {
            store.activeRightSection = null;
            store.activeNode = null;
            render();
          }}
        />
      );
    } else {
      store.selectedNode = store.activeNode;
      const items = [];
      if (store.activeNode.nodeLevel?.schema?.compileJsonSchema) {
        forIn(store.activeNode.nodeLevel.schema.compileJsonSchema.properties, (value, key) => {
          items.push({
            ...value,
            id: key,
          });
        });
      }

      groupChilds = (
        <ContextContainer divided>
          <Stack fullWidth justifyContent="space-between">
            <Box>
              <Text strong size="lg" color="primary">
                {store.selectedNode.nodeLevel.name}
              </Text>
              <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
                <Text strong size="md" color="primary">
                  {store.selectedNode.name}
                </Text>
              </Box>
            </Box>
            <ActionButton
              icon={<RemoveIcon />}
              onClick={() => {
                store.activeRightSection = null;
                store.activeNode = null;
                render();
              }}
            />
          </Stack>
          <Box>
            {items.length
              ? items.map((prop, i) => (
                  <CurriculumProp
                    showCheckboxs={false}
                    key={i}
                    store={store}
                    render={render}
                    item={prop}
                  />
                ))
              : null}
          </Box>
        </ContextContainer>
      );
    }
  }

  if (store.loading) {
    return <LoadingOverlay visible />;
  }

  return (
    <ContextContainer
      sx={(theme) => ({ marginBottom: theme.spacing[6] })}
      title={t('pageTitle')}
      description={store.isEditMode ? t('pageDescription') : null}
      divided
    >
      <Grid grow>
        <Col span={3}>
          <Box
            sx={(theme) => ({
              paddingRight: theme.spacing[6],
              borderRight: `1px solid ${theme.colors.ui01}`,
            })}
          >
            <Tree
              {...tree}
              rootId={0}
              onSelect={onSelect}
              initialOpen={tree.treeData ? [tree.treeData?.[0]?.id] : []}
              selectedNode={store.activeNode?.id}
            />
            {!store.isEditMode ? (
              <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                <Box
                  sx={(theme) => ({
                    display: 'inline',
                    verticalAlign: 'middle',
                    marginRight: theme.spacing[1],
                  })}
                >
                  <RatingStarIcon />
                </Box>
                <Text color="primary">{t('starDescription')}</Text>
              </Box>
            ) : (
              <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                <Button
                  fullWidth
                  variant="light"
                  onClick={sync}
                  leftIcon={<RedoIcon height={20} width={20} />}
                >
                  {t('syncTree')}
                </Button>
              </Box>
            )}
          </Box>
        </Col>
        <Col span={9}>
          <Box
            sx={(theme) => ({
              paddingLeft: theme.spacing[6],
            })}
          >
            {groupChilds || null}
          </Box>
        </Col>
      </Grid>

      {store.isEditMode ? (
        <Stack justifyContent="space-between" fullWidth>
          <Button
            variant="outline"
            onClick={back}
            leftIcon={<ChevLeftIcon height={20} width={20} />}
            loading={store.publishing}
          >
            {t('back')}
          </Button>
          <Button onClick={publish} loading={store.publishing}>
            {t('publish')}
          </Button>
        </Stack>
      ) : null}
    </ContextContainer>
  );
}

export default AddCurriculumStep3New; // withLayout(AddCurriculumStep2);
