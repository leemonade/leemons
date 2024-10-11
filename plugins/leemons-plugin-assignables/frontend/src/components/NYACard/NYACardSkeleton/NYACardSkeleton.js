import React from 'react';

import { Box, Skeleton } from '@bubbles-ui/components';

import { NYACardSkeletonStyles } from './NYACardSkeleton.styles';

const NYACardSkeleton = () => {
  const { classes } = NYACardSkeletonStyles();
  return (
    <Box className={classes.root}>
      <Box className={classes.subjectCover} />
      <Skeleton height={144} radius={0} />
      <Box className={classes.cardContent}>
        <Box className={classes.badgesContainer}>
          <Skeleton height={24} width={54} radius={4} />
          <Skeleton height={24} width={72} radius={4} />
        </Box>
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
            <Skeleton height={24} width={24} radius={100} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default NYACardSkeleton;
export { NYACardSkeleton };
