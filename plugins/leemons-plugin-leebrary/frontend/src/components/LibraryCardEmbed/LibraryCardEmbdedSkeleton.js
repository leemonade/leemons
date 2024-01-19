import { Box, Skeleton } from '@bubbles-ui/components';
import React from 'react';
// import { LibraryCardSkeletonStyles } from './LibraryCardSkeleton.styles';

const LibraryCardEmbedSkeleton = () => (
  // const { classes } = LibraryCardSkeletonStyles();
  <Box>
    <Box style={{ width: 440 }} />
    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box style={{ display: 'flex' }}>
        <Skeleton height={58} width={72} radius={4} ml={8} />
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Box>
            <Skeleton height={8} width={114} radius={0} ml={8} mt={16} />
            <Skeleton height={8} width={144} radius={0} mt={6} ml={8} />
          </Box>
        </Box>
      </Box>
      <Skeleton height={24} width={24} radius={100} mr={14} mb={12} />
    </Box>
  </Box>
);
export default LibraryCardEmbedSkeleton;
export { LibraryCardEmbedSkeleton };
