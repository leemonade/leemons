import { useQueries } from '@tanstack/react-query';
import getClassData from '../helpers/getClassData';

function getClassDataWithLabel({ classes, labels }) {
  return getClassData(classes, labels);
}

export default function useClassData(instances, labels = {}) {
  const _instances = (Array.isArray(instances) ? instances : [instances])?.filter(Boolean);

  const queries = useQueries({
    queries: _instances.map(({ classes, metadata }) => ({
      queryKey: [
        'plugins.assignables.classData',
        { classes, multiSubjectLabel: labels?.multiSubject, groupNameLabel: metadata?.groupName },
      ],
      queryFn: () =>
        getClassDataWithLabel({
          classes,
          labels: {
            multiSubject: labels?.multiSubject,
            groupName: metadata?.groupName,
          },
        }),
    })),
  });

  if (Array.isArray(instances)) {
    return queries;
  }
  return queries?.[0] || {};
}
