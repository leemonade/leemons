import React, { useMemo } from 'react';
import { Swiper, Box, Text, Loader } from '@bubbles-ui/components';
import { useApi, unflatten } from '@common';
import _ from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useSearchAssignableInstances from '../../../hooks/assignableInstance/useSearchAssignableInstances';
import useAssignationsByProfile from '../../../components/Ongoing/AssignmentList/hooks/useAssignationsByProfile';
import getClassData from '../../../helpers/getClassData';
import prefixPN from '../../../helpers/prefixPN';
import NYACard from '../../../components/NYACard';

async function getInstancesClassData({ instances, labels }) {
  return Object.fromEntries(
    await Promise.all(
      instances.map(async (instance) => [
        instance.id,
        await getClassData(instance.classes, {
          multiSubject: labels.multiSubject,
        }),
      ])
    )
  );
}

export default function NYA({ classe, program }) {
  const [, translations] = useTranslateLoader([
    prefixPN('roles'),
    prefixPN('need_your_attention'),
    prefixPN('multiSubject'),
  ]);
  // const locale = useLocale();

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

  const [instances] = useSearchAssignableInstances(query);
  const [instancesData] = useAssignationsByProfile(instances);

  const classDataQuery = useMemo(
    () => ({ instances: instancesData, labels }),
    [instancesData, labels]
  );

  const [classData] = useApi(getInstancesClassData, classDataQuery);

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
      {!instancesData?.length || _.isEmpty(classData) ? (
        <Loader />
      ) : (
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
          {instancesData.map((instance) => (
            <Box
              key={instance.id}
              style={{
                cursor: 'pointer',
                height: '100%',
              }}
              onClick={instance.onClick}
            >
              <NYACard
                instance={instance}
                labels={labels}
                showSubject={!query?.classes}
                classData={classData}
              />
            </Box>
          ))}
        </Swiper>
      )}
    </Box>
  );
}
