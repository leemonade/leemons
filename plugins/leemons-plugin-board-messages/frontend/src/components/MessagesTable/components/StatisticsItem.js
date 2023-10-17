import React from 'react';
import PropTypes from 'prop-types';
import { Box, TextClamp, Text } from '@bubbles-ui/components';

const StatisticsItem = ({ labels, totalViews, totalClicks, status }) => {
  const showStats = status !== 'programmed';
  const ctr = (totalClicks / totalViews) * 100 || 0;
  return (
    <Box>
      <Box style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <TextClamp lines={1}>
          <Text role="productive" color="primary">
            {`${labels.impressions}: ${showStats ? totalViews || '0' : '-'}`}
          </Text>
        </TextClamp>
        <TextClamp lines={1}>
          <Text role="productive" color="primary">
            {`${labels.clicks}: ${showStats ? totalClicks || '0' : ''} - ${labels.ctr}: ${
              showStats ? ctr.toFixed(2) || '0' : '-'
            }%`}
          </Text>
        </TextClamp>
      </Box>
    </Box>
  );
};

StatisticsItem.propTypes = {
  labels: PropTypes.object,
  totalViews: PropTypes.number,
  totalClicks: PropTypes.number,
  status: PropTypes.string,
};

// eslint-disable-next-line import/prefer-default-export
export { StatisticsItem };
