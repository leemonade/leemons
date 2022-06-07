import React, { useState, useMemo } from 'react';
import { Box, Title, InlineSvg } from '@bubbles-ui/components';
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import Filters from './components/Filters';
import { useAssignmentListStyle } from './AssignmentList.style';
import ActivitiesList from './components/ActivitiesList';
import prefixPN from '../../../helpers/prefixPN';

function parseTitleKey(title, closed) {
  if (title === null) {
    return null;
  }

  if (title) {
    return title;
  }

  if (closed) {
    return prefixPN('ongoing.history');
  }
  return prefixPN('ongoing.ongoing');
}

export default function AssignmentList({
  closed,
  title,
  filters: filtersProps,
  defualtFilters: defaultFilters = null,
  ...props
}) {
  const titleKey = parseTitleKey(title, closed);
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

  const [filters, setFilters] = useState(defaultFilters);

  const tabs = useMemo(() => {
    if (!closed) {
      return [
        {
          label: labels?.filters?.ongoing?.replace?.('{{count}}', ''), // `(${ongoingCount})`),
          value: 'ongoing',
        },
        {
          label: labels?.filters?.evaluated?.replace?.('{{count}}', ''), // `(${evaluatedCount})`),
          value: 'evaluated',
        },
      ];
    }

    return [
      {
        label: labels?.filters?.history?.replace?.('{{count}}', ''), // `(${evaluatedCount})`),
        value: 'history',
      },
      {
        label: labels?.filters?.evaluated?.replace?.('{{count}}', ''), // `(${evaluatedCount})`),
        value: 'evaluated',
      },
    ];
  }, [labels, closed]);

  const { classes } = useAssignmentListStyle();
  return (
    <Box className={classes?.root}>
      {titleKey && (
        <Box className={classes?.title}>
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
          <Title order={1}>{labels.title}</Title>
        </Box>
      )}
      <Filters
        labels={labels.filters}
        tabs={tabs}
        value={filters}
        onChange={setFilters}
        {...filtersProps}
        hideStatus
      />
      <ActivitiesList filters={filters} {...props} />
    </Box>
  );
}
