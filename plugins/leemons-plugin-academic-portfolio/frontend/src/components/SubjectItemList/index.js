import { Box, Stack, Text } from '@bubbles-ui/components';
import { HoverCard } from '@mantine/core';
import propTypes from 'prop-types';

import useSubjectItemListStyles from './SubjectItemList.styles';

import { SubjectItemDisplay } from '@academic-portfolio/components/SubjectItemDisplay';
import useSubjectDetails from '@academic-portfolio/hooks/useSubjectDetails';

export default function SubjectItemList({ subjects = [], maxVisibleSubjects = 3, itemWidth = 88 }) {
  const { classes } = useSubjectItemListStyles({ itemWidth });
  const visibleSubjects = [...subjects].slice(0, maxVisibleSubjects);
  const hiddenSubjects = [...subjects].slice(maxVisibleSubjects);
  const remainingCount = subjects.length - maxVisibleSubjects;

  const { data: hiddenSubjectsDetails } = useSubjectDetails(hiddenSubjects, {
    enabled: hiddenSubjects.length > 0,
  });

  return (
    <Box className={classes.root}>
      {[...visibleSubjects].map((subjectId) => (
        <Stack key={subjectId} className={classes.subjectWrapper}>
          <SubjectItemDisplay subjectsIds={[subjectId]} />
        </Stack>
      ))}
      {remainingCount > 0 && hiddenSubjectsDetails?.length > 0 && (
        <HoverCard withArrow position="top">
          <HoverCard.Target>
            <Text className={classes.moreChip}>{`+${remainingCount} more`}</Text>
          </HoverCard.Target>
          <HoverCard.Dropdown className={classes.dropdown}>
            {hiddenSubjectsDetails?.map((subject) => (
              <Text className={classes.labelTooltip} key={subject.id}>
                {subject.name}
              </Text>
            ))}
          </HoverCard.Dropdown>
        </HoverCard>
      )}
    </Box>
  );
}

SubjectItemList.propTypes = {
  subjects: propTypes.array,
  maxVisibleSubjects: propTypes.number,
  itemWidth: propTypes.number,
};

export { SubjectItemList };
