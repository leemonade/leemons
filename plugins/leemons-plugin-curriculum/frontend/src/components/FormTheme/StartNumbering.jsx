import React from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles, NumberInput } from '@bubbles-ui/components';
import { numberToEncodedLetter, useStore } from '@common';
import { getExampleTextForListOrderedConfig } from '@curriculum/bubbles-components/BranchBlockListCustomOrderFieldOrder';

const useStyle = createStyles((theme) => ({
  root: {
    marginBottom: theme.spacing[4],
  },
  numbers: {
    paddingTop: theme.spacing[7],
    paddingLeft: theme.spacing[4],
  },
}));

const StartNumbering = ({ t, type, custom, ...props }) => {
  const { classes } = useStyle();
  const [store, render] = useStore();

  function onChange(initNumber) {
    props.onChange({
      ...(props.value || { value: [], metadata: {} }),
      metadata: {
        ...(props.value?.metadata || {}),
        initNumber,
      },
    });
  }

  function getDemo() {
    if (props.value?.metadata?.initNumber) {
      if (custom) {
        return getExampleTextForListOrderedConfig(custom, props.value.metadata.initNumber);
      }
      if (type === 'numbers') {
        return `${props.value.metadata.initNumber},${props.value.metadata.initNumber + 1},${
          props.value.metadata.initNumber + 2
        }...`;
      }
      if (type === 'vocals') {
        return `${numberToEncodedLetter(props.value.metadata.initNumber)},${numberToEncodedLetter(
          props.value.metadata.initNumber + 1
        )},${numberToEncodedLetter(props.value.metadata.initNumber + 2)}...`;
      }
    }
  }

  return (
    <Box className={classes.root}>
      <Box style={{ display: 'flex' }}>
        <Box style={{ width: 150 }}>
          <NumberInput
            min={1}
            label={t('startAt')}
            value={props.value?.metadata?.initNumber}
            onChange={onChange}
          />
        </Box>
        <Box className={classes.numbers}>{getDemo()}</Box>
      </Box>
    </Box>
  );
};

StartNumbering.propTypes = {
  t: PropTypes.func,
  type: PropTypes.string,
};

export { StartNumbering };
