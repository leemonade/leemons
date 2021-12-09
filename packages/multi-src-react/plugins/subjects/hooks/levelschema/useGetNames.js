import getNames from '../../services/levelSchemas/getNames';
import useAsync from '../request/useAsync';

function useGetNames(id) {
  return useAsync(getNames, id);
}

export default useGetNames;
