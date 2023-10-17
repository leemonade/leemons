import React, { useEffect, useMemo, useState } from 'react';
import * as _ from 'lodash';
import { find, forEach, forIn, isArray, orderBy } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@curriculum/helpers/prefixPN';
import { listCentersRequest } from '@users/request';
import { Box, Group, Text, Title, Tree, useTree, LoadingOverlay } from '@bubbles-ui/components';
import { useParams } from 'react-router-dom';
import { detailProgramRequest } from '@academic-portfolio/request';
import { detailCurriculumRequest } from '../../../request';
import NewBranchDetailValue, {
  NEW_BRANCH_DETAIL_VALUE_ERROR_MESSAGES,
  NEW_BRANCH_DETAIL_VALUE_MESSAGES,
} from '../../../bubbles-components/NewBranchDetailValue';

function CurriculumView() {
  const [loading, setLoading] = useState(true);
  const [activeNode, setActiveNode] = useState(null);
  const [activeRightSection, setActiveRightSection] = useState(null);
  const [t] = useTranslateLoader(prefixPN('curriculumView'));
  const [curriculum, setCurriculum] = useState(null);

  const tree = useTree();
  const { id } = useParams();

  const activeNodeSchema = useMemo(() => {
    if (activeNode) {
      const schema = _.cloneDeep(activeNode.nodeLevel.schema);
      if (schema && schema.compileJsonSchema) {
        _.forIn(schema.compileJsonSchema.properties, (value, key) => {
          if (!schema.compileJsonUI[key]) schema.compileJsonUI[key] = {};
          schema.compileJsonUI[key]['ui:readonly'] = true;
        });
      }
      return schema;
    }
  }, [activeNode]);

  const messagesBranchValues = useMemo(() => {
    const result = {};
    forIn(NEW_BRANCH_DETAIL_VALUE_MESSAGES, (value, key) => {
      result[key] = t(`newBranchValue.${key}`);
    });
    return result;
  }, [t]);

  const errorMessagesBranchValues = useMemo(() => {
    const result = {};
    forIn(NEW_BRANCH_DETAIL_VALUE_ERROR_MESSAGES, (value, key) => {
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
            if (node.childrens) {
              addNodes(node.childrens, node.id, nextDeep + 1);
            }
          });
        };
        addNodes(curriculum.nodes, 0, 1);
      }

      tree.setTreeData(items);
    }
  }, [curriculum]);

  async function onSelect({ node }) {
    setActiveRightSection(null);
    setActiveNode(null);
    setTimeout(() => {
      setActiveNode({ ...node, nodeLevel: find(curriculum.nodeLevels, { id: node.nodeLevel }) });
      setActiveRightSection('detail-branch-value');
    }, 5);
  }

  const groupChilds = [
    <Box key="child-1">
      <Tree {...tree} rootId={0} onSelect={onSelect} />
    </Box>,
  ];

  if (activeRightSection === 'detail-branch-value') {
    groupChilds.push(
      <Box key="child-2">
        <NewBranchDetailValue
          messages={messagesBranchValues}
          errorMessages={errorMessagesBranchValues}
          defaultValues={{ name: activeNode.name, id: activeNode.id }}
          readonly={true}
          schema={
            activeNodeSchema
              ? {
                  jsonSchema: activeNodeSchema.compileJsonSchema,
                  jsonUI: activeNodeSchema.compileJsonUI,
                }
              : null
          }
          schemaFormValues={activeNode.formValues}
        />
      </Box>
    );
  }

  if (loading) {
    return <LoadingOverlay visible />;
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

export default CurriculumView; // withLayout(AddCurriculumStep2);
