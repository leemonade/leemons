import React from 'react';
import PropTypes from 'prop-types';
import { Box, ContextContainer, HtmlText, SegmentedControl, Title } from '@bubbles-ui/components';
import { CurriculumListContents } from '@curriculum/components/CurriculumListContents';
import { useClassesSubjects } from '@academic-portfolio/hooks';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { useQuery } from '@tanstack/react-query';
import { getAssetsByIdsRequest } from '@leebrary/request';
import { useCurriculumVisibleValues } from '@assignables/components/Assignment/components/EvaluationType';
import { uniqBy } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@tasks/helpers';

function CurriculumTab({ subjects, curriculumTab }) {
  const [t] = useTranslateLoader(prefixPN('task_realization.statement_step.curriculum'));

  const subject = subjects[curriculumTab];

  if (!subject) {
    return null;
  }

  const { curriculum, subject: id } = subject;

  // console.log('Curriculum', subject);
  const tabPanelStyle = (theme) => ({ marginLeft: theme.spacing[3] });
  return (
    <Box key={id}>
      {/*
              EN: Box to add margin
              ES: Box para agregar margen
            */}
      <Box sx={(theme) => ({ marginTop: theme.spacing[4] })} />

      <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing[4],
        })}
      >
        {!!curriculum?.curriculum?.length && (
          <Box sx={tabPanelStyle}>
            <Box>
              <CurriculumListContents value={curriculum?.curriculum} subjects={id} />
            </Box>
          </Box>
        )}
        {!!['objectives'].includes('objectives') && !!curriculum?.objectives?.length && (
          <Box sx={tabPanelStyle}>
            <Box>
              <Title color="primary" order={5}>
                {t('objectives')}
              </Title>
              {/* TODO: Use react lists */}
              <HtmlText>
                {`
              <ul>
              ${curriculum?.objectives
                ?.map(
                  (objective) => `<li>
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
    </Box>
  );
}

export function CurriculumRender({ assignation, showCurriculum: showCurriculumObj = {} }) {
  const [t] = useTranslateLoader(prefixPN('task_realization.statement_step.curriculum'));
  const curriculum = useCurriculumVisibleValues({ assignation });
  const subjects = useClassesSubjects(assignation.instance.classes);

  const subjectsWithCurriculum = React.useMemo(
    () =>
      uniqBy(
        curriculum
          ?.map((subject) => ({
            ...subject,
            name: subjects.find((s) => s.id === subject.subject)?.name,
          }))
          ?.filter((subject) => subject.name),
        'subject'
      ),
    [(subjects, curriculum)]
  );

  const [curriculumTab, setCurriculumTab] = React.useState(0);

  if (Object.keys(showCurriculumObj).length === 0 || subjectsWithCurriculum?.length === 0) {
    return null;
  }

  return (
    <ContextContainer>
      {subjectsWithCurriculum?.length > 1 && (
        <SegmentedControl
          data={subjectsWithCurriculum.map((subject, i) => ({
            value: `${i}`,
            label: subject.name,
          }))}
          value={`${curriculumTab}`}
          onChange={(value) => setCurriculumTab(Number(value))}
        />
      )}
      <CurriculumTab
        curriculumTab={curriculumTab}
        subjects={subjectsWithCurriculum}
        assignation={assignation}
      />
    </ContextContainer>
  );
}
CurriculumRender.propTypes = {
  assignation: PropTypes.object.isRequired,
  showCurriculum: PropTypes.object.isRequired,
};
export function useSupportImage(assignable) {
  return useQuery(
    ['asset', { id: assignable?.metadata?.leebrary?.statementImage?.[0] }],
    () =>
      getAssetsByIdsRequest([assignable?.metadata?.leebrary?.statementImage?.[0]], {
        indexable: false,
        showPublic: true,
      })
        .then((response) => response.assets[0])
        .then((asset) => (asset ? prepareAsset(asset) : asset)),
    { enabled: !!assignable?.metadata?.leebrary?.statementImage?.[0] }
  );
}
