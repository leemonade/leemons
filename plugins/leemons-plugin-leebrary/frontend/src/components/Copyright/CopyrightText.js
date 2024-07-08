import React, { useMemo } from 'react';
import { capitalize } from 'lodash';
import PropTypes from 'prop-types';

import { Text } from '@bubbles-ui/components';

import useTranslateLoader from '@multilanguage/useTranslateLoader';

import prefixPN from '@leebrary/helpers/prefixPN';
import useCopyrightTextStyles from './CopyrightText.styles';

export default function CopyrightText({
  author,
  authorUrl,
  source,
  sourceUrl,
  resourceType,
  reverseColors,
}) {
  const [t] = useTranslateLoader(prefixPN('copyright'));
  const { classes } = useCopyrightTextStyles({ reverseColors });

  const handleOnClick = (e) => {
    e.stopPropagation();
  };

  const resourceText = useMemo(() => {
    const type = t(`types.${resourceType}`);
    const by = t('by');
    if (type) {
      return `${type} ${by} `;
    }
    return `${capitalize(by)} `;
  }, [resourceType, t]);

  return (
    <Text className={classes.text}>
      {resourceText}
      <a
        className={classes.link}
        href={authorUrl}
        target="_blank"
        rel="noreferrer"
        onClick={handleOnClick}
      >
        {author}
      </a>
      {` ${t('on')} `}
      <a
        className={classes.link}
        href={sourceUrl}
        target="_blank"
        rel="noreferrer"
        onClick={handleOnClick}
      >
        {capitalize(source)}
      </a>
    </Text>
  );
}

CopyrightText.propTypes = {
  author: PropTypes.string.isRequired,
  authorUrl: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  sourceUrl: PropTypes.string.isRequired,
  bottomOffset: PropTypes.number,
  align: PropTypes.oneOf(['left', 'right', 'center']),
  reverseColors: PropTypes.bool,
  resourceType: PropTypes.string,
};
