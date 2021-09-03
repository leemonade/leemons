import React from 'react';
import { Select } from 'leemons-ui';
import prefixPN from '@families/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

const RelationSelect = React.forwardRef((props, ref) => {
  const [t] = useTranslateLoader(prefixPN('detail_page'));
  return (
    <Select ref={ref} {...props} outlined={true}>
      <option value="..." disabled={true}>
        {t('relations.select_one')}
      </option>
      <option value={t('relations.father', undefined, true)}>{t('relations.father')}</option>
      <option value={t('relations.mother', undefined, true)}>{t('relations.mother')}</option>
      <option value={t('relations.legal_guardian', undefined, true)}>
        {t('relations.legal_guardian')}
      </option>
      <option value="other">{t('relations.other')}</option>
    </Select>
  );
});

export default RelationSelect;
