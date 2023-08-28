import React from 'react';
import { Box, Text, TextClamp, useHover, Stack, ImageLoader } from '@bubbles-ui/components';
import { SubjectHeaderStyles } from './SubjectHeader.styles';
import { SUBJECT_HEADER_DEFAULT_PROPS, SUBJECT_HEADER_PROP_TYPES } from './SubjectHeader.constants';

const SubjectHeader = ({ id, name, group, icon, color, isFirst, isLast }) => {
  const { ref, hovered } = useHover();
  const { classes } = SubjectHeaderStyles(
    { hovered, color, isFirst, isLast },
    { name: 'SubjectHeader' }
  );

  return (
    <Box ref={ref} className={classes.root}>
      <Box className={classes.header}>
        <Stack alignItems="center" spacing={3} className={classes.title}>
          <Box className={classes.iconWrapper}>
            <ImageLoader src={icon} height={16} width={16} forceImage />
          </Box>
          <TextClamp lines={2}>
            <Text color="primary" strong>
              {`${name} - ${group}`}
            </Text>
          </TextClamp>
        </Stack>
      </Box>
    </Box>
  );
};

SubjectHeader.defaultProps = SUBJECT_HEADER_DEFAULT_PROPS;
SubjectHeader.propTypes = SUBJECT_HEADER_PROP_TYPES;

export { SubjectHeader };
