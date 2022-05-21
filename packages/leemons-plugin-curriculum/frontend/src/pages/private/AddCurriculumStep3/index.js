import React, { useEffect, useMemo } from 'react';
import { find, findIndex, forEach, forIn, isArray, orderBy } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@curriculum/helpers/prefixPN';
import { listCentersRequest } from '@users/request';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import {
  Box,
  Col,
  ContextContainer,
  Grid,
  PageContainer,
  Paper,
  Tree,
  useTree,
  LoadingOverlay
} from '@bubbles-ui/components';
import { useParams } from 'react-router-dom';
import { detailProgramRequest } from '@academic-portfolio/request';
import { useStore } from '@common';
import { addNodeRequest, detailCurriculumRequest, saveNodeRequest } from '../../../request';
import NewBranchValue, {
  NEW_BRANCH_VALUE_ERROR_MESSAGES,
  NEW_BRANCH_VALUE_MESSAGES,
} from '../../../bubbles-components/NewBranchValue';
import NewBranchDetailValue from '../../../bubbles-components/NewBranchDetailValue';

function AddCurriculumStep3() {
  const [store, render] = useStore({
    loading: true,
  });
  const [t] = useTranslateLoader(prefixPN('addCurriculumStep3'));

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
      ] = await Promise.all([
        detailCurriculumRequest(id),
        listCentersRequest({ page: 0, size: 999999 }),
      ]);

      const { program } = await detailProgramRequest(c.program);

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
            if (store.curriculum.nodeLevels[nextDeep]) {
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
            if (node.childrens) {
              addNodes(node.childrens, node.id, nextDeep + 1);
            }
          });
        };
        addNodes(store.curriculum.nodes, 0, 1);
      }
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

      tree.setTreeData(items);
    }
  }, [store.curriculum]);

  async function onSelect({ node }) {
    store.activeNode = {
      ...node,
      nodeLevel: find(store.curriculum.nodeLevels, { id: node.nodeLevel }),
    };
    store.activeRightSection = 'detail-branch-value';
    render();
  }

  async function onAdd({ node }) {
    store.activeNode = node;
    store.activeRightSection = 'add-branch-value';
    render();
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
    groupChilds = (
      <NewBranchDetailValue
        messages={messagesBranchValues}
        errorMessages={errorMessagesBranchValues}
        onSubmit={onAddBranchValue}
        isLoading={store.saving}
        defaultValues={{ name: store.activeNode.name, id: store.activeNode.id }}
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
  }

  if (store.loading) {
    return <LoadingOverlay visible />;
  }

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={{
          title: `${store.curriculum.name} (${store.curriculum.center.name}|${store.curriculum.program.name})`,
          description: t('description1') + t('description2'),
        }}
      />

      <Paper fullHeight color="solid" shadow="none" padding={0}>
        <PageContainer>
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
                      selectedNode={store.activeNode?.id}
                    />
                  </ContextContainer>
                </Paper>
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
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}

export default AddCurriculumStep3; // withLayout(AddCurriculumStep2);
