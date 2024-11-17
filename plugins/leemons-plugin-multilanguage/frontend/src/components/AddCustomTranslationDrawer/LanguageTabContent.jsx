import React from 'react';
import { Controller } from 'react-hook-form';

import {
  Text,
  TextInput,
  ContextContainer,
  createStyles,
  Box,
  Stack,
} from '@bubbles-ui/components';
import PropTypes from 'prop-types';

const useLanguageTabContentStyles = createStyles(() => ({
  root: {},
  columnBox: {
    width: '50%',
  },
  headerRow: {
    minHeight: 20,
    alignItems: 'center',
    padding: '8px 0px',
  },
}));

const Row = ({ copyLabel, copyKey, classes, t, form, language }) => (
  <Stack alignItems="center" spacing={2}>
    <Box className={classes.columnBox}>
      <Text>{copyLabel}</Text>
    </Box>
    <Box className={classes.columnBox}>
      <Controller
        control={form.control}
        name={`${language.key}.${copyKey}`}
        render={({ field }) => (
          <TextInput placeholder={t('translationPlaceholder')} fullWidth {...field} />
        )}
      />
    </Box>
  </Stack>
);

const LanguageTabContent = ({ copies = {}, t, form, language }) => {
  const { classes } = useLanguageTabContentStyles();

  return (
    <ContextContainer className={classes.root} spacing={3}>
      <Stack className={classes.headerRow}>
        <Box className={classes.columnBox}>
          <Text stronger role="productive">
            {t('text')}
          </Text>
        </Box>
        <Box className={classes.columnBox}>
          <Text stronger role="productive">
            {t('translation')}
          </Text>
        </Box>
      </Stack>

      <ContextContainer spacing={2}>
        {Object.entries(copies).map(([key, value]) => {
          if (!key || !value) return null;

          return (
            <Row
              key={key}
              copyKey={key}
              copyLabel={value}
              classes={classes}
              t={t}
              form={form}
              language={language}
            />
          );
        })}
      </ContextContainer>
    </ContextContainer>
  );
};

LanguageTabContent.propTypes = {
  copies: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      key: PropTypes.string,
    })
  ),
  t: PropTypes.func,
  form: PropTypes.object,
  language: PropTypes.object,
};

Row.propTypes = {
  copyLabel: PropTypes.string,
  copyKey: PropTypes.string,
  classes: PropTypes.object,
  t: PropTypes.func,
  form: PropTypes.object,
  language: PropTypes.object,
};

export default LanguageTabContent;
