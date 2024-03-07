import React from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@learning-paths/helpers/prefixPN';
import { HtmlText, Box, ContextContainer } from '@bubbles-ui/components';
import { AssetEmbedList } from '@leebrary/components/AssetEmbedList';
import { INTRODUCTION_PROP_TYPES, INTRODUCTION_DEFAULT_PROPS } from './Introduction.constants';
import { introductionStyles } from './Introduction.styles';

const Introduction = ({ instance }) => {
  const { classes } = introductionStyles();
  const [t] = useTranslateLoader([prefixPN('moduleJourney')]);

  return (
    <Box className={classes.root}>
      {!!instance?.metadata?.statement && (
        <ContextContainer title={t('introduction')}>
          <HtmlText className={classes.introduction}>{instance?.metadata?.statement}</HtmlText>
        </ContextContainer>
      )}
      {!!instance?.assignable?.resources?.length && (
        <ContextContainer title={t('resources')}>
          <AssetEmbedList assets={instance?.assignable?.resources} />
        </ContextContainer>
      )}
    </Box>
  );
};

Introduction.propTypes = INTRODUCTION_PROP_TYPES;
Introduction.defaultProps = INTRODUCTION_DEFAULT_PROPS;
Introduction.displayName = 'Introduction';

export default Introduction;
export { Introduction };
