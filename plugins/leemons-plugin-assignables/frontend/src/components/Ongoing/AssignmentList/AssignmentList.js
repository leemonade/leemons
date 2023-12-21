import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Title,
  Text,
  Tabs,
  TabPanel,
  Divider,
  createStyles,
  TotalLayoutContainer,
  TotalLayoutStepContainer,
  Stack,
  ContextContainer,
  Paper,
} from '@bubbles-ui/components';

import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
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

  withoutLayout,
  ...props
}) {
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
    () =>
      [
        {
          label: labels?.filters?.ongoing?.replace?.('{{count}}', ''), // `(${ongoingCount})`),
          value: 'ongoing',
        },
        !!archived && {
          label: labels?.filters?.history?.replace?.('{{count}}', ''), // `(${historyCount})`),
          value: 'evaluated',
        },
      ].filter(Boolean),
    [labels, archived]
  );

  const { classes } = useAssignmentListStyles();

  const tabPane = useCallback(
    (tab) => (
      <>
        <Filters
          labels={labels.filters}
          value={filters}
          onChange={setFilters}
          hideStatus={tab.value === 'evaluated'}
          hideProgress
          defaultFilters={defaultFilters}
          useRouter
          {...filtersProps}
        />
        <ActivitiesList
          filters={{ ...filters, isArchived: tab.value === 'evaluated' }}
          {...props}
        />
      </>
    ),
    [labels, filters, setFilters, filtersProps, props, classes.tabGaps]
  );

  const View = useMemo(
    () =>
      tabs?.length > 1 ? (
        <Tabs tabPanelListStyle={{ backgroundColor: 'white' }} fullHeight>
          {tabs.map((tab) => (
            <TabPanel key={tab.value} label={tab.label}>
              <ContextContainer padded>
                <Box className={classes.tabGaps}>{tabPane(tab)}</Box>
              </ContextContainer>
            </TabPanel>
          ))}
        </Tabs>
      ) : (
        <Paper>{tabPane(tabs['0'])}</Paper>
      ),
    [tabs, tabPane]
  );

  if (withoutLayout) {
    return View;
  }

  return (
    <TotalLayoutContainer>
      <Stack justifyContent="center" fullWidth>
        <TotalLayoutStepContainer clean stepName={labels.title}>
          {View}
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
  );
}

AssignmentList.propTypes = {
  archived: PropTypes.bool,
  title: PropTypes.string,
  titleComponent: PropTypes.element,
  filters: PropTypes.object,
  defaultFilters: PropTypes.object,
  withoutLayout: PropTypes.bool,
};
