import { Box, Skeleton } from '@bubbles-ui/components';
import React from 'react';
import { LibraryCardSkeletonStyles } from './LibraryCardSkeleton.styles';

const LibraryCardSkeleton = () => {
  const { classes } = LibraryCardSkeletonStyles();
  return (
    <Box className={classes.root}>
      <Box className={classes.subjectCover} />
      <Skeleton height={144} radius={0} />
      <Box className={classes.cardContent}>
        <Skeleton height={20} width={20} radius={0} />
        <Skeleton height={12} width={186} radius={100} mt={18} />
        <Skeleton height={12} width={215} radius={100} mt={12} />
        <Skeleton height={8} width={186} radius={100} mt={18} />
        <Skeleton height={8} width={215} radius={100} mt={12} />
        <Box className={classes.subjectContainer}>
          <Skeleton height={16} width={16} radius={4} />
          <Box className={classes.programContainer}>
            <Skeleton height={8} width={186} radius={100} mt={12} />
            <Skeleton height={8} width={58} radius={100} mt={6} />
          </Box>
        </Box>
        <Box className={classes.footer}>
          <Box className={classes.footerContainer}>
            <Skeleton height={18} width={18} radius={0} />
            <Skeleton height={8} width={53} radius={100} />
          </Box>
          <Box className={classes.footerContainer}>
            <Skeleton height={16} width={16} radius={4} />
            <Skeleton height={8} width={53} radius={100} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default LibraryCardSkeleton;
export { LibraryCardSkeleton };
