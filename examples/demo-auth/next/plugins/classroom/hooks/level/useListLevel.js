import listLevel from '../../services/levels/listLevels';
import useAsync from '../request/useAsync';

function useListLevel(locale) {
  return useAsync(listLevel, locale);
}

export default useListLevel;
