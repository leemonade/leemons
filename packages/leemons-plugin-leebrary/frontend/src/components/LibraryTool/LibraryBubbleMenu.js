/* eslint-disable import/prefer-default-export */
import React from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles, getBoxShadowFromToken, ActionButton } from '@bubbles-ui/components';
import {
  DeleteBinIcon,
  // EditorJustifiedAlignIcon,
  EditorLeftAlignIcon,
  EditorRightAlignIcon,
  EditorCenterAlignIcon,
} from '@bubbles-ui/icons/solid';
import { LayoutAgendaIcon, LayoutTwoColumsIcon } from '@bubbles-ui/icons/outline';
import { LibraryIcon } from './LibraryIcon';

const LibraryBubbleMenuStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;
  return {
    root: {
      padding: 20,
      borderRadius: 4,
      backgroundColor: globalTheme.background.color.surface.default,
      ...getBoxShadowFromToken(globalTheme.shadow['200']),
      display: 'flex',
      gap: 36,
      alignItems: 'center',
    },
    iconGroup: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      height: 32,
    },
  };
});

export const LibraryBubbleMenu = ({
  editor,
  editHandler,
  removeHandler,
  handleOnChange,
  labels,
  alignLabels,
  bubbleMenu,
}) => {
  const getData = () => {
    const content = editor.getAttributes('library');
    return content;
  };

  const handleChangeData = (property) => {
    const data = getData();
    const propertyKey = Object.keys(property)[0];
    const propertyValue = Object.values(property)[0];
    handleOnChange({ ...data, [propertyKey]: propertyValue });
  };

  const { classes } = LibraryBubbleMenuStyles({}, { name: 'LibraryBubbleMenu' });
  const actionButtonStyles = { height: '100%' };
  return (
    <Box className={classes.root}>
      {/* Content size */}
      <Box className={classes.iconGroup}>
        <ActionButton
          icon={<LayoutAgendaIcon height={20} width={20} />}
          onClick={() => handleChangeData({ width: '100%' })}
          tooltip={bubbleMenu.fullWidth}
        />
        <ActionButton
          icon={<LayoutTwoColumsIcon height={20} width={20} />}
          onClick={() => handleChangeData({ width: '50%' })}
          tooltip={bubbleMenu.twoColumns}
        />
      </Box>
      {/* Align */}
      <Box className={classes.iconGroup}>
        <ActionButton
          icon={<EditorLeftAlignIcon height={20} width={20} />}
          onClick={() => handleChangeData({ align: 'left' })}
          tooltip={alignLabels.left}
        />
        <ActionButton
          icon={<EditorCenterAlignIcon height={20} width={20} />}
          onClick={() => handleChangeData({ align: 'center' })}
          tooltip={alignLabels.center}
        />
        {/* <ActionButton icon={<EditorJustifiedAlignIcon height={20} width={20} />} /> */}
        <ActionButton
          icon={<EditorRightAlignIcon height={20} width={20} />}
          onClick={() => handleChangeData({ align: 'right' })}
          tooltip={alignLabels.right}
        />
      </Box>
      {/* Format */}
      <Box className={classes.iconGroup}>
        <ActionButton
          label={labels.embed?.toUpperCase()}
          style={actionButtonStyles}
          onClick={() => handleChangeData({ display: 'embed' })}
        />
        <ActionButton
          label={labels.card?.toUpperCase()}
          style={actionButtonStyles}
          onClick={() => handleChangeData({ display: 'card' })}
        />
        <ActionButton
          label={labels.player?.toUpperCase()}
          style={actionButtonStyles}
          onClick={() => handleChangeData({ display: 'player' })}
        />
      </Box>
      {/* Actions */}
      <Box className={classes.iconGroup}>
        <ActionButton
          icon={<LibraryIcon height={20} width={20} />}
          onClick={editHandler}
          tooltip={bubbleMenu.library}
        />
        <ActionButton
          active
          icon={<DeleteBinIcon height={20} width={20} />}
          onClick={removeHandler}
          tooltip={bubbleMenu.remove}
        />
      </Box>
    </Box>
  );
};

LibraryBubbleMenu.propTypes = {
  editor: PropTypes.object,
  editHandler: PropTypes.func,
  removeHandler: PropTypes.func,
  handleOnChange: PropTypes.func,
  labels: PropTypes.object,
  alignLabels: PropTypes.object,
  bubbleMenu: PropTypes.object,
};
