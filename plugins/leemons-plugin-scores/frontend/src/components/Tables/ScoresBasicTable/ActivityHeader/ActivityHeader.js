import React from 'react';
import { Box, Text, TextClamp, useHover } from '@bubbles-ui/components';
import { ActivityHeaderStyles } from './ActivityHeader.styles';
import { MoveLeftIcon, MoveRightIcon } from '@bubbles-ui/icons/outline';
import {
  ACTIVIY_HEADER_DEFAULT_PROPS,
  ACTIVIY_HEADER_PROP_TYPES,
} from './ActivityHeader.constants';
import { isFunction } from 'lodash';
import { CutStarIcon } from '@bubbles-ui/icons/solid';

const ActivityHeader = ({
  id,
  name,
  deadline,
  weight,
  isExpandable,
  isExpanded,
  locale,
  onColumnExpand,
  position,
  type,
}) => {
  const { ref, hovered } = useHover();

  const isEvaluable = type === 'evaluable';

  const onColumnExpandHandler = () => {
    if (isExpanded) {
      isFunction(onColumnExpand) && onColumnExpand(null);
      return;
    }
    isFunction(onColumnExpand) && onColumnExpand(id);
  };

  const { classes, cx } = ActivityHeaderStyles(
    { hovered, isExpandable, isExpanded, position },
    { name: 'ActivityHeader' }
  );

  return (
    <Box ref={ref} className={classes.root}>
      <Box className={classes.header}>
        <Box className={classes.title}>
          <TextClamp lines={2}>
            <Text role="productive" color="primary" stronger>
              {name}
            </Text>
          </TextClamp>
        </Box>
        <Box className={classes.info}>
          <TextClamp lines={1}>
            <Text role="productive" color="primary" size="xs">
              {`${new Date(deadline).toLocaleDateString(locale)} - ${
                isEvaluable ? '' : `${(weight * 100).toFixed(2)}%`
              }`}
              {isEvaluable && <CutStarIcon className={classes.starIcon} />}
            </Text>
          </TextClamp>
        </Box>
      </Box>
      {isExpandable && (hovered || isExpanded) && (
        <Box className={classes.expandBox} onClick={onColumnExpandHandler}>
          {isExpanded && <MoveLeftIcon width={16} height={16} />}
          {!isExpanded && <MoveRightIcon width={16} height={16} />}
        </Box>
      )}
    </Box>
  );
};

ActivityHeader.defaultProps = ACTIVIY_HEADER_DEFAULT_PROPS;
ActivityHeader.propTypes = ACTIVIY_HEADER_PROP_TYPES;

export { ActivityHeader };
