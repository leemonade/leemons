import { useApi } from '@common';
import getClassData from '../helpers/getClassData';

export default function useClassData(classes) {
  const [data] = useApi(getClassData, classes);

  return data || {};
}
