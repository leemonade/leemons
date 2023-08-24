import { useState, useEffect } from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';
import { prefixPN } from './prefixPN';

export default function useTableInputLabels() {
  const [tableInputLabels, setTableInputLabels] = useState({});
  const [, translations] = useTranslateLoader(prefixPN('tableInput'));

  useEffect(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = res.plugins.tasks.tableInput;

      setTableInputLabels(data);

      // EN: Save your translations keys to use them in your component
      // ES: Guarda tus traducciones para usarlas en tu componente
    }
  }, [translations]);

  return tableInputLabels;
}
