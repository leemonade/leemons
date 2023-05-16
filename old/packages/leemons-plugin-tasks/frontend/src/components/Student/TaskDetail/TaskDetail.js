import React from 'react';
import useClassData from '@assignables/hooks/useClassDataQuery';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@tasks/helpers';
import { unflatten, useLocale } from '@common';
import _ from 'lodash';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import { Loader } from '@bubbles-ui/components';
import { ActivityContainer } from '@bubbles-ui/leemons';
import useAssignations from '@assignables/requests/hooks/queries/useAssignations';
import Steps from './components/Steps';

function useTaskDetailLocalizations() {
  const [, translations] = useTranslateLoader([
    prefixPN('task_realization'),
    'plugins.assignables.multiSubject',
  ]);

  return React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('task_realization'));
      data.multiSubject = _.get(res, 'plugins.assignables.multiSubject');

      return data;
    }

    return {};
  }, [translations]);
}

export default function TaskDetail({ id, student }) {
  const localizations = useTaskDetailLocalizations();
  const locale = useLocale();

  const [isFirstStep, setIsFirstStep] = React.useState(true);

  const { data: assignation, isLoading: assignationIsLoading } = useAssignations({
    query: {
      instance: id,
      user: student,
    },
    fetchInstance: true,
    details: true,
  });
  const instance = assignation?.instance;
  const assignable = instance?.assignable;
  const asset = assignable?.asset;

  const coverUrl = React.useMemo(() => getFileUrl(asset?.cover), [asset?.cover]);

  const { data: classData } = useClassData(instance, localizations);

  if (assignationIsLoading) {
    return <Loader />;
  }

  return (
    <ActivityContainer
      header={{
        title: asset?.name,
        subtitle: classData?.name,
        icon: classData?.icon,
        color: classData?.color,
        image: coverUrl,
      }}
      deadline={
        instance?.dates?.deadline && {
          label: localizations?.activityContainer?.deadline?.label,
          deadline:
            instance?.dates?.deadline instanceof Date
              ? instance?.dates?.deadline
              : new Date(instance?.dates?.deadline),
          locale,
        }
      }
      collapsed={!isFirstStep}
    >
      <Steps
        assignation={assignation}
        localizations={localizations}
        setIsFirstStep={setIsFirstStep}
      />
    </ActivityContainer>
  );
}
