import React from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles } from '@bubbles-ui/components';
import { TextEditorInput, HEADINGS_TOOL_DEFAULT_PROPS } from '@bubbles-ui/editors';
import { Container } from '../Container';

export const useInstructionsStyles = createStyles(() => ({
  root: {
    maxWidth: 800,
  },
}));

export function Instructions({ localizations, value, onChange, hideSectionHeaders, hideDivider }) {
  const { classes } = useInstructionsStyles();
  return (
    <Container
      title={localizations?.title}
      description={localizations?.description}
      hideSectionHeaders={hideSectionHeaders}
      hideDivider={hideDivider}
    >
      <Box className={classes.root}>
        <TextEditorInput
          placeholder={localizations?.editor?.placeholder}
          value={value}
          onChange={onChange}
          toolLabels={{ headingsTool: { ...HEADINGS_TOOL_DEFAULT_PROPS?.labels, label: '' } }}
        />
      </Box>
    </Container>
  );
}

Instructions.propTypes = {
  localizations: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  hideSectionHeaders: PropTypes.bool,
};
