import { Skeleton, Box } from '@bubbles-ui/components';
import React from 'react';

const ClassroomItemDisplaySkeleton = () => (
  <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
    <Skeleton height={24} width={24} radius={100} />
    <Box>
      <Skeleton height={12} width={72} radius={100} mt={14} />
      <Skeleton height={8} width={72} radius={100} mt={6} />
    </Box>
  </Box>
);

export default ClassroomItemDisplaySkeleton;
export { ClassroomItemDisplaySkeleton };
