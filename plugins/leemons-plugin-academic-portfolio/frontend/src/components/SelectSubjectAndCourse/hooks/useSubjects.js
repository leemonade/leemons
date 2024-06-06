import { useMemo } from 'react';

import { useSessionClasses } from '@academic-portfolio/hooks';
import { map, uniqBy } from 'lodash';

export default function useSubjects({ program }) {
  const { data: classes } = useSessionClasses({ program, withProgram: true });

  const subjects = useMemo(
    () =>
      uniqBy(
        map(classes, (klass) => klass.subject),
        'id'
      ),
    [classes]
  );

  return { subjects };
}
