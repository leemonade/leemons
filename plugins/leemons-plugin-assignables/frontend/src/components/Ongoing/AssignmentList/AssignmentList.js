import React, { useMemo, useState } from 'react';

import {
  Box,
  Button,
  createStyles,
  Divider,
  InlineSvg,
  TabPanel,
  Tabs,
  Text,
  Title,
} from '@bubbles-ui/components';

import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useIsStudent, useIsTeacher } from '@academic-portfolio/hooks';
import { Link } from 'react-router-dom';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import Filters from './components/Filters';
import ActivitiesList from './components/ActivitiesList';
import prefixPN from '../../../helpers/prefixPN';

function parseTitleKey(title, archived) {
  if (title === null) {
    return null;
  }

  if (title) {
    return title;
  }

  if (archived) {
    return prefixPN('ongoing.history');
  }
  return prefixPN('ongoing.ongoing');
}

const useAssignmentListHeaderStyles = createStyles((theme) => ({
  fullWidth: {
    marginLeft: theme.spacing[10],
    marginRight: theme.spacing[10],
    marginTop: theme.spacing[7],
    marginBottom: theme.spacing[7],
  },
  title: {
    position: 'relative',
    marginTop: theme.spacing[6],
    display: 'flex',
    gap: theme.spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleText: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '28px',
  },
}));

function Header({ icon, title, fullWidth, separator, isTitle, linkTo, linkLabel }) {
  const { classes, cx } = useAssignmentListHeaderStyles();
  return (
    <>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        className={cx({ [classes?.fullWidth]: !fullWidth })}
      >
        <Box className={classes?.title}>
          {!!icon && icon}
          {isTitle ? (
            <Title order={1}>{title}</Title>
          ) : (
            <Text color="primary" className={classes.titleText}>
              {title}
            </Text>
          )}
        </Box>
        {linkTo && linkLabel ? (
          <Link to={linkTo}>
            <Button variant="link" rightIcon={<ChevRightIcon />}>
              {linkLabel}
            </Button>
          </Link>
        ) : null}
      </Box>
      {!!separator && <Divider />}
    </>
  );
}

const useAssignmentListStyles = createStyles((theme) => ({
  fullWidth: {
    marginLeft: theme.spacing[10],
    marginRight: theme.spacing[10],
  },
  tabGaps: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing[5],
    gap: theme.spacing[8],
    marginBottom: theme.spacing[13],
  },
}));

export default function AssignmentList({
  archived,
  title,
  titleComponent,
  filters: filtersProps,
  defaultFilters = null,
  linkTo,
  fullWidth,
  header,
  ...props
}) {
  const isStudent = useIsStudent();
  const isTeacher = useIsTeacher();

  const titleKey = parseTitleKey(title, archived);
  const keys = [prefixPN('activities_filters')];
  if (titleKey) {
    keys.push(titleKey);
  }
  const [, translations] = useTranslateLoader(keys);

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return { filters: _.get(res, prefixPN('activities_filters')), title: _.get(res, titleKey) };
    }

    return {};
  }, [translations]);

  const [filters, setFilters] = useState(null);

  const tabs = useMemo(
    () => [
      {
        label: labels?.filters?.ongoing?.replace?.('{{count}}', ''), // `(${ongoingCount})`),
        value: 'ongoing',
      },
      {
        label: labels?.filters?.history?.replace?.('{{count}}', ''), // `(${historyCount})`),
        value: 'evaluated',
      },
    ],
    [labels]
  );

  const icon = (
    <InlineSvg
      style={{
        display: 'inline-block',
        position: 'relative',
        width: 24,
        heiht: 24,
      }}
      width={24}
      height={24}
      src="/public/assignables/menu-icon.svg"
    />
  );
  const headerProps = {
    fullWidth,
    // icon: header?.icon || icon,
    title: header?.title || labels.title,
    separator: header?.separator || false,
    isTitle: header?.isTitle || false,
    linkTo,
    linkLabel: labels?.filters?.seeAllActivities,
  };

  const { classes, cx } = useAssignmentListStyles();
  return (
    <Box>
      <Header {...headerProps} />
      <Box
        sx={(theme) => ({
          padding: theme.spacing[6],
          marginTop: theme.spacing[4],
          backgroundColor: 'white',
          borderRadius: 4,
        })}
        className={cx({ [classes.fullWidth]: !fullWidth })}
      >
        <Tabs>
          {tabs.map((tab) => (
            <TabPanel key={tab.value} label={tab.label}>
              <Box className={classes.tabGaps}>
                <Filters
                  labels={labels.filters}
                  value={filters}
                  onChange={setFilters}
                  hideStatus={isStudent}
                  hideProgress={isTeacher}
                  defaultFilters={defaultFilters}
                  useRouter
                  {...filtersProps}
                />
                <ActivitiesList
                  filters={{ ...filters, isArchived: tab.value === 'evaluated' }}
                  {...props}
                />
              </Box>
            </TabPanel>
          ))}
        </Tabs>
      </Box>
    </Box>
  );
}
