import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { createStyles, Stack, Text, Title, Button } from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@assignables/helpers/prefixPN';
import useWelcome from '@dashboard/request/hooks/queries/useWelcome';
import {
  useOngoingData,
  useOngoingQuery,
} from '@assignables/components/Ongoing/AssignmentList/components/ActivitiesList/ActivitiesList';
import AssignmentList from '../../../components/Ongoing/AssignmentList';

const ongoingQueryFilters = {
  subject: 'all',
  status: 'all',
  progress: 'all',
  type: 'all',
  sort: 'assignation',
  query: '',
  closed: false,
  isArchived: false,
  program: null,
  offset: 0,
  limit: 9,
  modulesData: true,
};

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
  const [t1] = useTranslateLoader(prefixPN('ongoing'));
  const [t2] = useTranslateLoader(prefixPN('need_your_attention'));

  const { classes } = useOngoingStyles();
  const { data: welcomeCompleted } = useWelcome();

  const query = useOngoingQuery({
    ...ongoingQueryFilters,
    class: classe?.id,
  });
  const { totalCount: ongoingCount } = useOngoingData({ query, page: 0, size: 10 });

  if (!welcomeCompleted && !ongoingCount) {
    return null;
  }

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

Ongoing.propTypes = {
  classe: PropTypes.object,
};
