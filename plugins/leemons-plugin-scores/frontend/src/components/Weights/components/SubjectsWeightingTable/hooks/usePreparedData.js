import React from 'react';

import { map, noop, sortBy } from 'lodash';
import { EditWriteIcon } from '@bubbles-ui/icons/solid';

import { SubjectItemDisplay } from '@academic-portfolio/components';
import useWeights from '@scores/requests/hooks/queries/useWeights';
import useFilteredSessionClasses from './useFilteredSessionClasses';

export default function usePreparedData({ program, subject, course, onEdit = noop }) {
  const { data: sessionClasses, isLoading: isLoadingSessionClasses } = useFilteredSessionClasses({
    program,
    subject,
    course,
  });

  const { data: weights, isLoading: isLoadingWeights } = useWeights({
    classIds: map(sessionClasses, 'id'),
    enabled: !!sessionClasses?.length,
  });

  if (isLoadingSessionClasses || isLoadingWeights) {
    return { isLoading: true, data: [] };
  }

  const data = map(sessionClasses, (klass) => {
    const isGroupAlone = klass.groups.isAlone;
    const courses = sortBy(Array.isArray(klass.courses) ? klass.courses : [klass.courses], 'index');

    const weighting = weights?.find((w) => w.class === klass.id);

    return {
      ...klass,
      subject: <SubjectItemDisplay subjectsIds={[klass.subject.subject]} />,
      group: isGroupAlone ? '-' : klass.groups.name,
      course: map(courses, 'name').join(', '),
      rules: weighting?.type,
      applySameValue: weighting?.applySameValue,
      actions: (
        <EditWriteIcon
          width={18}
          height={18}
          style={{ cursor: 'pointer' }}
          onClick={() => onEdit(klass)}
        />
      ),
      original: klass,
    };
  });

  return { isLoading: false, data };
}
