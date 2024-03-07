// {/* <Box
// sx={{
//   'div div:nth-child(2)': {
//     overflow: 'hidden',
//   },
// }}
// > */}
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Box,
  LoadingOverlay,
  Button,
  createStyles,
  HtmlText,
  TotalLayoutContainer,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
  Stack,
  ActivityAccordion,
  ActivityAccordionPanel,
  ProgressBottomBar,
} from '@bubbles-ui/components';
import { AlertInformationCircleIcon } from '@bubbles-ui/icons/solid';
// TODO: import from @feedback plugin maybe?
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { addErrorAlert } from '@layout/alert';
import { prefixPN } from '@scorm/helpers';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import useAssignableInstances from '@assignables/hooks/assignableInstance/useAssignableInstancesQuery';
import usePackage from '@scorm/request/hooks/queries/usePackage';
import useAssignation from '@scorm/request/hooks/queries/useAssignation';
import { updateStatus } from '@scorm/request/assignation';
import useClassData from '@assignables/hooks/useClassDataQuery';
import { useLocale } from '@common';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import { useUpdateTimestamps } from '@tasks/components/Student/TaskDetail/__DEPRECATED__components/Steps/Steps';
import useNextActivityUrl from '@assignables/hooks/useNextActivityUrl';
import { useLayout } from '@layout/context';
import { isEmpty, isEqual } from 'lodash';
import dayjs from 'dayjs';
import { ScormRender } from '@scorm/components/ScormRender';
import getScormProgress from '@scorm/helpers/getScormProgress';
import ActivityHeader from '@assignables/components/ActivityHeader/index';
import { useScorm as useScormEvents } from '../../hooks/useScorm';

function onSetValue({ instance, user, commit, LatestCommit, setProgress }) {
  const isNew = !isEqual(LatestCommit.current?.cmi, commit?.cmi);

  if (!isNew) {
    return;
  }

  if (!isEmpty(commit)) {
    LatestCommit.current = { ...commit, leemonsCommitDate: new Date() };
  }

  setProgress(getScormProgress({ state: LatestCommit.current, ensurePercentage: false }));

  updateStatus({ instance, user, state: commit }).catch((e) => addErrorAlert(e.message));
}

function useData({ id, user }) {
  const { data: instance, isLoading: instanceIsLoading } = useAssignableInstances({
    id,
    enabled: !!id,
  });

  const { data: scormAssignation, isLoading: assignationIsLoading } = useAssignation({
    instance: id,
    user,
    enabled: !!id && !!user,
  });

  const { assignation, scormStatus: state } = scormAssignation ?? {};

  const assignationWithInstance = useMemo(
    () => ({ ...assignation, instance }),
    [assignation, instance]
  );

  const { data: scormPackage, isLoading: scormIsLoading } = usePackage({
    id: instance?.assignable?.id,
    enabled: !!instance?.assignable?.id,
  });

  const { data: classData, isLoading: classDataIsLoading } = useClassData(instance);
  const coverUrl = React.useMemo(
    () => getFileUrl(scormPackage?.asset?.cover?.id ?? scormPackage?.asset?.cover),
    [scormPackage?.asset?.cover]
  );

  return {
    instance,
    scormAssignation,
    scormPackage,
    assignation: assignationWithInstance,
    state,
    classData,
    coverUrl,
    isFinished:
      !!assignation?.timestamps?.end && !dayjs(assignation?.timestamps?.end).isAfter(dayjs()),

    isLoading: instanceIsLoading || assignationIsLoading || scormIsLoading || classDataIsLoading,
  };
}

export const useViewStyles = createStyles((theme) => ({
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    background: theme.white,
    borderTop: '1px solid #BAC2D0',
    padding: 10,
  },
  progressBottomBarContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBottomBar: {
    width: '70%',
  },
}));

function useOnScormComplete({ updateTimestamps, nextActivityUrl, moduleId, LatestCommit }) {
  const [t] = useTranslateLoader(prefixPN('scormView'));
  // const { openConfirmationModal } = useLayout();
  const history = useHistory();

  // const showSubmissionModal = async (progress) => {
  //   const labels = {
  //     description:
  //       progress === null
  //         ? t('modal.noProgressDescription')
  //         : t('modal.description')?.replace('{{progress}}', progress),
  //     cancel: t('modal.cancel'),
  //   };

  //   if (progress === 100) {
  //     labels.title = t('modal.completedTitle');
  //   } else if (progress < 100) {
  //     labels.title = t('modal.uncompletedTitle');
  //   } else {
  //     labels.title = t('modal.title');
  //   }

  //   if (nextActivityUrl) {
  //     labels.confirm = t('modal.nextActivity');
  //   } else if (moduleId) {
  //     labels.confirm = t('modal.goToModule');
  //   } else if (progress === 100) {
  //     labels.confirm = t('modal.finish');
  //   } else {
  //     labels.confirm = t('modal.finishAnyway');
  //   }

  //   openConfirmationModal({
  //     title: labels.title,
  //     description: <HtmlText>{labels.description}</HtmlText>,
  //     labels: {
  //       cancel: labels.cancel,
  //       confirm: labels.confirm,
  //     },

  //     onConfirm: () => {
  //       updateTimestamps('end');

  //       if (nextActivityUrl) {
  //         history.push(nextActivityUrl);
  //       } else if (moduleId) {
  //         history.push(`/private/learning-paths/modules/dashboard/${moduleId}`);
  //       } else {
  //         history.push('/private/assignables/ongoing');
  //       }
  //     },
  //   })();
  // };

  const onComplete = () => {
    updateTimestamps('end');

    if (nextActivityUrl) {
      history.push(nextActivityUrl);
    } else if (moduleId) {
      history.push(`/private/learning-paths/modules/dashboard/${moduleId}`);
    } else {
      history.push('/private/assignables/ongoing');
    }

    // const progress = getScormProgress({ state: LatestCommit, ensurePercentage: false });

    // showSubmissionModal(progress);
  };

  return { onComplete };
}

function getButtonLabel({ nextActivityUrl, moduleId, t }) {
  if (nextActivityUrl) {
    return t('nextActivity');
  }
  if (moduleId) {
    return t('modal.goToModule');
  }
  return t('markAsFinish');
}

export default function View() {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('scormView'));
  const locale = useLocale();
  const { classes } = useViewStyles();
  const LatestCommit = useRef({});
  const [progress, setProgress] = useState(null);
  const scrollRef = useRef();
  // ----------------------------------------------------------------------
  // Data
  const { id, user } = useParams();

  const {
    instance,
    state,
    assignation,
    scormPackage,
    isFinished,
    isLoading: dataIsLoading,
  } = useData({ id, user });

  const nextActivityUrl = useNextActivityUrl(assignation);
  const { mutateAsync } = useStudentAssignationMutation();
  const updateTimestamps = useUpdateTimestamps(mutateAsync, assignation);

  useScormEvents({
    onInitialize: () => {
      updateTimestamps('open');
      updateTimestamps('start');
    },
    onSetValue: (commit) => onSetValue({ instance: id, user, commit, LatestCommit, setProgress }),
  });

  useEffect(() => {
    if (dayjs(state?.leemonsCommitDate).isAfter(dayjs(LatestCommit.current?.leemonsCommitDate))) {
      LatestCommit.current = state;
    }
  }, [state]);
  // ----------------------------------------------------------------------
  // Handlers

  const { onComplete } = useOnScormComplete({
    id,
    LatestCommit,
    nextActivityUrl,
    moduleId: instance?.metadata?.module?.id,
    updateTimestamps,
    user,
  });

  // ----------------------------------------------------------------------
  // COMPONENT

  if (dataIsLoading || tLoading) return <LoadingOverlay visible />;
  const labelTopElement = `${progress !== null ? `(${progress}%)` : ''}`;
  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <ActivityHeader
          instance={instance}
          showClass
          showRole
          showEvaluationType
          showTime
          showDeadline
        />
      }
    >
      <Stack justifyContent="center" ref={scrollRef} style={{ overflowY: 'auto' }}>
        <TotalLayoutStepContainer
          clean
          Footer={
            <TotalLayoutFooterContainer
              scrollRef={scrollRef}
              rightZone={
                <Button disabled={!!isFinished} onClick={onComplete}>
                  {getButtonLabel({ nextActivityUrl, moduleId: instance?.metadata?.module?.id, t })}
                </Button>
              }
              leftZone={
                <Box style={{ visibility: 'hidden' }}>
                  <Button style={{ visibility: 'none' }}>
                    {getButtonLabel({
                      nextActivityUrl,
                      moduleId: instance?.metadata?.module?.id,
                      t,
                    })}
                  </Button>
                </Box>
              }
              fixed
            >
              <Box className={classes.progressBottomBarContainer}>
                <Box className={classes.progressBottomBar}>
                  {progress !== null && (
                    <ProgressBottomBar value={progress} labelTop={labelTopElement} />
                  )}
                </Box>
              </Box>
            </TotalLayoutFooterContainer>
          }
        >
          {!!instance?.metadata?.statement && (
            <ActivityAccordion
              style={{
                backgroundColor: 'white',
                borderRadiusBottomLeft: 0,
                borderRadiusBottomRight: 0,
                borderBottom: '1px solid #DDE1E6',
              }}
            >
              <ActivityAccordionPanel
                itemValue="instructions"
                compact
                label={t('instructions')}
                icon={
                  <AlertInformationCircleIcon
                    color={theme.other.global.content.color.icon.default}
                  />
                }
              >
                <Box
                  sx={(th) => ({
                    padding: th.other.global.spacing.padding.sm,
                    paddingLeft: 32,
                  })}
                >
                  <HtmlText>{instance?.metadata?.statement}</HtmlText>
                </Box>
              </ActivityAccordionPanel>
            </ActivityAccordion>
          )}
          <ScormRender scormPackage={scormPackage} state={state} onSetValue={onSetValue} />
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
  );
}
