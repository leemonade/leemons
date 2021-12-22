import React, { useEffect, useState, useMemo } from 'react';
import { find, forEach, forIn, orderBy, cloneDeep, findIndex } from 'lodash';
import { withLayout } from '@layout/hoc';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@curriculum/helpers/prefixPN';
import { listCentersRequest } from '@users/request';
import { Box, Text, Title, Button, Group, Tree, useTree } from '@bubbles-ui/components';
import { useHistory, useParams } from 'react-router-dom';
import { detailProgramRequest } from '@academic-portfolio/request';
import { saveDatasetFieldRequest } from '@dataset/request';
import { addNodeLevelsRequest, detailCurriculumRequest } from '../../../request';
import NewBranchConfig, {
  NEW_BRANCH_CONFIG_MESSAGES,
  NEW_BRANCH_CONFIG_ERROR_MESSAGES,
  NEW_BRANCH_CONFIG_ORDERED_OPTIONS,
} from '../../../bubbles-components/NewBranchConfig';
import BranchContent from '../../../bubbles-components/BranchContent';
import {
  BRANCH_CONTENT_ERROR_MESSAGES,
  BRANCH_CONTENT_MESSAGES,
  BRANCH_CONTENT_SELECT_DATA,
} from '../../../bubbles-components/branchContentDefaultValues';

function AddCurriculumStep2() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeRightSection, setActiveRightSection] = useState(null);
  const [activeNodeLevel, setActiveNodeLevel] = useState(null);
  const [t] = useTranslateLoader(prefixPN('addCurriculumStep2'));
  const [curriculum, setCurriculum] = useState({});

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

  const blockTypeData = useMemo(() => {
    const result = cloneDeep(BRANCH_CONTENT_SELECT_DATA.blockType);
    forEach(result, ({ value }, key) => {
      result[key].label = t(`blockTypeOptions.${value}`);
    });
    return result;
  }, [t]);

  const groupTypeOfContentsData = useMemo(() => {
    const result = cloneDeep(blockTypeData);
    result.splice(findIndex(result, { value: 'group' }), 1);
    return result;
  }, [blockTypeData]);

  async function load() {
    try {
      setLoading(true);
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

      console.log(c);

      setCurriculum(c);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const items = [];

    forEach(curriculum.nodeLevels, (nodeLevel, index) => {
      items.push({
        id: nodeLevel.id,
        parent: index === 0 ? 0 : items[index - 1].id,
        draggable: false,
        text: nodeLevel.name,
      });
    });

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

    tree.setTreeData(items);
  }, [curriculum]);

  async function addNewBranch({ ordered, ...rest }) {
    try {
      setSaving(true);
      await addNodeLevelsRequest(curriculum.id, [
        {
          ...rest,
          type: 'custom',
          listType: ordered,
          levelOrder:
            curriculum.nodeLevels && curriculum.nodeLevels.length
              ? curriculum.nodeLevels[curriculum.nodeLevels.length - 1].levelOrder + 1
              : 0,
        },
      ]);
      await load();
      setSaving(false);
    } catch (e) {
      setSaving(false);
    }
  }

  async function onSelect({ id: nodeLevelId }) {
    setActiveNodeLevel(find(curriculum.nodeLevels, { id: nodeLevelId }));
    setActiveRightSection('detail-branch');
  }

  async function onSaveBlock(data) {
    const toSave = {
      locationName: `node-level-${activeNodeLevel.id}`,
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
        [curriculum.locale]: {
          schema: {},
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
      default:
        break;
    }

    try {
      setSaving(true);

      await saveDatasetFieldRequest(
        toSave.locationName,
        toSave.pluginName,
        toSave.schemaConfig,
        toSave.schemaLocales
      );
      await load();

      setSaving(false);
    } catch (e) {
      setSaving(false);
    }
  }

  const groupChilds = [
    <Box key="child-1">
      <Tree
        {...tree}
        rootId={0}
        onAdd={() => setActiveRightSection('new-branch')}
        onDelete={(node) => alert(`Delete nodeId: ${node.id}`)}
        onEdit={(node) => alert(`Editing ${node.id}`)}
        onSelect={onSelect}
      />
    </Box>,
  ];

  if (activeRightSection === 'new-branch') {
    groupChilds.push(
      <Box key="child-2">
        <NewBranchConfig
          messages={messagesConfig}
          errorMessages={errorMessagesConfig}
          orderedData={orderedData}
          isLoading={saving}
          onSubmit={addNewBranch}
        />
      </Box>
    );
  }

  if (activeRightSection === 'detail-branch') {
    groupChilds.push(
      <Box key="child-3">
        <BranchContent
          messages={messagesContent}
          errorMessages={errorMessagesContent}
          selectData={{
            blockType: blockTypeData,
            blockOrdered: orderedData,
            groupTypeOfContents: groupTypeOfContentsData,
          }}
          branch={activeNodeLevel}
          onSaveBlock={onSaveBlock}
        />
      </Box>
    );
  }

  if (loading) {
    return <Box>Loading...</Box>;
  }
  return (
    <Box m={32}>
      <Box mb={12}>
        <Title>{curriculum.name}</Title>
      </Box>
      <Box mb={12}>
        <Title order={3}>
          {curriculum.center.name}|{curriculum.program.name}
        </Title>
      </Box>
      <Box mb={12}>
        <Text role={'productive'}>{t('description1')}</Text>
      </Box>
      <Box mb={16}>
        <Text role={'productive'}>{t('description2')}</Text>
      </Box>

      <Group grow align="start">
        {groupChilds}
      </Group>
    </Box>
  );
}

export default withLayout(AddCurriculumStep2);
