import React, { useMemo } from 'react';
import { get } from 'lodash';
import { prefixPN } from '@scores/helpers';
import { unflatten } from '@common';
import { PageHeader } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { PluginScoresBasicIcon } from '@bubbles-ui/icons/outline';

function useHeaderLocalizations() {
  const key = prefixPN(`studentScoresPage.header.student`);
  const [, translations] = useTranslateLoader(key);

  const localizations = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);

      return get(res, key);
    }

    return {};
  }, [translations]);

  return localizations;
}

export function Header() {
  const localizations = useHeaderLocalizations();
  const { title, description } = localizations;

  return (
    <PageHeader
      values={{
        title,
        description,
      }}
      icon={<PluginScoresBasicIcon />}
      withDivider
    />
  );
}

export default Header;
