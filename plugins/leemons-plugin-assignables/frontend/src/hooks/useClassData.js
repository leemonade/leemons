import { useMemo } from 'react';
import { useApi } from '@common';
import getClassData from '../helpers/getClassData';

function getClassDataWithLabel({ classes, labels }) {
  return getClassData(classes, { multiSubject: labels.multiSubject, groupName: labels.groupName });
}
export default function useClassData(classes, labels = {}) {
  const options = useMemo(
    () => ({
      classes,
      labels: { multiSubject: labels.multiSubject, groupName: labels.groupName },
    }),
    [classes, labels?.multiSubject]
  );
  const [data] = useApi(getClassDataWithLabel, options);

  return data || {};
}
