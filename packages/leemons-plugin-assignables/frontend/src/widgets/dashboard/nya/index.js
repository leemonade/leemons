import React, { useMemo } from 'react';
import { Swiper, Box, Text, Loader, ImageLoader } from '@bubbles-ui/components';
import { unflatten } from '@common';
import _ from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useSearchAssignableInstances from '../../../hooks/assignableInstance/useSearchAssignableInstancesQuery';
import useAssignationsByProfile from '../../../hooks/assignations/useAssignationsByProfile';
import prefixPN from '../../../helpers/prefixPN';
import NYACard from '../../../components/NYACard';
import EmptyState from '../../../assets/EmptyState.png';
import useClassData from '../../../hooks/useClassDataQuery';

function useInstancesClassData({ instances: object, labels }) {
  const isTeacher = object.some((instance) => instance?.assignable);
  const instances = useMemo(
    () => (isTeacher ? object : object.map((instance) => instance?.instance)),
    [object, isTeacher]
  );

  const result = useClassData(instances, labels);

  const isSuccess = !result.some(({ isSuccess: s }) => !s);

  const data = useMemo(() => {
    if (!isSuccess) {
      return null;
    }

    return instances.reduce(
      (acc, instance, i) => ({
        ...acc,
        [instance.id]: result[i].data,
      }),
      {}
    );
  }, [result, isSuccess]);

  return {
    isLoading: result.some(({ isLoading }) => isLoading),
    isError: result.some(({ isError }) => isError),
    isSuccess,
    data,
  };
}

function nyaStatus({ loading, data, labels, query, classData }) {
  if (loading) {
    return <Loader />;
  }

  if (data?.length) {
    return (
      <Swiper
        // onSelectIndex={handleSelectIndex}
        selectable
        deselectable={false}
        disableSelectedStyles
        breakAt={{
          800: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
          1800: {
            slidesPerView: 4,
            spaceBetween: 16,
          },
          2000: {
            slidesPerView: 5,
            spaceBetween: 16,
          },
        }}
        slideStyles={{
          height: 'auto',
        }}
      >
        {data.map((instance) => (
          <NYACard
            key={instance.id}
            instance={instance}
            labels={labels}
            showSubject={!query?.classes}
            classData={classData}
          />
        ))}
      </Swiper>
    );
  }

  return (
    <Box
      sx={(theme) => ({
        width: '100%',
        height: 328,
        borderRadius: theme.spacing[1],
        backgroundColor: theme.colors.uiBackground02,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing[1],
      })}
    >
      <ImageLoader src={EmptyState} width={142} height={149} />
      {/* TRANSLATE: Translate empty state */}
      <Text color="primary">No hay actividades programadas</Text>
    </Box>
  );
}

export default function NYA({ classe, program }) {
  const [, translations] = useTranslateLoader([
    prefixPN('roles'),
    prefixPN('need_your_attention'),
    prefixPN('multiSubject'),
  ]);

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return {
        ..._.get(res, prefixPN('need_your_attention')),
        roles: _.get(res, prefixPN('roles')),
        multiSubject: _.get(res, prefixPN('multiSubject')),
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

  const { data: nyaInstances, isLoading: nyaInstancesIsLoading } =
    useSearchAssignableInstances(query);

  const instancesDataQueries = useAssignationsByProfile(nyaInstances);
  const instancesDataQueriesIsSuccess = useMemo(
    () => instancesDataQueries?.some(({ isSuccess }) => isSuccess),
    [instancesDataQueries]
  );
  const instancesDataQueriesIsLoading = useMemo(
    () => instancesDataQueries?.some(({ isLoading }) => isLoading),
    [instancesDataQueries]
  );
  const instancesData = useMemo(
    () =>
      // if (!instancesDataQueriesIsSuccess) {
      //   return [];
      // }

      instancesDataQueries?.map((q) => q.data)?.filter((d) => d) || [],
    [instancesDataQueriesIsSuccess, instancesDataQueries]
  );

  const { data: classData, isLoading: classDataIsLoading } = useInstancesClassData({
    instances: instancesData,
    labels,
  });

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[6],
      })}
    >
      <Text size="lg" color="primary">
        {labels.title}
      </Text>
      {nyaStatus({
        loading: nyaInstancesIsLoading || instancesDataQueriesIsLoading || classDataIsLoading,
        data: instancesData,
        labels,
        query,
        classData,
      })}
    </Box>
  );
}
