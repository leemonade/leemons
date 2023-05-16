import { useMemo } from 'react';
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '../../../helpers/prefixPN';

export default function useLevelsOfDifficulty(waitToTranslations) {
  const [, translations] = useTranslateLoader(prefixPN('levelsOfDifficulty'));

  const localizations = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('levelsOfDifficulty'));

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);

  const levels = [
    {
      value: 'beginner',
      label: localizations.beginner,
    },
    {
      value: 'elementary',
      label: localizations.elementary,
    },
    {
      value: 'lowerIntermediate',
      label: localizations.lowerIntermediate,
    },
    {
      value: 'intermediate',
      label: localizations.intermediate,
    },
    {
      value: 'upperIntermediate',
      label: localizations.upperIntermediate,
    },
    {
      value: 'advanced',
      label: localizations.advanced,
    },
  ];
  // const levels = [
  //   {
  //     value: 'beginner',
  //     label: 'Principiante',
  //   },
  //   {
  //     value: 'elementary',
  //     label: 'Elemental',
  //   },
  //   {
  //     value: 'lowerIntermediate',
  //     label: 'Intermedio bajo',
  //   },
  //   {
  //     value: 'intermediate',
  //     label: 'Intermedio',
  //   },
  //   {
  //     value: 'upperIntermediate',
  //     label: 'Intermedio alto',
  //   },
  //   {
  //     value: 'advanced',
  //     label: 'Avanzado',
  //   },
  // ];

  if (waitToTranslations && !translations) {
    return null;
  }
  return levels;
}
