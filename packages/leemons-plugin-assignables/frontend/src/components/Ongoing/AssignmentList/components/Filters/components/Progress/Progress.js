import React from 'react';
import { Select } from '@bubbles-ui/components';
import { useIsTeacher, useIsStudent } from '@academic-portfolio/hooks';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import unflatten from '@academic-portfolio/helpers/unflatten';
import { get } from 'lodash';

function useProgress(labels) {
  const [, translations] = useTranslateLoader(prefixPN('activity_status'));

  const localizations = React.useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = get(res, prefixPN('activity_status'));

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);

  return React.useMemo(
    () => [
      {
        value: 'all',
        label: labels?.seeAll,
      },
      {
        value: 'notStarted',
        label: localizations?.notStarted,
      },
      {
        value: 'started',
        label: localizations?.started,
      },
      {
        value: 'finished',
        label: `${localizations?.submitted}/${localizations?.ended}`,
      },
      {
        value: 'evaluated',
        label: localizations?.evaluated,
      },
      {
        value: 'notSubmitted',
        label: `${localizations?.notSubmitted} (${localizations?.late})`,
      },
    ],
    [localizations, labels?.seeAll]
  );
}

export default function Progress({ labels, value, onChange }) {
  const status = useProgress(labels);
  return <Select label={labels?.progress} data={status} value={value} onChange={onChange} />;
}
