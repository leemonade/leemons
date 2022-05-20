import React, { useEffect, useState, useMemo } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  ContextContainer,
  Paragraph,
  Button,
  HtmlText,
  Box,
  Tabs,
  TabPanel,
} from '@bubbles-ui/components';
import { useApi } from '@common';
import { classDetailForDashboard } from '@academic-portfolio/request/classes';
import { CurriculumListContents } from '@curriculum/components/CurriculumListContents';

function getClasses(classes) {
  return Promise.all(classes.map(classDetailForDashboard));
}

function useClassesSubjects(classes) {
  const [classesData, error, loading] = useApi(getClasses, classes);

  if (loading) {
    return [];
  }
  if (error) {
    // TODO: Add error alert
    return [];
  }

  const subjects = _.map(classesData, 'classe.subject');
  return _.uniqBy(subjects, 'id');
}

function CurriculumRender({ assignation, showCurriculum: showCurriculumObj }) {
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
    <ContextContainer title="Curriculum">
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

              {showContent && curriculum?.content?.length && (
                <Box sx={tabPanelStyle}>
                  <ContextContainer title="Content">
                    <CurriculumListContents value={curriculum?.content} />
                  </ContextContainer>
                </Box>
              )}
              {showAssessmentCriteria && curriculum?.assessmentCriteria?.length && (
                <Box sx={tabPanelStyle}>
                  <ContextContainer title="Assessment Criteria">
                    <CurriculumListContents value={curriculum?.assessmentCriteria} />
                  </ContextContainer>
                </Box>
              )}
              {showObjectives && curriculum?.objectives?.length && (
                <Box sx={tabPanelStyle}>
                  <ContextContainer title="Custom objectives">
                    {/* TODO: Use react lists */}
                    <HtmlText>
                      {`
                      <ul>
                      ${curriculum?.objectives?.map(
                        (objective) =>
                          `<li>
                            ${objective}
                            </li>`
                      )}
                      </ul>
                    `}
                    </HtmlText>
                  </ContextContainer>
                </Box>
              )}
            </TabPanel>
          );
        })}
      </Tabs>
    </ContextContainer>
  );
}
export default function SummaryStep({ assignation }) {
  const { instance } = assignation;
  const { assignable } = instance;
  const { asset } = assignable;

  const showCurriculum = instance.curriculum;

  return (
    <ContextContainer>
      <ContextContainer title="Summary">
        <Paragraph>{asset?.description}</Paragraph>
      </ContextContainer>
      <CurriculumRender assignation={assignation} showCurriculum={showCurriculum} />
    </ContextContainer>
  );
}

SummaryStep.propTypes = {
  id: PropTypes.string.isRequired,
  instance: PropTypes.string.isRequired,
  onNext: PropTypes.func.isRequired,
};
