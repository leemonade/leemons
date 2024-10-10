import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { useIsTeacher } from '@academic-portfolio/hooks';
import { Box, ImageLoader } from '@bubbles-ui/components';
import { LocaleRelativeTime, unflatten, useApi, useLocale } from '@common';
import { useComunica } from '@comunica/context';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import dayjs from 'dayjs';
import _, { get } from 'lodash';
import PropTypes from 'prop-types';

import getClassData from '../../helpers/getClassData';
import prefixPN from '../../helpers/prefixPN';
import getStatus from '../Details/components/UsersList/helpers/getStatus';
import { EvaluationCard } from '../EvaluationCard';
import { EvaluationCardSkeleton } from '../EvaluationCard/EvaluationCardSkeleton/EvaluationCardSkeleton';

import { NYACARD_PROP_TYPES, NYACARD_DEFAULT_PROPS } from './NYACard.constants';
import { NYACardStyles } from './NYACard.styles';
import { NYACardCover } from './NYACardCover';
import { NYACardFooter } from './NYACardFooter';
import { NYACardSkeleton } from './NYACardSkeleton';
import { NYACardBody } from './NYCardBody';

function capitalizeFirstLetter(str) {
  return `${str[0].toUpperCase()}${str.substring(1)}`;
}

function parseAssignation({ isTeacher, instance, subject, labels }) {
  const commonInfo = {
    subject: {
      name: subject.name,
    },
  };

  if (isTeacher) {
    const { students } = instance;
    // EN: If the activity is not started yer, the assignation is not available
    // ES: Si la actividad no ha sido iniciada, la asignación no está disponible
    if (!students?.[0]?.started) {
      return null;
    }
    const submission = students.filter((student) => student.timestamps.end).length;

    // EN: Avg time only including the students who have finished the assignation
    // ES: Tiempo promedio solo incluyendo a los estudiantes que han finalizado la asignación
    const avgTime = (
      students
        .map((student) => {
          const { timestamps } = student;
          const { start, end } = timestamps;

          if (!start || !end) {
            return 0;
          }

          const startTime = new Date(start);
          const endTime = new Date(end);

          return (endTime - startTime) / 1000;
        })
        .reduce((acc, time) => acc + time, 0) / submission || 0
    ).toFixed(2);

    const total = students.length;

    return {
      ...commonInfo,
      // Only if finished
      completed: (submission / total).toFixed(2),
      submission,
      total,
      labels: labels?.assigment,
      avgTime,
    };
  }

  const { count: gradeCount, sum: gradeSum } = (instance.grades ?? {}).reduce(
    ({ count, sum }, grade) => {
      if (grade.type === 'main') {
        return {
          count: count + 1,
          sum: sum + grade.grade,
        };
      }
      return { count, sum };
    },
    { count: 0, sum: 0 }
  );

  const avgGrade = gradeCount > 0 ? gradeSum / gradeCount : 0;

  const role = instance?.instance?.assignable?.role;
  const roleName = get(labels?.roles, `${role}.singular`) || role;

  let submission;
  let total;

  if (instance?.metadata?.score && instance.instance.requiresScoring) {
    total = instance?.metadata?.score?.total || 0;
    submission = instance?.metadata?.score?.count || 0;
  }

  return {
    ...commonInfo,
    grade: avgGrade.toFixed(avgGrade % 1 === 0 ? 0 : 2),
    submission,
    total,
    activityType: capitalizeFirstLetter(roleName),
    labels: _.omit(
      labels?.assigment,
      [!instance?.metadata?.score && 'score', !instance.instance.requiresScoring && 'grade'].filter(
        Boolean
      )
    ),
  };
}

export function parseDeadline(isTeacher, obj, labels) {
  let instance = obj;

  if (!isTeacher) {
    instance = obj.instance;
  }

  let main = null;
  let severity = 'low';
  let backgroundColor = 'default';
  let secondary = null;
  let dateToShow = null;

  const today = dayjs();
  const deadline = dayjs(instance?.dates?.deadline || null);
  const startDate = dayjs(instance?.dates?.start || null);
  const isDeadline = deadline.isValid() && !deadline.isAfter(today);

  if (!isTeacher) {
    const submission = dayjs(obj?.timestamps?.end || instance?.timestamps?.end || null);
    const status = instance.status || getStatus(obj, instance);
    if (status === 'evaluated') {
      main = labels?.evaluated;
      if (deadline.isValid()) {
        secondary = labels?.submitted;
        dateToShow = submission.toDate();
      }
    } else if (status === 'late') {
      main = labels?.late;
      if (deadline.isValid()) {
        secondary = labels?.submission;
        dateToShow = deadline.toDate();
      }
    } else if (status === 'submitted' || status === 'ended') {
      main = labels?.submitted;
      if (submission.isValid()) {
        secondary = labels?.submitted;
        dateToShow = submission.toDate();
      }
    } else if (status === 'started' || status === 'opened') {
      const daysUntilDeadline = deadline.diff(today, 'days');
      const durationInSeconds = deadline.diff(today, 'seconds');

      if (deadline.isValid()) {
        secondary = labels?.submission;
        dateToShow = deadline.toDate();
      }

      if (isDeadline) {
        main = labels?.late;
        severity = 'high';
      } else if (daysUntilDeadline <= 5) {
        severity = 'medium';
        if (daysUntilDeadline <= 2) {
          severity = 'high';
        }
        main = <LocaleRelativeTime seconds={durationInSeconds} firstLetterUppercase={true} />;
      } else {
        main = labels?.startActivity;
      }
    } else {
      main = labels?.assigned;
      if (startDate.isValid()) {
        secondary = labels?.start;
        dateToShow = startDate.toDate();
      }
    }
  } else {
    const closeDate = dayjs(instance?.dates?.close || null);
    const closedDate = dayjs(instance?.dates?.closed || null);

    const isClosed =
      (closeDate.isValid() && !closeDate.isAfter(today)) ||
      (closedDate.isValid() && !closedDate.isAfter(today));
    const isStarted =
      !isClosed &&
      !isDeadline &&
      ((startDate.isValid() && !startDate.isAfter(today)) || !startDate.isValid());

    if (isClosed) {
      // TODO: Check if it is already graded
      main = labels?.evaluated;
      if (deadline.isValid()) {
        secondary = labels?.submission;
        dateToShow = deadline.toDate();
      }
    } else if (isDeadline) {
      main = labels?.evaluate;
      if (closeDate.isValid()) {
        const daysUntilClose = closeDate.diff(today, 'day');
        const durationInSeconds = closeDate.diff(today, 'seconds');

        dateToShow = closeDate.isValid() && closeDate.toDate();
        if (daysUntilClose <= 5) {
          severity = 'medium';
          if (daysUntilClose <= 2) {
            severity = 'high';
          }
          if (daysUntilClose < 0) {
            backgroundColor = 'error';
          }
          secondary = (
            <LocaleRelativeTime seconds={durationInSeconds} firstLetterUppercase={true} />
          );
        } else if (dateToShow) {
          secondary = labels?.evaluation;
        }
      } else {
        const daysSinceDeadline = today.diff(deadline, 'day');
        const durationInSeconds = today.diff(deadline, 'seconds');

        dateToShow = deadline.isValid() && deadline.toDate();

        if (daysSinceDeadline >= 2) {
          severity = 'medium';
          if (daysSinceDeadline >= 5) {
            severity = 'high';
          }
          if (daysSinceDeadline >= 7) {
            backgroundColor = 'error';
          }

          secondary = (
            <LocaleRelativeTime seconds={durationInSeconds} firstLetterUppercase={true} />
          );
        } else if (dateToShow) {
          secondary = labels?.submission;
        }
      }
    } else if (isStarted) {
      main = labels?.opened;
      if (startDate.isValid()) {
        secondary = labels?.submission;
        dateToShow = deadline.toDate();
      }
    } else {
      main = labels?.assigned;
      if (startDate.isValid()) {
        secondary = labels?.start;
        dateToShow = startDate.toDate();
      }
    }
  }

  return {
    deadline: dateToShow,
    locale: 'es',
    severity,
    backgroundColor,
    labels: {
      title: main,
      deadline: secondary,
    },
    disableHover: true,
  };
}

async function prepareInstance({ instance: object, isTeacher, query, labels }) {
  let instance = object;

  if (!isTeacher) {
    instance = object.instance;
  }
  let subjectData;

  if (query.classData && query.classData[instance.id]) {
    subjectData = query.classData[instance.id];
  } else {
    subjectData = await getClassData(instance.classes, {
      multiSubject: labels.multiSubject,
      groupName: instance?.metadata?.groupName,
    });
  }

  const assignment = parseAssignation({
    isTeacher,
    instance: object,
    subject: subjectData,
    labels,
  });
  const deadlineProps = parseDeadline(isTeacher, object, labels?.status);

  const showSubject = query.showSubject || subjectData.name === labels.multiSubject;

  const subject = {
    name: subjectData.name,
    color: subjectData.color,
    icon: subjectData.icon,
  };

  const roleDetails = instance?.assignable?.roleDetails;

  let url;
  if (isTeacher) {
    url = (roleDetails.dashboardUrl || '/private/assignables/details/:id').replace(
      ':id',
      instance.id
    );
  } else if (!object.finished) {
    url = roleDetails.studentDetailUrl.replace(':id', instance.id).replace(':user', object.user);
  } else {
    url = roleDetails.evaluationDetailUrl.replace(':id', instance.id).replace(':user', object.user);
  }

  return {
    ...instance,
    assignment,
    deadlineProps,
    subject,
    showSubject,
    isNew: object?.timestamps?.open === undefined && !isTeacher,
    asset: prepareAsset(instance.assignable.asset),
    url,
  };
}

export function usePreparedInstance(instance, query, labels) {
  const isTeacher = useIsTeacher();

  const options = React.useMemo(
    () => ({
      isTeacher,
      instance,
      query,
      labels,
    }),
    [isTeacher, instance, query, labels]
  );

  const [results] = useApi(prepareInstance, options);

  if (!results) {
    return null;
  }

  return { ...results, chatKeys: instance.chatKeys };
}

function useNYACardLocalizations(labels) {
  const [, translations] = useTranslateLoader([
    prefixPN('roles'),
    prefixPN('need_your_attention'),
    prefixPN('multiSubject'),
    prefixPN('assignmentForm'),
    prefixPN('ongoing'),
    prefixPN('assignment_list'),
  ]);

  return useMemo(() => {
    const useOwnLocalizations = labels !== undefined;

    if (useOwnLocalizations) {
      return labels;
    }

    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return {
        ..._.get(res, prefixPN('need_your_attention')),
        roles: _.get(res, prefixPN('roles')),
        multiSubject: _.get(res, prefixPN('multiSubject')),
        assignmentForm: _.get(res, prefixPN('assignmentForm')),
        ongoing: _.get(res, prefixPN('ongoing')),
        assignment_list: _.get(res, prefixPN('assignment_list')),
      };
    }

    return {};
  }, [translations, labels]);
}

function LinkContainer({ to, disabled, children }) {
  if (disabled) {
    return children;
  }

  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      {children}
    </Link>
  );
}

LinkContainer.propTypes = {
  to: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

const NYACard = ({
  instance,
  showSubject,
  labels,
  classData,
  clickable,
  isActivityCarousel,
  isTeacherSyllabus,
}) => {
  const activityRoom = `assignables.subject|${instance?.instance?.subjects?.[0]?.subject}.assignation|${instance?.id}.userAgent|${instance?.user}`;
  const isTeacher = useIsTeacher();
  const locale = useLocale();
  const localizations = useNYACardLocalizations(labels);
  const { openRoom } = useComunica();
  const { classes } = NYACardStyles({ clickable }, { name: 'NYACard' });
  const query = useMemo(
    () => ({
      classData,
      showSubject,
    }),
    [showSubject]
  );
  const preparedInstance = usePreparedInstance(instance, query, localizations);

  if (!preparedInstance) {
    if (isTeacher && isActivityCarousel) {
      return <EvaluationCardSkeleton />;
    }
    return (
      <Box className={classes.root}>
        <NYACardSkeleton />
      </Box>
    );
  }
  if (isTeacher && isActivityCarousel)
    return (
      <Link to={preparedInstance?.url} style={{ textDecoration: 'none' }}>
        <Box>
          <EvaluationCard
            instance={preparedInstance}
            localizations={localizations}
            variantTitle={
              get(localizations?.roles, `${preparedInstance?.assignable?.role}.singular`) ||
              preparedInstance?.assignable?.role
            }
            variantIcon={
              <Box
                style={{
                  position: 'relative',
                }}
              >
                <ImageLoader
                  style={{
                    width: 24,
                    height: 24,
                    position: 'relative',
                  }}
                  width={24}
                  height={24}
                  src={preparedInstance?.assignable?.roleDetails?.icon}
                />
              </Box>
            }
          />
        </Box>
      </Link>
    );
  return (
    <>
      <LinkContainer disabled={!clickable} to={preparedInstance?.url}>
        <Box
          key={preparedInstance?.id}
          style={{
            height: '100%',
          }}
        >
          <Box className={classes.root}>
            <NYACardCover
              {...preparedInstance?.asset}
              variantTitle={preparedInstance?.assignable?.role}
              topColor={preparedInstance?.subject?.color ?? preparedInstance?.asset?.color}
              isTeacherSyllabus={isTeacherSyllabus}
              localizations={localizations}
              instance={preparedInstance}
            />
            <NYACardBody
              {...preparedInstance?.asset}
              isNew={preparedInstance?.isNew}
              localizations={localizations}
              instance={preparedInstance}
              classroom={preparedInstance?.classes}
              locale={locale}
              totalActivities={instance.metadata?.completion?.total ?? 1}
              submitedActivities={instance.metadata?.completion?.completed ?? 0}
              showSubject={showSubject}
              isTeacherSyllabus={isTeacherSyllabus}
            />
            <NYACardFooter
              onOpenChat={() => openRoom(activityRoom)}
              {...preparedInstance?.asset}
              chatKeys={preparedInstance?.chatKeys}
              variantTitle={
                get(localizations?.roles, `${preparedInstance?.assignable?.role}.singular`) ||
                preparedInstance?.assignable?.role
              }
              variantIcon={
                <Box
                  style={{
                    position: 'relative',
                  }}
                >
                  <ImageLoader
                    style={{
                      width: 16,
                      height: 16,
                      position: 'relative',
                    }}
                    width={16}
                    height={16}
                    src={preparedInstance?.assignable?.roleDetails?.icon}
                  />
                </Box>
              }
              locale={locale}
            />
          </Box>
        </Box>
      </LinkContainer>
    </>
  );
};

NYACard.propTypes = NYACARD_PROP_TYPES;
NYACard.defaultProps = NYACARD_DEFAULT_PROPS;

export { NYACard };
export default NYACard;
