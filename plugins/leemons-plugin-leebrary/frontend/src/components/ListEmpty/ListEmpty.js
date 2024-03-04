import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Text, ImageLoader, Box } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@leebrary/helpers';
import { useImage } from './hooks/useImage';
import { useListEmptyStyles } from './ListEmpty.styles';
import { RenderTextWithCTAs } from './components/RenderTextWithCTAs';
import { getCategory } from './helpers/getCategory';

function ListEmpty({ t, category }) {
  const [navT] = useTranslateLoader(prefixPN('home.navbar'));
  const { key: categoryKey, singularName, pluralName } = getCategory({ category, t: navT });
  const EmptyStateImage = useImage(categoryKey);

  const { classes, cx } = useListEmptyStyles();

  if (!EmptyStateImage) {
    return null;
  }

  return (
    <Box className={classes.root}>
      <Stack direction="column" spacing={8}>
        <Box sx={{ position: 'relative' }}>
          <ImageLoader src={EmptyStateImage} style={{ position: 'relative' }} />
        </Box>
        <Stack direction="column" spacing={4} sx={{ maxWidth: 502 }}>
          <Text color="primary" className={cx(classes.text, classes.title)}>
            {t(`emptyStates.title`, { category: pluralName })}
          </Text>
          <RenderTextWithCTAs
            text={`emptyStates.${categoryKey}.description`}
            cta={`emptyStates.${categoryKey}.descriptionCTA`}
            URL={category.createUrl ?? '/private/leebrary/media-files/new'}
            replacers={{ singularCategory: singularName, pluralCategory: pluralName }}
            t={t}
          />
          <RenderTextWithCTAs
            text={`emptyStates.${categoryKey}.help`}
            cta={`emptyStates.${categoryKey}.helpCTA`}
            URL={'https://leemons.io/academy'}
            replacers={{ singularCategory: singularName, pluralCategory: pluralName }}
            t={t}
          />
        </Stack>
      </Stack>
    </Box>
  );
}

ListEmpty.propTypes = {
  t: PropTypes.func.isRequired,
  isRecentPage: PropTypes.bool,
  category: PropTypes.string,
};

export { ListEmpty };
export default ListEmpty;
