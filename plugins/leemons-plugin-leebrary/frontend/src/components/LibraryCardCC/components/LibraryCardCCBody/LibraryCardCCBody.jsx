import React from 'react';
import { Box, Text, TextClamp } from '@bubbles-ui/components';
import { LibraryCardCCBodyStyles } from './LibraryCardCCBody.styles';
import {
  LIBRARY_CARD_CC_BODY_PROPTYPES,
  LIBRARY_CARD_CC_BODY_DEFAULTPROPS,
} from './LibraryCardCCBody.constants';

const LibraryCardCCBody = ({ description, name }) => {
  const { classes } = LibraryCardCCBodyStyles();
  return (
    <Box className={classes.root}>
      <Box className={classes.titleContainer}>
        {name && (
          <TextClamp lines={2}>
            <Text className={classes.title}>{name}</Text>
          </TextClamp>
        )}
      </Box>
      <Box>
        {description && (
          <TextClamp lines={2}>
            <Text size="xs" className={classes.description}>
              {description}
            </Text>
          </TextClamp>
        )}
      </Box>
    </Box>
  );
};

LibraryCardCCBody.propTypes = LIBRARY_CARD_CC_BODY_PROPTYPES;
LibraryCardCCBody.defaultProps = LIBRARY_CARD_CC_BODY_DEFAULTPROPS;

export { LibraryCardCCBody };
