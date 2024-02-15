import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';
import { Box, ImageLoader, Text, TextClamp } from '@bubbles-ui/components';
import React from 'react';

function ClassItem({ class: klass, dropdown = false, ...props }) {
  return (
    <Box {...props}>
      <Box
        sx={(theme) => ({
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing[2],
          alignItems: 'center',
        })}
      >
        <Box
          sx={() => ({
            position: dropdown ? 'static' : 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 26,
            minHeight: 26,
            maxWidth: 26,
            maxHeight: 26,
            borderRadius: '50%',
            backgroundColor: klass?.color,
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
            src={getClassIcon(klass)}
          />
        </Box>
        <Box
          sx={(theme) => ({
            marginLeft: dropdown ? 0 : 26 + theme.spacing[2],
          })}
        >
          <TextClamp lines={dropdown ? 3 : 1}>
            {!klass.groups.isAlone && klass.groups?.name ? (
              <Text>{`${klass.subject.name} - ${klass.groups.name}`}</Text>
            ) : (
              <Text>{klass.subject.name}</Text>
            )}
          </TextClamp>
        </Box>
      </Box>
    </Box>
  );
}

export default ClassItem;
