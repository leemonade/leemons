import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {
  Box,
  Button,
  ContextContainer,
  HtmlText,
  ImageLoader,
  SegmentedControl,
  Title,
} from '@bubbles-ui/components';
import { CurriculumListContents } from '@curriculum/components/CurriculumListContents';
import { useClassesSubjects } from '@academic-portfolio/hooks';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { useQuery } from '@tanstack/react-query';
import { getAssetsByIdsRequest } from '@leebrary/request';
import { useCurriculumVisibleValues } from '@assignables/components/Assignment/components/EvaluationType';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';

function CurriculumTab({ subjects, curriculumTab, labels }) {
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
    </Box>
  );
}

function CurriculumRender({ assignation, showCurriculum: showCurriculumObj, labels }) {
  const curriculum = useCurriculumVisibleValues({ assignation });
  const subjects = useClassesSubjects(assignation.instance.classes);

  const subjectsWithCurriculum = React.useMemo(
    () =>
      curriculum
        ?.map((subject) => ({
          ...subject,
          name: subjects.find((s) => s.id === subject.subject)?.name,
        }))
        ?.filter((subject) => subject.name),
    [subjects, curriculum]
  );

  const [curriculumTab, setCurriculumTab] = React.useState(0);

  if (Object.keys(showCurriculumObj).length === 0 || subjectsWithCurriculum?.length === 0) {
    return null;
  }

  return (
    <ContextContainer>
      <Title order={4} color="primary">
        {labels?.title}
      </Title>
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
        labels={labels}
      />
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
      })
        .then((response) => response.assets[0])
        .then((asset) => (asset ? prepareAsset(asset) : asset)),
    { enabled: !!assignable?.metadata?.leebrary?.statementImage?.[0] }
  );

  return query;
}

export default function StatementStep({
  assignation,
  localizations: _labels,
  setButtons,
  hasNextStep,
  hasNextActivity,
  onNextStep,
  preview,
}) {
  const labels = _labels.statement_step;

  const { instance } = assignation;
  const { assignable } = instance;

  const { data: supportImage } = useSupportImage(assignable);
  const showCurriculum = instance.curriculum;
  const isGradable = assignable.gradable;

  const now = dayjs();
  const startDate = dayjs(assignation?.instance?.dates?.start || null);
  const canSubmit =
    (!!preview && hasNextStep) ||
    (!preview &&
      (assignation?.instance?.alwaysAvailable ||
        (startDate.isValid() && !now.isBefore(startDate))));

  React.useEffect(() => {
    setButtons(
      <>
        <Box></Box>
        {(hasNextStep || !hasNextActivity) && (
          <Button
            onClick={onNextStep}
            variant={hasNextStep ? 'outline' : 'filled'}
            rightIcon={<ChevRightIcon />}
            rounded
            disabled={!canSubmit}
          >
            {hasNextStep ? _labels?.buttons?.next : _labels?.buttons?.finish}
          </Button>
        )}
        {!hasNextStep && hasNextActivity && (
          <Button
            variant="filled"
            rightIcon={<ChevRightIcon />}
            disabled={!canSubmit}
            rounded
            onClick={onNextStep}
          >
            {_labels?.buttons?.nextActivity}
          </Button>
        )}
      </>
    );
  }, [setButtons, onNextStep, hasNextStep, _labels?.buttons, hasNextActivity, canSubmit]);

  return (
    <ContextContainer>
      <ContextContainer>
        <Title order={2} color="primary">
          {isGradable ? labels?.statement : labels?.presentation}
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
  localizations: PropTypes.shape({
    statement_step: PropTypes.object,
  }),
  setButtons: PropTypes.func,
  hasNextStep: PropTypes.bool,
  hasNextActivity: PropTypes.bool,
  onNextStep: PropTypes.func,
};
