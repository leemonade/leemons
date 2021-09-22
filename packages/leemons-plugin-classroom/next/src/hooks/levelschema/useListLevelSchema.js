import listLevelSchemas from '../../services/levelSchemas/listLevelSchemas';
import useAsync from '../request/useAsync';

function useListLevelSchema(locale) {
  return useAsync(listLevelSchemas, locale);
}

export default useListLevelSchema;
