import { useQueries } from '@tanstack/react-query';
import getClassData from '../helpers/getClassData';

function getClassDataWithLabel({ classes, labels, multiSubject }) {
  return getClassData(classes, labels, { multiSubject });
}

export default function useClassData(instances, labels = {}, { multiSubject } = {}) {
  const _instances = (Array.isArray(instances) ? instances : [instances])?.filter(Boolean);
  const queries = useQueries({
    queries: _instances.map((_instance) => {
      const instance = _instance?.instance ? _instance.instance : _instance;
      const { classes, metadata } = instance;

      return {
        queryKey: [
          'plugins.assignables.classData',
          {
            classes,
            multiSubjectLabel: labels?.multiSubject,
            groupNameLabel: metadata?.groupName,
            multiSubject,
          },
        ],
        queryFn: () =>
          getClassDataWithLabel({
            classes,
            labels: {
              multiSubject: labels?.multiSubject,
              groupName: metadata?.groupName,
            },
            multiSubject,
          }),
      };
    }),
  });

  if (Array.isArray(instances)) {
    return queries;
  }
  return queries?.[0] || {};
}
