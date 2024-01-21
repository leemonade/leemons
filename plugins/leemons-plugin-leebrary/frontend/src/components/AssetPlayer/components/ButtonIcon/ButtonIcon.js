import React from 'react';
import { Box } from '@bubbles-ui/components';
import { DownloadIcon, OpenIcon, SearchPlusIcon } from '@bubbles-ui/icons/outline';
import { ControlsPlayIcon } from '@bubbles-ui/icons/solid';

import { ButtonIconStyles } from './ButtonIcon.styles';
import { BUTTONICON_DEFAULT_PROPS, BUTTONICON_PROP_TYPES } from './ButtonIcon.constants';

const ButtonIcon = ({ fileType }) => {
  const { classes } = ButtonIconStyles({});
  const fileTypeIcon = {
    image: (
      <SearchPlusIcon
        color={'white'}
        width={24}
        height={24}
        style={{ marginTop: 8, marginLeft: 6 }}
      />
    ),
    file: <DownloadIcon color={'white'} />,
    document: <OpenIcon color={'white'} width={18} height={18} />,
    video: <ControlsPlayIcon color={'white'} />,
  };

  return (
    <Box
      className={classes.root}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Box>{fileType && fileTypeIcon[fileType]}</Box>
    </Box>
  );
};

ButtonIcon.popTypes = BUTTONICON_PROP_TYPES;
ButtonIcon.defaultProps = BUTTONICON_DEFAULT_PROPS;
ButtonIcon.displayName = 'ButtonIcon';

export { ButtonIcon };
