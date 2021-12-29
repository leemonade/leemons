import React, { useEffect, useState, useMemo } from 'react';
import { find, forEach, orderBy, isArray, forIn, findIndex } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@curriculum/helpers/prefixPN';
import { listCentersRequest } from '@users/request';
import { Box, Text, Title, Group, Tree, useTree } from '@bubbles-ui/components';
import { useParams } from 'react-router-dom';
import { detailProgramRequest } from '@academic-portfolio/request';
import { addNodeRequest, detailCurriculumRequest, saveNodeRequest } from '../../../request';
import NewBranchValue, {
  NEW_BRANCH_VALUE_ERROR_MESSAGES,
  NEW_BRANCH_VALUE_MESSAGES,
} from '../../../bubbles-components/NewBranchValue';
import NewBranchDetailValue from '../../../bubbles-components/NewBranchDetailValue';

function AddCurriculumStep3() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeNode, setActiveNode] = useState(null);
  const [activeRightSection, setActiveRightSection] = useState(null);
  const [t] = useTranslateLoader(prefixPN('addCurriculumStep3'));
  const [curriculum, setCurriculum] = useState(null);

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
    if (curriculum) {
      const items = [];

      if (isArray(curriculum.nodes) && curriculum.nodes.length) {
        const addNodes = (nodes, parent, nextDeep) => {
          forEach(nodes, (node) => {
            items.push({
              id: node.id,
              parent,
              draggable: false,
              text: node.fullName,
              node,
            });
            if (curriculum.nodeLevels[nextDeep]) {
              items.push({
                id: `add-button-${node.id}`,
                parent: node.id,
                text: t('addNode', { name: curriculum.nodeLevels[nextDeep].name }),
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
        addNodes(curriculum.nodes, 0, 1);
      }
      items.push({
        id: 'add-button',
        parent: 0,
        text: t('addNode', { name: curriculum.nodeLevels[0].name }),
        type: 'button',
        draggable: false,
        node: null,
        data: {
          action: 'add',
        },
      });

      tree.setTreeData(items);
    }
  }, [curriculum]);

  async function onSelect({ node }) {
    setActiveNode({ ...node, nodeLevel: find(curriculum.nodeLevels, { id: node.nodeLevel }) });
    setActiveRightSection('detail-branch-value');
  }

  async function onAdd({ node }) {
    setActiveNode(node);
    setActiveRightSection('add-branch-value');
  }

  async function onAddBranchValue(data) {
    try {
      setSaving(true);
      if (!data.id) {
        const toSend = {
          curriculum: curriculum.id,
          name: data.name,
          nodeLevel: curriculum.nodeLevels[0].id,
          parentNode: null,
          nodeOrder: curriculum.nodes.length,
        };
        if (activeNode) {
          const parentNodeLevelIndex = findIndex(curriculum.nodeLevels, {
            id: activeNode.nodeLevel,
          });
          toSend.nodeLevel = curriculum.nodeLevels[parentNodeLevelIndex + 1].id;
          toSend.parentNode = activeNode.id;
          toSend.nodeOrder = activeNode.childrens.length;
        }
        await addNodeRequest(toSend);
      } else {
        await saveNodeRequest(data);
      }
      await load();
      setActiveRightSection(null);
      setActiveNode(null);
      setSaving(false);
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  }

  const groupChilds = [
    <Box key="child-1">
      <Tree
        {...tree}
        rootId={0}
        onAdd={onAdd}
        onDelete={(node) => alert(`Delete nodeId: ${node.id}`)}
        onEdit={(node) => alert(`Editing ${node.id}`)}
        onSelect={onSelect}
      />
    </Box>,
  ];

  if (activeRightSection === 'add-branch-value') {
    groupChilds.push(
      <Box key="child-2">
        <NewBranchValue
          messages={messagesBranchValues}
          errorMessages={errorMessagesBranchValues}
          onSubmit={onAddBranchValue}
          isLoading={saving}
        />
      </Box>
    );
  }
  if (activeRightSection === 'detail-branch-value') {
    groupChilds.push(
      <Box key="child-2">
        <NewBranchDetailValue
          messages={messagesBranchValues}
          errorMessages={errorMessagesBranchValues}
          onSubmit={onAddBranchValue}
          isLoading={saving}
          defaultValues={{ name: activeNode.name, id: activeNode.id }}
          schema={
            activeNode.nodeLevel.schema
              ? {
                  jsonSchema: activeNode.nodeLevel.schema.compileJsonSchema,
                  jsonUI: activeNode.nodeLevel.schema.compileJsonUI,
                }
              : null
          }
          schemaFormValues={activeNode.formValues}
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

export default AddCurriculumStep3; // withLayout(AddCurriculumStep2);
