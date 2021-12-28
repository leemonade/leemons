import React, { useEffect, useState } from 'react';
import { find, forEach, orderBy, isArray } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@curriculum/helpers/prefixPN';
import { listCentersRequest } from '@users/request';
import { Box, Text, Title, Group, Tree, useTree } from '@bubbles-ui/components';
import { useParams } from 'react-router-dom';
import { detailProgramRequest } from '@academic-portfolio/request';
import { detailCurriculumRequest } from '../../../request';

function AddCurriculumStep3() {
  const [loading, setLoading] = useState(true);
  const [t] = useTranslateLoader(prefixPN('addCurriculumStep3'));
  const [curriculum, setCurriculum] = useState(null);

  const tree = useTree();
  const { id } = useParams();

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
      console.log(curriculum);
      const items = [];

      if (isArray(curriculum.nodes) && curriculum.nodes.length) {
        const addNodes = (nodes, parent, nextDeep) => {
          forEach(nodes, (node) => {
            items.push({
              id: node.id,
              parent,
              draggable: false,
              text: node.name,
            });
            if (curriculum.nodeLevels[nextDeep]) {
              items.push({
                id: `add-button-${node.id}`,
                parent: node.id,
                text: t('addNode', { name: curriculum.nodeLevels[nextDeep].name }),
                type: 'button',
                draggable: false,
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
      } else if (curriculum.nodeLevels.length) {
        items.push({
          id: 'add-button',
          parent: 0,
          text: t('addNode', { name: curriculum.nodeLevels[0].name }),
          type: 'button',
          draggable: false,
          data: {
            action: 'add',
          },
        });
      }

      tree.setTreeData(items);
    }
  }, [curriculum]);

  async function onSelect({ id: nodeLevelId }) {
    console.log(nodeLevelId);
  }

  async function onAdd(data) {
    console.log(data);
  }

  const groupChilds = [
    <Box key="child-1">
      <Tree
        {...tree}
        rootId={0}
        onAdd={() => onAdd}
        onDelete={(node) => alert(`Delete nodeId: ${node.id}`)}
        onEdit={(node) => alert(`Editing ${node.id}`)}
        onSelect={onSelect}
      />
    </Box>,
  ];

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
