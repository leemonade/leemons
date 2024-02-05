/* eslint-disable import/prefer-default-export */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles, getBoxShadowFromToken, ActionButton } from '@bubbles-ui/components';
import {
  DeleteBinIcon,
  // EditorJustifiedAlignIcon,
  EditorLeftAlignIcon,
  EditorRightAlignIcon,
  EditorCenterAlignIcon,
} from '@bubbles-ui/icons/solid';
import { LayoutAgendaIcon, LayoutTwoColumsIcon, FloatImageIcon } from '@bubbles-ui/icons/outline';
import { MathIcon } from './MathIcon';

const MathBubbleMenuStyles = createStyles((theme) => {
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

export const MathBubbleMenu = ({
  editor,
  editHandler,
  removeHandler,
  handleOnChange,
  labels,
  alignLabels,
  bubbleMenu,
}) => {
  const data = editor.getAttributes('math');

  const handleChangeData = (property) => {
    const propertyKey = Object.keys(property)[0];
    const propertyValue = Object.values(property)[0];
    handleOnChange({ ...data, [propertyKey]: propertyValue });
  };

  useEffect(() => {
    if (data.isFloating && data.align === 'center') handleChangeData({ align: 'left' });
  }, [data.isFloating]);

  const { classes } = MathBubbleMenuStyles({}, { name: 'MathBubbleMenu' });
  const actionButtonStyles = { height: '100%' };
  return (
    <Box className={classes.root}>
      {/* Content size */}
      <Box className={classes.iconGroup}>
        <ActionButton
          icon={<LayoutAgendaIcon height={20} width={20} />}
          onClick={() => handleChangeData({ width: '100%' })}
          tooltip={bubbleMenu.fullWidth}
          active={data.width === '100%'}
          disabled={data.isFloating}
        />
        <ActionButton
          icon={<LayoutTwoColumsIcon height={20} width={20} />}
          onClick={() => handleChangeData({ width: '50%' })}
          tooltip={bubbleMenu.twoColumns}
          active={data.width === '50%'}
        />
        <ActionButton
          icon={<FloatImageIcon height={20} width={20} />}
          onClick={() => handleChangeData({ isFloating: !data.isFloating })}
          tooltip={'Float image'}
          active={data.isFloating}
          disabled={data.width === '100%'}
        />
      </Box>
      {/* Align */}
      <Box className={classes.iconGroup}>
        <ActionButton
          icon={<EditorLeftAlignIcon height={20} width={20} />}
          onClick={() => handleChangeData({ align: 'left' })}
          tooltip={alignLabels.left}
          active={data.align === 'left'}
        />
        <ActionButton
          icon={<EditorCenterAlignIcon height={20} width={20} />}
          onClick={() => handleChangeData({ align: 'center' })}
          tooltip={alignLabels.center}
          active={data.align === 'center'}
          disabled={data.isFloating}
        />
        {/* <ActionButton icon={<EditorJustifiedAlignIcon height={20} width={20} />} /> */}
        <ActionButton
          icon={<EditorRightAlignIcon height={20} width={20} />}
          onClick={() => handleChangeData({ align: 'right' })}
          tooltip={alignLabels.right}
          active={data.align === 'right'}
        />
      </Box>
      {/* Format ----------------------- */}

      <Box className={classes.iconGroup}>
        <ActionButton
          label={labels.embed?.toUpperCase()}
          style={actionButtonStyles}
          onClick={() => handleChangeData({ display: 'embed' })}
          active={data.display === 'embed'}
        />
        <ActionButton
          label={labels.player?.toUpperCase()}
          style={actionButtonStyles}
          onClick={() => handleChangeData({ display: 'player' })}
          active={data.display === 'player'}
        />
      </Box>

      {/* Actions */}
      <Box className={classes.iconGroup}>
        <ActionButton
          icon={<MathIcon height={20} width={20} />}
          onClick={editHandler}
          tooltip={bubbleMenu.math}
        />
        <ActionButton
          icon={<DeleteBinIcon height={20} width={20} />}
          onClick={removeHandler}
          tooltip={bubbleMenu.remove}
        />
      </Box>
    </Box>
  );
};

MathBubbleMenu.propTypes = {
  editor: PropTypes.object,
  editHandler: PropTypes.func,
  removeHandler: PropTypes.func,
  handleOnChange: PropTypes.func,
  labels: PropTypes.object,
  alignLabels: PropTypes.object,
  bubbleMenu: PropTypes.object,
};
