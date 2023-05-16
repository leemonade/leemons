/* eslint-disable react/display-name */
import unflatten from '@academic-portfolio/helpers/unflatten';
import prefixPN from '@assignables/helpers/prefixPN';
import { Select } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { get } from 'lodash';
import React from 'react';

export function useProgress(labels) {
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

const Progress = React.forwardRef(({ labels, value, onChange }, ref) => {
  const status = useProgress(labels);
  return <Select label={labels?.progress} data={status} value={value} onChange={onChange} />;
});

export default Progress;
