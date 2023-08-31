import { detailProgramRequest } from '@academic-portfolio/request';
import {
  Box,
  Button,
  Col,
  ContextContainer,
  Grid,
  LoadingOverlay,
  Stack,
  Tree,
  useTree,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import prefixPN from '@curriculum/helpers/prefixPN';
import { removeDatasetFieldRequest, saveDatasetFieldRequest } from '@dataset/request';
import { useLayout } from '@layout/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { listCentersRequest } from '@users/request';
import _, { cloneDeep, find, findIndex, forEach, forIn, map, orderBy, take } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import BranchContent from '../../../bubbles-components/BranchContent';
import NewBranchConfig, {
  NEW_BRANCH_CONFIG_ERROR_MESSAGES,
  NEW_BRANCH_CONFIG_MESSAGES,
  NEW_BRANCH_CONFIG_ORDERED_OPTIONS,
} from '../../../bubbles-components/NewBranchConfig';
import {
  BRANCH_CONTENT_ERROR_MESSAGES,
  BRANCH_CONTENT_MESSAGES,
  BRANCH_CONTENT_SELECT_DATA,
} from '../../../bubbles-components/branchContentDefaultValues';
import {
  addNodeLevelsRequest,
  detailCurriculumRequest,
  generateNodesFromAcademicPortfolioRequest,
  updateNodeLevelRequest,
} from '../../../request';

function AddCurriculumStep2({ onNext, curriculum }) {
  const [store, render] = useStore({
    loading: true,
    curriculum: {},
    newIds: [],
  });

  const { openConfirmationModal } = useLayout();
  const [t] = useTranslateLoader(prefixPN('addCurriculumStep2'));
  const { openDeleteConfirmationModal } = useLayout();
  const tree = useTree();
  const history = useHistory();
  const { id } = useParams();

  const onlyCanAdd = curriculum.step > 2;

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
        actions: [], // ['edit'],
      });
    });

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
        toSave.schemaConfig.schema.type = 'object';
        toSave.schemaConfig.schema.properties = {
          id: {
            type: 'string',
          },
          value: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              value: { type: 'string' },
              metadata: {
                type: 'object',
                additionalProperties: true,
              },
            },
          },
          metadata: {
            type: 'object',
            additionalProperties: true,
          },
        };
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

      const { dataset } = await saveDatasetFieldRequest(
        toSave.locationName,
        toSave.pluginName,
        toSave.schemaConfig,
        toSave.schemaLocales,
        { useDefaultLocaleCallback: false }
      );
      const oldDataset = _.find(store.curriculum.nodeLevels, (l) => l?.schema?.id === dataset.id);
      if (!oldDataset) {
        store.newIds.push(Object.keys(dataset.jsonSchema.properties)[0]);
      } else {
        const oldIds = Object.keys(oldDataset.schema.jsonSchema.properties);
        const newIds = Object.keys(dataset.jsonSchema.properties);

        store.newIds.push(_.difference(newIds, oldIds)[0]);
      }

      await load(true);

      store.activeNodeLevel = find(store.curriculum.nodeLevels, { id: store.activeNodeLevel.id });
      store.saving = false;
    } catch (e) {
      console.error(e);
      store.saving = false;
    }
    render();
  }

  function onRemoveBlock(e) {
    return new Promise((resolve) => {
      openDeleteConfirmationModal({
        onConfirm: async () => {
          try {
            store.removing = true;
            render();
            await removeDatasetFieldRequest(
              `node-level-${store.activeNodeLevel.id}`,
              'plugins.curriculum',
              e.id
            );
            await load(true);
            onSelect(store.activeNodeLevel);
            resolve();
          } catch (e) {}

          store.removing = false;
          render();
        },
      })();
    });
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
          onlyCanAdd={onlyCanAdd}
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
          store={store}
          newIds={store.newIds}
          onlyCanAdd={onlyCanAdd}
          branch={store.activeNodeLevel}
          onSaveBlock={onSaveBlock}
          onRemoveBlock={onRemoveBlock}
          onCloseBranch={onCloseBranch}
        />
      </Box>
    );
  }

  async function goStep3() {
    try {
      if (store.curriculum.step >= 3) {
        onNext();
        return null;
      }
      store.generating = true;
      render();
      await generateNodesFromAcademicPortfolioRequest(store.curriculum.id);
      onNext();
      store.generating = false;
    } catch (err) {
      console.error(err);
      store.generating = false;
    }
    render();
  }

  async function tryGoStep3() {
    openConfirmationModal({
      title: t('nextStep.title'),
      description: t('nextStep.description'),
      labels: {
        confirm: t('nextStep.confirm'),
      },
      onConfirm: async () => {
        goStep3();
      },
    })();
  }

  if (store.loading) {
    return <LoadingOverlay visible />;
  }

  return (
    <ContextContainer
      sx={(theme) => ({ marginBottom: theme.spacing[6] })}
      title={t('pageTitle')}
      description={t('pageDescription')}
      divided
    >
      {store.removing ? <LoadingOverlay visible /> : null}
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
              initialOpen={map(tree.treeData, 'id')}
              selectedNode={store.activeNodeLevel?.id}
              onSelect={onSelect}
            />
          </Box>
        </Col>
        <Col span={9}>
          <Box
            sx={(theme) => ({
              paddingLeft: theme.spacing[6],
            })}
          >
            {rightSection || null}
          </Box>
        </Col>
      </Grid>
      <Stack justifyContent="end">
        <Button loading={store.generating} onClick={tryGoStep3}>
          {t('continueButtonLabel')}
        </Button>
      </Stack>
    </ContextContainer>
  );
}

AddCurriculumStep2.propTypes = {
  onNext: PropTypes.func,
  curriculum: PropTypes.any,
};

export default AddCurriculumStep2; // withLayout(AddCurriculumStep2);
