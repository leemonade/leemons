import { useQueries } from 'react-query';
import getClassData from '../helpers/getClassData';

function getClassDataWithLabel({ classes, labels }) {
  return getClassData(classes, { multiSubject: labels.multiSubject });
}

export default function useClassData(instances, labels = {}) {
  const _instances = Array.isArray(instances) ? instances : [instances];

  return useQueries(
    _instances.map(({ classes }) => ({
      queryKey: [
        'plugins.assignables.classData',
        { classes, multiSubjectLabel: labels?.multiSubject },
      ],
      queryFn: () => getClassDataWithLabel({ classes, labels }),
    }))
  );
}
