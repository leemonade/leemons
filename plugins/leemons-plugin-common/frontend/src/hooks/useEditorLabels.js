import prefixPN from '@common/helpers/prefixPN';
import unflatten from '@common/unflatten';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { get, isEmpty } from 'lodash';
import { useState, useEffect } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useEditorLabels = (toolLabels) => {
  const [, translations] = useTranslateLoader(prefixPN('textEditor'));
  const [editorLabels, setEditorLabels] = useState({});

  useEffect(() => {
    if (isEmpty(toolLabels) && translations && translations.items) {
      const res = unflatten(translations.items);
      const data = get(res, prefixPN('textEditor'));

      if (!isEmpty(data)) setEditorLabels(data);
    } else {
      setEditorLabels(toolLabels);
    }
  }, [toolLabels, translations]);

  return editorLabels;
};
