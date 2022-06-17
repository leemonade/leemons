import React from 'react';
import PropTypes from 'prop-types';
import {
  ContextContainer,
  HtmlText,
  Box,
  Tabs,
  TabPanel,
  Title,
  ImageLoader,
} from '@bubbles-ui/components';
import { CurriculumListContents } from '@curriculum/components/CurriculumListContents';
import { useClassesSubjects } from '@academic-portfolio/hooks';
import prepareAsset, { getFileUrl } from '@leebrary/helpers/prepareAsset';
import { useQuery } from 'react-query';
import { getAssetsByIdsRequest } from '@leebrary/request';

function CurriculumRender({ assignation, showCurriculum: showCurriculumObj, labels }) {
  const {
    content: showContent,
    objectives: showObjectives,
    assessmentCriteria: showAssessmentCriteria,
  } = showCurriculumObj;

  const showCurriculum = showContent || showObjectives || showAssessmentCriteria;

  const { instance } = assignation;
  const { assignable } = instance;

  if (!showCurriculum) {
    return null;
  }

  const subjects = useClassesSubjects(instance.classes);

  return (
    <ContextContainer>
      <Title order={4} color="primary">
        {labels?.title}
      </Title>
      <Tabs>
        {subjects.map(({ id, name }) => {
          const { curriculum } = assignable.subjects.find((s) => s.subject === id);
          const tabPanelStyle = (theme) => ({ marginLeft: theme.spacing[3] });
          return (
            <TabPanel key={id} label={name}>
              {/*
                EN: Box to add margin
                ES: Box para agregar margen
              */}
              <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}></Box>

              <Box
                sx={(theme) => ({
                  display: 'flex',
                  flexDirection: 'column',
                  gap: theme.spacing[4],
                })}
              >
                {showContent && curriculum?.contents?.length && (
                  <Box sx={tabPanelStyle}>
                    <Box>
                      <Title color="primary" order={5}>
                        {labels?.content}
                      </Title>
                      <CurriculumListContents value={curriculum?.contents} />
                    </Box>
                  </Box>
                )}
                {showAssessmentCriteria && curriculum?.assessmentCriteria?.length && (
                  <Box sx={tabPanelStyle}>
                    <Box>
                      <Title color="primary" order={5}>
                        {labels?.assessmentCriteria}
                      </Title>
                      <CurriculumListContents value={curriculum?.assessmentCriteria} />
                    </Box>
                  </Box>
                )}
                {!!showObjectives && !!curriculum?.objectives?.length && (
                  <Box sx={tabPanelStyle}>
                    <Box>
                      <Title color="primary" order={5}>
                        {labels?.objectives}
                      </Title>
                      {/* TODO: Use react lists */}
                      <HtmlText>
                        {`
                      <ul>
                      ${curriculum?.objectives
                        ?.map(
                          (objective) =>
                            `<li>
                            ${objective}
                          </li>`
                        )
                        ?.join('')}
                      </ul>
                    `}
                      </HtmlText>
                    </Box>
                  </Box>
                )}
              </Box>
            </TabPanel>
          );
        })}
      </Tabs>
    </ContextContainer>
  );
}

CurriculumRender.propTypes = {
  assignation: PropTypes.object.isRequired,
  showCurriculum: PropTypes.object.isRequired,
  labels: PropTypes.object.isRequired,
};

function useSupportImage(assignable) {
  const query = useQuery(
    ['asset', { id: assignable?.metadata?.leebrary?.statementImage?.[0] }],
    () =>
      getAssetsByIdsRequest([assignable?.metadata?.leebrary?.statementImage?.[0]], {
        indexable: false,
        showPublic: true,
      }).then((response) => response.assets[0]),
    { enabled: !!assignable?.metadata?.leebrary?.statementImage?.[0] }
  );

  if (query.data) {
    query.data = prepareAsset(query.data);
  }

  return query;
}
export default function StatementStep({ assignation, labels: _labels }) {
  const labels = _labels.statement_step;

  const { instance } = assignation;
  const { assignable } = instance;

  const { data: supportImage } = useSupportImage(assignable);

  const showCurriculum = instance.curriculum;

  return (
    <ContextContainer>
      <ContextContainer>
        <Title order={2} color="primary">
          {labels?.statement}
        </Title>
        <HtmlText>{assignable?.statement}</HtmlText>
        {!!supportImage && <ImageLoader src={supportImage.url} height="auto" />}
      </ContextContainer>
      <CurriculumRender
        assignation={assignation}
        showCurriculum={showCurriculum}
        labels={labels?.curriculum}
      />
    </ContextContainer>
  );
}

StatementStep.propTypes = {
  assignation: PropTypes.shape({
    instance: PropTypes.shape({
      curriculum: PropTypes.shape({
        content: PropTypes.bool,
        assessmentCriteria: PropTypes.bool,
        objectives: PropTypes.bool,
      }),
      assignable: PropTypes.shape({
        statement: PropTypes.string,
        curriculum: PropTypes.shape({
          content: PropTypes.arrayOf(PropTypes.string),
          assessmentCriteria: PropTypes.arrayOf(PropTypes.string),
          objectives: PropTypes.arrayOf(PropTypes.string),
        }),
      }),
    }),
  }),
  labels: PropTypes.shape({
    statement_step: PropTypes.object,
  }),
};
