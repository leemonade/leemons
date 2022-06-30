import React, { useState, useMemo } from 'react';
import { Box, Title, InlineSvg } from '@bubbles-ui/components';
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import Filters from './components/Filters';
import { useAssignmentListStyle } from './AssignmentList.style';
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

export default function AssignmentList({
  archived,
  title,
  titleComponent,
  filters: filtersProps,
  defaultFilters = null,
  fullWidth,
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

  const [filters, setFilters] = useState(defaultFilters);

  const tabs = useMemo(() => {
    if (!archived) {
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
  }, [labels, archived]);

  const { classes, cx } = useAssignmentListStyle();
  return (
    <Box className={cx({ [classes?.root]: !fullWidth })}>
      {titleKey &&
        (titleComponent ? (
          React.cloneElement(titleComponent, { children: labels.title })
        ) : (
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
        ))}
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
