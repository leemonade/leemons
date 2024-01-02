import React from 'react';
import { Skeleton, Box } from '@bubbles-ui/components';
import { EvaluationCardSkeletonStyles } from './EvaluationCardSkeleton.styles';

const EvaluationCardSkeleton = () => {
  const { classes } = EvaluationCardSkeletonStyles();
  return (
    <Box className={classes.root}>
      <Box className={classes.wrapper}>
        <Box className={classes.color}>
          <Skeleton height={212} width={4} radius={4} />
        </Box>
        <Box className={classes.leftContent}>
          <Skeleton height={12} width={300} radius={100} />
          <Skeleton height={12} width={280} radius={100} mt={12} />
          <Box style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
            <Skeleton height={24} width={24} radius={100} />
            <Box>
              <Skeleton height={12} width={72} radius={100} mt={14} />
              <Skeleton height={8} width={72} radius={100} mt={6} />
            </Box>
          </Box>
          <Skeleton height={16} width={142} radius={8} mt={16} />
          <Box className={classes.footerContent}>
            <Box className={classes.footerWrapper}>
              <Skeleton height={24} width={24} radius={4} />
              <Skeleton height={8} width={36} radius={4} />
            </Box>
            <Skeleton height={24} width={24} radius={100} />
          </Box>
        </Box>
        <Box className={classes.rigthContent}>
          <Skeleton height={212} width={160} radius={0} />
        </Box>
      </Box>
    </Box>
  );
};

export default EvaluationCardSkeleton;
export { EvaluationCardSkeleton };
