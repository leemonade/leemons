import React from 'react';
import { createStyles, Stack, Text, Title, Button } from '@bubbles-ui/components';
import { Link } from 'react-router-dom';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import AssignmentList from '../../../components/Ongoing/AssignmentList';

const useOngoingStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    title: {
      ...globalTheme.content.typo.heading.md,
    },
    link: {
      ...theme.other.link.content.typo,
    },
  };
});

export default function Ongoing({ classe }) {
  const { classes } = useOngoingStyles();

  const [t1] = useTranslateLoader(prefixPN('ongoing'));
  const [t2] = useTranslateLoader(prefixPN('need_your_attention'));

  return (
    <Stack direction="column" spacing="md" fullWidth>
      <Stack alignItems="center" justifyContent="space-between">
        <Title className={classes.title}>{t1('ongoing')}</Title>
        <Link to="/private/assignables/ongoing">
          <Button variant="link" rightIcon={<ChevRightIcon />}>
            {t2('seeAllActivities')}
          </Button>
        </Link>
      </Stack>
      <AssignmentList
        archived={false}
        defaultFilters={{ class: classe?.id, closed: false }}
        filters={{ hideSubject: true }}
        withoutLayout
        titleComponent={<Text size="lg" color="primary"></Text>}
        subjectFullLength={false}
      />
    </Stack>
  );
}
