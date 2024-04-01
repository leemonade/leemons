import React from 'react';
import PropTypes from 'prop-types';
import { Box, ActionButton, ImageLoader, Stack, Text, COLORS } from '@bubbles-ui/components';
import { SortDragIcon, DeleteBinIcon, FileIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@tasks/helpers';
import { isEmpty } from 'lodash';
import { LocaleDate } from '@common';

const AttachmentItem = React.forwardRef(
  ({ provided, item, removeItem, classes, useAria, removeLabel }, ref) => {
    const [, translations] = useTranslateLoader(prefixPN('task_setup_page'));

    if (isEmpty(translations?.items)) return null;
    return (
      <Box
        ref={(e) => {
          provided.innerRef(e);
          if (ref) ref(e);
        }}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          width: 470,
          height: 60,
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: theme.other.table.border.color.default,
        })}
      >
        <Stack fullWidth fullHeight alignItems="center" justifyContent="center">
          <Box
            sx={() => ({
              width: 56,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            })}
          >
            <SortDragIcon className={classes.sortableIcon} />
          </Box>

          <Box
            id="box-image"
            sx={() => ({
              width: 88,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px 8px 4px 8px',
            })}
          >
            {item.cover ? (
              <ImageLoader src={item.cover || null} alt={item.name} />
            ) : (
              <FileIcon
                size={64}
                fileType={item.fileType}
                color={COLORS.text06}
                iconStyle={{ backgroundColor: COLORS.interactive03h }}
                hideExtension
              />
            )}
          </Box>
          <Stack
            direction="column"
            fullHeight
            sx={() => ({ width: 300, padding: '12px 8px 12px 8px' })}
          >
            <Text size="xs" color="primary">
              {item.name}
            </Text>

            <Text size="xs">
              {`${translations?.items?.['tasks.task_setup_page.setup.instructionData.labels.resourceLastUpdate']}: `}
              <LocaleDate
                date={new Date()}
                options={{
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                }}
              />
            </Text>
          </Stack>
          <Box
            sx={() => ({
              width: 56,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            })}
          >
            <ActionButton
              icon={<DeleteBinIcon width={24} height={24} color="#2F463F" />}
              onClick={removeItem}
              tooltip={removeLabel}
              useAria={useAria}
            />
          </Box>
        </Stack>
      </Box>
    );
  }
);
AttachmentItem.displayName = 'AttachmentItem';
AttachmentItem.propTypes = {
  item: PropTypes.object,
  removeItem: PropTypes.func,
  classes: PropTypes.object,
  useAria: PropTypes.bool,
  removeLabel: PropTypes.string,
  provided: PropTypes.object,
  ref: PropTypes.func,
};

export { AttachmentItem };
export default AttachmentItem;
