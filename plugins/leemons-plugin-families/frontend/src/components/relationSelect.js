import React from 'react';
import { Select } from '@bubbles-ui/components';
import prefixPN from '@families/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

// eslint-disable-next-line react/display-name
const RelationSelect = React.forwardRef((props, ref) => {
  const [t] = useTranslateLoader(prefixPN('detail_page'));
  return (
    <Select
      data={[
        { value: '...', label: t('relations.select_one'), disabled: true },
        { value: t('relations.father', undefined, true), label: t('relations.father') },
        { value: t('relations.mother', undefined, true), label: t('relations.mother') },
        {
          value: t('relations.legal_guardian', undefined, true),
          label: t('relations.legal_guardian'),
        },
        { value: 'other', label: t('relations.other') },
      ]}
      ref={ref}
      {...props}
      outlined={true}
    />
  );
});

export default RelationSelect;
