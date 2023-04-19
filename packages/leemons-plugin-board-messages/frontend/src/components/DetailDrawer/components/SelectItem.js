import React from 'react';
import PropTypes from 'prop-types';
import { Box, ImageLoader, Text, TextClamp, ActionButton } from '@bubbles-ui/components';
import { RemoveIcon } from '@bubbles-ui/icons/outline';
import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';

const SelectItem = ({ subject, isValueComponent, onRemove, ...props }) => {
  if (!subject) {
    return null;
  }

  return (
    <Box {...props}>
      <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing[2],
          alignItems: 'center',
          height: '100%',
          // width: isValueComponent && '22ch',
        })}
      >
        <Box
          sx={() => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 24,
            minHeight: 24,
            maxWidth: 24,
            maxHeight: 24,
            borderRadius: '50%',
            backgroundColor: subject?.color,
          })}
        >
          <ImageLoader
            sx={() => ({
              borderRadius: 0,
              filter: 'brightness(0) invert(1)',
            })}
            forceImage
            width={16}
            height={16}
            src={typeof subject?.icon === 'string' ? subject.icon : getClassIcon({ subject })}
          />
        </Box>
        <TextClamp lines={1}>
          <Text>{subject.name}</Text>
        </TextClamp>
        {isValueComponent && (
          <Box
            style={{
              height: 16,
              width: 16,
              minWidth: 16,
              minHeight: 16,
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={onRemove}
          >
            <RemoveIcon height={8} width={8} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

SelectItem.propTypes = {
  subject: PropTypes.object,
  isValueComponent: PropTypes.bool,
  onRemove: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { SelectItem };
