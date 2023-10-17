import React from 'react';
import { Box, IconButton, MultiSelect, Stack, Switch, Text, Title } from '@bubbles-ui/components';
import { ExcludeIcon } from '@bubbles-ui/icons/solid';
import { AddIcon as PlusIcon, PluginSubjectsIcon } from '@bubbles-ui/icons/outline';
import { KanbanFiltersStyles } from './KanbanFilters.styles';

export const KANBAN_FILTERS_DEFAULT_PROPS = {
  messages: {
    title: 'Kanban',
    filter: 'Filter by',
    archived: 'Show archived tasks',
    selectCalendarsSubjects: 'All subjects',
    onlyByMy: 'Only those created by me'
  },
  value: {},
  data: {
    calendars: []
  },
  onChange: () => {
  },
  addEventClick: () => {
  }
};
export const KANBAN_FILTERS_PROP_TYPES = {};

const KanbanFilters = ({ value, data, messages, onChange, addEventClick, ...props }) => {
  const { classes, cx } = KanbanFiltersStyles({});

  return (
    <Box className={classes.root}>
      <Stack fullWidth justifyContent='space-between' alignItems='center'>
        <Stack alignItems='center'>
          <Stack alignItems='center'>
            <ExcludeIcon className={classes.icon} />
            <Title order={2} className={classes.title}>
              {messages.title}
            </Title>
          </Stack>
          <Box sx={(theme) => ({ marginLeft: theme.spacing[8] })}>
            <Stack alignItems='center'>
              <Text>{messages.filter}</Text>
              <MultiSelect
                value={value.calendars}
                data={data.calendars}
                className={classes.select}
                icon={<PluginSubjectsIcon />}
                onChange={(e) => onChange({ ...value, calendars: e })}
                placeholder={messages.selectCalendarsSubjects}
                clearable={true}
              />
              <Switch label={messages.onlyByMy} checked={value.onlyByMy}
                      onChange={(e) => onChange({ ...value, onlyByMy: e })} />
            </Stack>
          </Box>
        </Stack>
        <Stack alignItems='center'>
          <Box sx={(theme) => ({ marginRight: theme.spacing[8] })}>
            <Switch
              value={value.showArchived}
              onChange={(e) => onChange({ ...value, showArchived: e })}
              label={messages.archived}
            />
          </Box>
          <Stack alignItems='center'>
            <IconButton color='primary' size='lg' rounded onClick={addEventClick}>
              <PlusIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

KanbanFilters.defaultProps = KANBAN_FILTERS_DEFAULT_PROPS;
KanbanFilters.propTypes = KANBAN_FILTERS_PROP_TYPES;

export { KanbanFilters };
