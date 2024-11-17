import React from 'react';
import PropTypes from 'prop-types';
import { Skeleton, Stack } from '@bubbles-ui/components';

const LibraryCardMenuSkeletonItems = ({ items = 1 }) => {
  const Item = (
    <Stack alignItems="center" spacing={2}>
      <Skeleton height={12} width={12} radius={100} />
      <Skeleton height={12} width={54} radius={4} />
    </Stack>
  );
  return (
    <Stack direction="column" spacing={2}>
      {Array.from({ length: items }).map(() => Item)}
    </Stack>
  );
};

LibraryCardMenuSkeletonItems.propTypes = {
  items: PropTypes.number,
};

export { LibraryCardMenuSkeletonItems };
export default LibraryCardMenuSkeletonItems;
