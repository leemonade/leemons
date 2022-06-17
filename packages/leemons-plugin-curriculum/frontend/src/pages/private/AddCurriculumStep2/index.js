import React, { useEffect, useMemo } from 'react';
import { cloneDeep, find, findIndex, forEach, forIn, map, orderBy, take } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@curriculum/helpers/prefixPN';
import { listCentersRequest } from '@users/request';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import {
  Box,
  Col,
  ContextContainer,
  Grid,
  LoadingOverlay,
  PageContainer,
  Paper,
  Tree,
  useTree,
} from '@bubbles-ui/components';
import { useHistory, useParams } from 'react-router-dom';
import { useStore } from '@common';
import { detailProgramRequest } from '@academic-portfolio/request';
import { saveDatasetFieldRequest } from '@dataset/request';
import {
  addNodeLevelsRequest,
  detailCurriculumRequest,
  generateNodesFromAcademicPortfolioRequest,
  updateNodeLevelRequest,
} from '../../../request';
import NewBranchConfig, {
  NEW_BRANCH_CONFIG_ERROR_MESSAGES,
  NEW_BRANCH_CONFIG_MESSAGES,
  NEW_BRANCH_CONFIG_ORDERED_OPTIONS,
} from '../../../bubbles-components/NewBranchConfig';
import BranchContent from '../../../bubbles-components/BranchContent';
import {
  BRANCH_CONTENT_ERROR_MESSAGES,
  BRANCH_CONTENT_MESSAGES,
  BRANCH_CONTENT_SELECT_DATA,
} from '../../../bubbles-components/branchContentDefaultValues';

function AddCurriculumStep2() {
  const [store, render] = useStore({
    loading: true,
    curriculum: {},
  });
  const [t] = useTranslateLoader(prefixPN('addCurriculumStep2'));

  const tree = useTree();
  const history = useHistory();
  const { id } = useParams();

  const messagesConfig = useMemo(() => {
    const result = {};
    forIn(NEW_BRANCH_CONFIG_MESSAGES, (value, key) => {
      result[key] = t(key);
    });
    return result;
  }, [t]);

  const errorMessagesConfig = useMemo(() => {
    const result = {};
    forIn(NEW_BRANCH_CONFIG_ERROR_MESSAGES, (value, key) => {
      result[key] = t(key);
    });
    return result;
  }, [t]);

  const messagesContent = useMemo(() => {
    const result = {};
    forIn(BRANCH_CONTENT_MESSAGES, (value, key) => {
      result[key] = t(key);
    });
    return result;
  }, [t]);

  const errorMessagesContent = useMemo(() => {
    const result = {};
    forIn(BRANCH_CONTENT_ERROR_MESSAGES, (value, key) => {
      result[key] = t(key);
    });
    return result;
  }, [t]);

  const orderedData = useMemo(() => {
    const result = cloneDeep(NEW_BRANCH_CONFIG_ORDERED_OPTIONS);
    forEach(result, ({ value }, key) => {
      result[key].label = t(`orderedOptions.${value}`);
    });
    return result;
  }, [t]);

  const groupOrderedData = useMemo(() => {
    const result = cloneDeep(BRANCH_CONTENT_SELECT_DATA.groupOrdered);
    forEach(result, ({ value }, key) => {
      result[key].label = t(`orderedOptions.${value}`);
    });
    return result;
  }, [t]);

  const blockTypeData = useMemo(() => {
    const result = cloneDeep(BRANCH_CONTENT_SELECT_DATA.blockType);
    forEach(result, ({ value }, key) => {
      result[key].label = t(`blockTypeOptions.${value}`);
    });
    return result;
  }, [t]);

  const codeTypeData = useMemo(() => {
    const result = cloneDeep(BRANCH_CONTENT_SELECT_DATA.codeType);
    forEach(result, ({ value }, key) => {
      result[key].label = t(`codeTypeOptions.${value}`);
    });
    return result;
  }, [t]);

  const groupTypeOfContentsData = useMemo(() => {
    const result = cloneDeep(blockTypeData);
    result.splice(findIndex(result, { value: 'group' }), 1);
    return result;
  }, [blockTypeData]);

  const listTypeData = useMemo(() => {
    const result = cloneDeep(BRANCH_CONTENT_SELECT_DATA.listType);
    forEach(result, ({ value }, key) => {
      result[key].label = blockTypeData[findIndex(blockTypeData, { value })].label;
    });
    return result;
  }, [blockTypeData]);

  const listOrderedData = useMemo(() => {
    const result = cloneDeep(BRANCH_CONTENT_SELECT_DATA.listOrdered);
    forEach(result, ({ value }, key) => {
      result[key].label = t(`orderedOptions.${value}`);
    });
    return result;
  }, [t]);

  const parentNodeLevelsData = useMemo(() => {
    if (store.activeNodeLevel && store.curriculum)
      return map(take(store.curriculum.nodeLevels, store.activeNodeLevel.levelOrder), (item) => ({
        label: item.name,
        value: item.id,
      }));
    return [];
  }, [store.activeNodeLevel, store.curriculum]);

  const nodeLevelsFieldsData = useMemo(() => {
    const result = [];
    if (store.curriculum && t) {
      forEach(store.curriculum.nodeLevels, (nodeLevel) => {
        result[nodeLevel.id] = [
          {
            label: t('codeFieldNumbering'),
            value: 'numbering',
          },
        ];
        if (nodeLevel.schema) {
          forIn(nodeLevel.schema.jsonSchema.properties, (value, key) => {
            if (['field', 'code'].indexOf(value.frontConfig.blockData.type) >= 0) {
              result[nodeLevel.id].push({
                label: value.frontConfig.blockData.name,
                value: key,
              });
            }
          });
        }
      });
    }
    return result;
  }, [store.curriculum, t]);

  async function load(skipLoading = false) {
    try {
      if (!skipLoading) {
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
    } catch (e) {
      console.error(e);
    }
    store.loading = false;
    render();
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const items = [];

    forEach(store.curriculum.nodeLevels, (nodeLevel, index) => {
      items.push({
        id: nodeLevel.id,
        parent: index === 0 ? 0 : items[index - 1].id,
        draggable: false,
        text: nodeLevel.name,
        actions: ['edit'],
      });
    });

    /*
    items.push({
      id: 'add-button',
      parent: items.length ? items[items.length - 1].id : 0,
      text: t('addBranchButtonLabel'),
      type: 'button',
      draggable: false,
      data: {
        action: 'add',
      },
    });

     */

    tree.setTreeData(items);
  }, [store.curriculum]);

  function onSelect({ id: nodeLevelId }) {
    store.activeNodeLevel = find(store.curriculum.nodeLevels, { id: nodeLevelId });
    store.activeRightSection = 'detail-branch';
    render();
  }

  function onCloseBranch() {
    store.activeNodeLevel = null;
    store.activeRightSection = null;
    render();
  }

  // CREATE NODE LEVEL

  async function addNewBranch({ id: nodeLevelId, ordered, ...rest }) {
    try {
      store.saving = true;
      render();
      if (!nodeLevelId) {
        await addNodeLevelsRequest(store.curriculum.id, [
          {
            ...rest,
            type: 'custom',
            listType: ordered,
            levelOrder:
              store.curriculum.nodeLevels && store.curriculum.nodeLevels.length
                ? store.curriculum.nodeLevels[store.curriculum.nodeLevels.length - 1].levelOrder + 1
                : 0,
          },
        ]);
      } else {
        await updateNodeLevelRequest({
          id: nodeLevelId,
          listType: ordered,
          ...rest,
        });
      }

      await load(true);
      store.activeNodeLevel = null;
      store.activeRightSection = null;
      store.saving = false;
    } catch (e) {
      store.saving = false;
    }
    render();
  }

  // CREATE / UPDATE FIELD

  async function onSaveBlock(data) {
    const toSave = {
      locationName: `node-level-${store.activeNodeLevel.id}`,
      pluginName: 'plugins.curriculum',
      schemaConfig: {
        schema: {
          frontConfig: {
            centers: [],
            isAllCenterMode: true,
            masked: false,
            required: true,
            blockData: data,
            name: data.name,
            groupType: data.type,
          },
          permissions: {
            '*': ['view'],
          },
          permissionsType: 'profile',
          title: data.name,
        },
        ui: {},
      },
      schemaLocales: {
        [store.curriculum.locale]: {
          schema: {
            title: data.name,
          },
          ui: {},
        },
      },
    };

    if (data.id) toSave.schemaConfig.schema.id = data.id;

    switch (data.type) {
      case 'field':
        toSave.schemaConfig.schema.type = 'string';
        toSave.schemaConfig.schema.frontConfig.type = 'text_field';
        if (data.limitCharacters) {
          toSave.schemaConfig.schema.frontConfig.minLength = data.min;
          toSave.schemaConfig.schema.frontConfig.maxLength = data.max;
        }
        break;
      case 'code':
        toSave.schemaConfig.schema.type = 'string';
        toSave.schemaConfig.schema.frontConfig.type = 'text_field';
        if (data.limitCharacters) {
          toSave.schemaConfig.schema.frontConfig.minLength = data.min;
          toSave.schemaConfig.schema.frontConfig.maxLength = data.max;
        }
        if (data.codeType === 'autocomposed') {
          toSave.schemaConfig.schema.frontConfig.required = false;
        }
        break;
      case 'textarea':
        toSave.schemaConfig.schema.type = 'string';
        toSave.schemaConfig.schema.frontConfig.type = 'rich_text';
        toSave.schemaConfig.ui['ui:widget'] = 'wysiwyg';
        break;
      case 'list':
        toSave.schemaConfig.schema.type = 'array';
        toSave.schemaConfig.schema.items = { type: 'string' };
        toSave.schemaConfig.schema.frontConfig.type = 'list';
        if (data.listType === 'textarea') {
          toSave.schemaConfig.ui['ui:widget'] = 'wysiwyg';
        }
        break;
      case 'group':
        toSave.schemaConfig.schema.type = 'array';
        toSave.schemaConfig.schema.items = { type: 'string' };
        toSave.schemaConfig.schema.frontConfig.type = 'group';
        break;
      default:
        break;
    }

    try {
      store.saving = true;
      render();

      await saveDatasetFieldRequest(
        toSave.locationName,
        toSave.pluginName,
        toSave.schemaConfig,
        toSave.schemaLocales,
        { useDefaultLocaleCallback: false }
      );
      await load(true);

      store.activeNodeLevel = find(store.curriculum.nodeLevels, { id: store.activeNodeLevel.id });
      store.saving = false;
    } catch (e) {
      store.saving = false;
    }
    render();
  }

  let rightSection;

  if (store.activeRightSection === 'new-branch' || store.activeRightSection === 'edit-branch') {
    rightSection = (
      <Box>
        <NewBranchConfig
          messages={messagesConfig}
          errorMessages={errorMessagesConfig}
          orderedData={orderedData}
          isLoading={store.saving}
          defaultValues={
            store.activeRightSection === 'edit-branch'
              ? {
                  id: store.activeNodeLevel.id,
                  name: store.activeNodeLevel.name,
                  ordered: store.activeNodeLevel.listType,
                }
              : null
          }
          onSubmit={addNewBranch}
          onCloseBranch={onCloseBranch}
        />
      </Box>
    );
  }

  if (store.activeRightSection === 'detail-branch') {
    rightSection = (
      <Box>
        <BranchContent
          messages={messagesContent}
          errorMessages={errorMessagesContent}
          selectData={{
            blockType: blockTypeData,
            blockOrdered: orderedData,
            groupTypeOfContents: groupTypeOfContentsData,
            codeType: codeTypeData,
            parentNodeLevels: parentNodeLevelsData,
            nodeLevelsFields: nodeLevelsFieldsData,
            listType: listTypeData,
            listOrdered: listOrderedData,
            groupOrdered: groupOrderedData,
          }}
          isLoading={store.saving}
          branch={store.activeNodeLevel}
          onSaveBlock={onSaveBlock}
          onCloseBranch={onCloseBranch}
        />
      </Box>
    );
  }

  async function goStep3() {
    try {
      store.generating = true;
      render();
      await generateNodesFromAcademicPortfolioRequest(store.curriculum.id);
      await history.push(`/private/curriculum/${store.curriculum.id}/step/3`);
      store.generating = false;
    } catch (err) {
      console.error(err);
      store.generating = false;
    }
    render();
  }

  if (store.loading) {
    return <LoadingOverlay visible />;
  }

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        loading={store.generating ? 'edit' : null}
        buttons={{ edit: t('continueButtonLabel') }}
        onEdit={goStep3}
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
                      onAdd={() => {
                        store.activeRightSection = 'new-branch';
                        render();
                      }}
                      onDelete={(node) => alert(`Delete nodeId: ${node.id}`)}
                      onEdit={(node) => {
                        onSelect(node);
                        store.activeRightSection = 'edit-branch';
                        render();
                      }}
                      selectedNode={store.activeNodeLevel?.id}
                      onSelect={onSelect}
                    />
                  </ContextContainer>
                </Paper>
              </Col>
              <Col span={7}>
                {rightSection ? (
                  <>
                    <Paper fullWidth padding={5}>
                      {rightSection}
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

export default AddCurriculumStep2; // withLayout(AddCurriculumStep2);
