import { ChipsContainer as ChipsContainerBase } from '@bubbles-ui/components';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';

const ChipsContainer = (props) => {
  const { t } = useCommonTranslate('chips');
  return <ChipsContainerBase {...props} labels={{ and: t('and'), more: t('more') }} />;
};

export { ChipsContainer };
