import React, { useMemo } from 'react';
import { Swiper, Box, Text, Loader } from '@bubbles-ui/components';
import { LibraryCard } from '@bubbles-ui/leemons';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import useAssignablesContext from '@assignables/hooks/useAssignablesContext';
import { useApi, unflatten, useLocale } from '@common';
import _ from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useSearchAssignableInstances from '../../../hooks/assignableInstance/useSearchAssignableInstances';
import useAssignationsByProfile from '../../../components/Ongoing/AssignmentList/hooks/useAssignationsByProfile';
import getClassData from '../../../helpers/getClassData';
import prefixPN from '../../../helpers/prefixPN';

function parseAssignation(isTeacher, instance) {
  if (isTeacher) {
    const { students } = instance;

    const submission = students.filter((student) => student.timestamps.end).length;

    // EN: Avg time only including the students who have finished the assignation
    // ES: Tiempo promedio solo incluyendo a los estudiantes que han finalizado la asignación
    const avgTime =
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
        .reduce((acc, time) => acc + time, 0) / submission || 0;

    const total = students.length;
    return {
      // Only if finished
      completed: submission / total,
      submission,
      total,
      subject: {
        name: 'Maths - 1025 - GB',
      },
      avgTime,
    };
  }

  return null;
}

function parseDeadline(isTeacher, obj) {
  let instance = obj;

  if (!isTeacher) {
    instance = obj.instance;
  }
  return {
    deadline: new Date(instance.dates.deadline),
    locale: 'es',
    labels: {
      title: 'TODO:',
      new: 'New',
      deadline: 'TODO:',
    },
  };
}

function prepareInstances({ instances, isTeacher, query }) {
  return Promise.all(
    instances.map(async (object) => {
      let instance = object;

      if (!isTeacher) {
        instance = object.instance;
      }
      const assignment = parseAssignation(isTeacher, object);
      const deadlineProps = parseDeadline(isTeacher, object);
      // const subject = {
      //   // Only if main dashboard or multi-language
      //   name: 'Bases para el análisis y el tratamiento de',
      //   color: '#FABADA',
      //   icon: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Globe_icon_2.svg',
      // };

      const multiSubjectLabel = 'multi-Asignatura';
      const subjectData = await getClassData(instance.classes, {
        multiSubject: multiSubjectLabel,
      });

      const showSubject = query.classes === undefined || subjectData.name === multiSubjectLabel;

      const subject = {
        name: subjectData.name,
        color: subjectData.color,
        icon: subjectData.icon,
      };

      let onClick = () => window.open(`/private/assignables/details/${instance.id}`, '_blank');

      const roleDetails = instance?.assignable?.roleDetails;

      if (!isTeacher) {
        if (!object.finished) {
          const activityUrl = roleDetails.studentDetailUrl
            .replace(':id', instance.id)
            .replace(':user', object.user);
          onClick = () => window.open(activityUrl, '_blank');
        } else {
          const revisionUrl = roleDetails.evaluationDetailUrl
            .replace(':id', instance.id)
            .replace(':user', object.user);
          onClick = () => window.open(revisionUrl, '_blank');
        }
      }

      return {
        ...instance,
        assignment,
        deadlineProps,
        subject: showSubject ? subject : null,
        isNew: object?.timestamps?.open === undefined && !isTeacher,
        asset: prepareAsset(instance.assignable.asset),
        onClick,
      };
    })
  );
}

function usePreparedInstances(instances, query) {
  const { isTeacher } = useAssignablesContext();

  const options = React.useMemo(
    () => ({
      isTeacher,
      instances,
      query,
    }),
    [isTeacher, instances, query]
  );

  const [results] = useApi(prepareInstances, options);

  if (!results) {
    return [];
  }

  return results;
}

export default function NYA({ classe, program }) {
  const [, translations] = useTranslateLoader([prefixPN('roles'), prefixPN('need_your_attention')]);
  const locale = useLocale();

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return {
        ..._.get(res, prefixPN('need_your_attention')),
        roles: _.get(res, prefixPN('roles')),
      };
    }

    return {};
  }, [translations]);

  // TODO: Only show program specific content
  const query = useMemo(() => {
    const q = {
      limit: 9,
      closed: false,
    };

    if (classe) {
      q.classes = JSON.stringify([classe?.id]);
    }

    return q;
  }, []);

  const [instances] = useSearchAssignableInstances(query);
  const [instancesData, instancesDataLoading] = useAssignationsByProfile(instances);

  const preparedAssets = usePreparedInstances(instancesData, query);

  return (
    <Box
      sx={(theme) => ({
        maxWidth: '1000px',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[6],
      })}
    >
      <Text size="lg" color="primary">
        {labels.title}
      </Text>
      {!preparedAssets?.length ? (
        <Loader />
      ) : (
        <Swiper
          // onSelectIndex={handleSelectIndex}
          selectable
          deselectable={false}
          disableSelectedStyles
          breakAt={{
            800: {
              slidesPerView: 1,
              spaceBetween: 16,
            },
            1000: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            1500: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
          }}
        >
          {preparedAssets.map((instance) => (
            <Box
              key={instance.id}
              style={{
                cursor: 'pointer',
              }}
              onClick={instance.onClick}
            >
              <LibraryCard
                asset={instance.asset}
                variant="assigment"
                dashboard
                shadow
                locale={locale}
                assigment={instance.assignment}
                deadlineProps={instance.deadlineProps}
                subject={instance.subject}
                isNew={instance.isNew}
                variantTitle={labels?.roles?.[instance.assignable.role] || instance.assignable.role}
              />
            </Box>
          ))}
        </Swiper>
      )}
    </Box>
  );
}
