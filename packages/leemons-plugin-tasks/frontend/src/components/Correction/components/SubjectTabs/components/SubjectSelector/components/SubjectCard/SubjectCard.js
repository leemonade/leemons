import React from 'react';
import { ImageLoader, Box, TextClamp } from '@bubbles-ui/components';
import { StarIcon, StarAlternateIcon } from '@bubbles-ui/icons/solid';
import { SubjectCardStyles } from './SubjectCard.style';

function SubjectImage({ subject }) {
  if (subject.image) {
    return <ImageLoader src={subject.image} radius={100} width={40} height={40} />;
  }

  if (subject.icon) {
    return <ImageLoader src={subject.icon} radius={100} width={40} height={40} />;
  }

  // UUID: 5a9f9f8e-f8f8-4f0f-b8b8-f8f8f8f8f8f8
  return <Box />;
}

export default function SubjectCard({ subject, corrected, selected }) {
  const { classes } = SubjectCardStyles({ corrected, selected });
  console.log('subject', subject);
  return (
    <Box className={classes.root}>
      <Box className={classes.imageContainer}>
        <SubjectImage subject={subject} />
        <Box className={classes.correctionMarker}>
          {corrected ? (
            <StarIcon width={15} color="white" />
          ) : (
            <StarAlternateIcon width={15} color="white" />
          )}
        </Box>
      </Box>
      <Box className={classes.nameContainer}>
        <TextClamp lines={1} showTooltip color="primary" size="sm">
          {subject.name}
        </TextClamp>
        <TextClamp lines={1} showTooltip color="secondary" size="xs">
          {subject.internalId}
        </TextClamp>
      </Box>
    </Box>
  );
}
