import React, { useEffect, useState } from 'react';
import { find, forEach } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@curriculum/helpers/prefixPN';
import { listCentersRequest } from '@users/request';
import {
  Box,
  Checkbox,
  ContextContainer,
  PageContainer,
  Paper,
  Tree,
  useTree,
  LoadingOverlay,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { useHistory, useParams } from 'react-router-dom';
import { detailProgramRequest } from '@academic-portfolio/request';
import { addNodeLevelsRequest, detailCurriculumRequest } from '../../../request';

function AddCurriculumStep1() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [t, translations] = useTranslateLoader(prefixPN('addCurriculumStep1'));
  const [curriculum, setCurriculum] = useState({});
  const [nodeLevels, setNodeLevels] = useState([]);

  const tree = useTree();
  const history = useHistory();
  const { id } = useParams();

  function onCheckboxChange(event, nodeLevel, levelOrder) {
    if (event) {
      nodeLevels[levelOrder] = nodeLevel;
      setNodeLevels([...nodeLevels]);
    } else {
      delete nodeLevels[levelOrder];
      setNodeLevels([...nodeLevels]);
    }
  }

  useEffect(() => {
    tree.setTreeData([
      {
        id: 'program',
        parent: 0,
        draggable: false,
        text: (
          <Checkbox
            label={t('program')}
            checked={nodeLevels.indexOf('program') >= 0}
            onChange={(e) => onCheckboxChange(e, 'program', 1)}
          />
        ),
      },
      {
        id: 'courses',
        parent: 'program',
        draggable: false,
        text: (
          <Checkbox
            label={t('courses')}
            checked={nodeLevels.indexOf('courses') >= 0}
            onChange={(e) => onCheckboxChange(e, 'courses', 2)}
          />
        ),
      },
      {
        id: 'groups',
        parent: 'courses',
        draggable: false,
        text: (
          <Checkbox
            label={t('groups')}
            checked={nodeLevels.indexOf('groups') >= 0}
            onChange={(e) => onCheckboxChange(e, 'groups', 3)}
          />
        ),
      },
      {
        id: 'knowledges',
        parent: 'subjectType',
        draggable: false,
        text: (
          <Checkbox
            label={t('knowledges')}
            checked={nodeLevels.indexOf('knowledges') >= 0}
            onChange={(e) => onCheckboxChange(e, 'knowledges', 4)}
          />
        ),
      },
      {
        id: 'subjectType',
        parent: 'groups',
        draggable: false,
        text: (
          <Checkbox
            label={t('subjectType')}
            checked={nodeLevels.indexOf('subjectType') >= 0}
            onChange={(e) => onCheckboxChange(e, 'subjectType', 5)}
          />
        ),
      },
    ]);
  }, [translations, nodeLevels]);

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

      setCurriculum(c);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    try {
      setSaving(true);
      const toSend = [];
      forEach(nodeLevels, (nodeLevel) => {
        if (nodeLevel) {
          toSend.push({
            name: t(nodeLevel),
            type: nodeLevel,
            listType: 'style-1',
            levelOrder: toSend.length,
          });
        }
      });
      await addNodeLevelsRequest(curriculum.id, toSend);
      await history.push(`/private/curriculum/${curriculum.id}/step/2`);
      setSaving(false);
    } catch (e) {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingOverlay visible />;
  }
  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        loading={saving ? 'edit' : null}
        buttons={{ edit: t('saveButtonLabel') }}
        onEdit={save}
        values={{
          title: `${curriculum.name} (${curriculum.center.name}|${curriculum.program.name})`,
          description: t('description1') + t('description2'),
        }}
      />

      <Paper fullHeight color="solid" shadow="none" padding={0}>
        <PageContainer>
          <ContextContainer padded="vertical">
            <Paper fullWidth padding={5}>
              <ContextContainer divided>
                <Tree {...tree} rootId={0} />
              </ContextContainer>
            </Paper>
          </ContextContainer>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}

export default AddCurriculumStep1;
