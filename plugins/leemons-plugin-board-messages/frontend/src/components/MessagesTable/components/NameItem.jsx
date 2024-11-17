import React from 'react';
import PropTypes from 'prop-types';
import { Box, ImageLoader, TextClamp, Text } from '@bubbles-ui/components';
import prepareAsset from '@leebrary/helpers/prepareAsset';

const NameItem = ({ name, owner, asset }) => {
  const preparedAsset = prepareAsset(asset || {});
  const ownerFullName = `${owner.name} ${owner.surnames} ${owner.secondSurname || ''}`;
  return (
    <Box style={{ display: 'flex', gap: 24, height: '100%', alignItems: 'center', padding: 4 }}>
      <Box style={{ border: '1px solid #F8F9FC', borderRadius: 2 }}>
        {preparedAsset?.cover ? (
          <ImageLoader src={preparedAsset?.cover} width={40} height={40} />
        ) : (
          <Box
            sx={(theme) => ({
              height: 40,
              width: 40,
              backgroundColor: theme.other.global.background.color.surface.subtle,
            })}
          />
        )}
      </Box>
      <Box style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <TextClamp lines={1}>
          <Text role="productive" color="primary">
            {name}
          </Text>
        </TextClamp>
        <TextClamp lines={1}>
          <Text role="productive" color="soft">
            {ownerFullName}
          </Text>
        </TextClamp>
      </Box>
    </Box>
  );
};

NameItem.propTypes = {
  name: PropTypes.string,
  asset: PropTypes.object,
  owner: PropTypes.object,
};

// eslint-disable-next-line import/prefer-default-export
export { NameItem };
