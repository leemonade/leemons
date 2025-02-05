import {
  Box,
  ImageLoader,
  Stack,
  Text,
  TextClamp,
  useHover,
  ActionButton,
} from '@bubbles-ui/components';
import { DeleteBinIcon, MoveLeftIcon, MoveRightIcon } from '@bubbles-ui/icons/outline';
import { AlertWarningTriangleIcon, CutStarIcon } from '@bubbles-ui/icons/solid';
import { useLayout } from '@layout/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isFunction } from 'lodash';

import {
  ACTIVIY_HEADER_DEFAULT_PROPS,
  ACTIVIY_HEADER_PROP_TYPES,
} from './ActivityHeader.constants';
import { ActivityHeaderStyles } from './ActivityHeader.styles';

import { prefixPN } from '@scores/helpers';
import { useRemoveManualActivityMutation } from '@scores/requests/hooks/mutations/useRemoveManualActivityMutation';

const ActivityHeader = ({
  id,
  name,
  deadline,
  weight,
  hasNoWeight,
  isExpandable,
  isExpanded,
  locale,
  onColumnExpand,
  position,
  type,
  roleIcon,
  source,
  classId,
  ...props
}) => {
  const { ref, hovered } = useHover();
  const [t] = useTranslateLoader(prefixPN('manualActivityDeletionModal'));

  const isEvaluable = type === 'evaluable';
  const isManualActivity = source === 'manualActivities';

  const { openConfirmationModal } = useLayout();
  const { mutate: removeManualActivity } = useRemoveManualActivityMutation();

  const onColumnExpandHandler = () => {
    if (isExpanded) {
      isFunction(onColumnExpand) && onColumnExpand(null);
      return;
    }
    isFunction(onColumnExpand) && onColumnExpand(id);
  };

  const { classes, theme } = ActivityHeaderStyles(
    { hovered, isExpandable, isExpanded, position, isManualActivity },
    { name: 'ActivityHeader' }
  );

  return (
    <Box ref={ref} className={classes.root}>
      <Box className={classes.header}>
        {isManualActivity && (
          <Box className={classes.removeIcon}>
            <ActionButton
              icon={<DeleteBinIcon width={18} height={18} />}
              onClick={() =>
                openConfirmationModal({
                  title: t('title'),
                  description: t('description'),
                  labels: {
                    cancel: t('cancel'),
                    confirm: t('confirm'),
                  },
                  onConfirm: () => removeManualActivity({ id, classId }),
                })()
              }
            />
          </Box>
        )}
        <Stack spacing={2}>
          {roleIcon && (
            <Box sx={{ position: 'relative', width: 16, height: 16 }}>
              <ImageLoader src={roleIcon} width={16} height={16} />
            </Box>
          )}
          {!hasNoWeight ? (
            <Text role="productive" color="primary">
              {parseFloat((weight * 100).toFixed(2))}%
            </Text>
          ) : (
            <AlertWarningTriangleIcon color={theme.other.banner.content.color.error} />
          )}
        </Stack>
        <TextClamp lines={2}>
          <Text role="productive" color="primary" stronger>
            {name}
          </Text>
        </TextClamp>
        <Box sx={{ minHeight: 16.8 }}>
          {deadline && (
            <Stack spacing={2}>
              <TextClamp lines={1}>
                <Text role="productive" color="primary" size="xs">
                  {`${new Date(deadline).toLocaleDateString(locale)}`}
                </Text>
              </TextClamp>
              {!isEvaluable && <CutStarIcon className={classes.starIcon} />}
            </Stack>
          )}
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
