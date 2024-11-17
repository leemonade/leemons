import { Box, Skeleton, Stack } from '@bubbles-ui/components';
import React from 'react';
// import { LibraryCardSkeletonStyles } from './LibraryCardSkeleton.styles';

const LibraryCardEmbedSkeleton = () => (
  // const { classes } = LibraryCardSkeletonStyles();
  <Box style={{ width: '100%', paddingTop: 4, paddingBottom: 4 }}>
    <Stack alignItems="center" fullWidth spacing={4}>
      <Box>
        <Skeleton height={58} width={72} radius={4} ml={8} />
      </Box>
      <Stack fullWidth direction="column">
        <Box>
          <Skeleton height={8} width={114} radius={0} />
          <Skeleton height={8} width={144} radius={0} mt={6} />
        </Box>
      </Stack>
      <Box>
        <Skeleton height={24} width={24} radius={100} />
      </Box>
    </Stack>
  </Box>
);
export default LibraryCardEmbedSkeleton;
export { LibraryCardEmbedSkeleton };
