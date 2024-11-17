import React from 'react';
import { Box, Button, MultiSelect, Stack, Switch } from '@bubbles-ui/components';
import { AddIcon as PlusIcon, PluginSubjectsIcon } from '@bubbles-ui/icons/outline';
import PropTypes from 'prop-types';
import { KanbanFiltersStyles } from './KanbanFilters.styles';

export const KANBAN_FILTERS_DEFAULT_PROPS = {
  messages: {
    title: 'Kanban',
    filter: 'Filter by',
    archived: 'Show archived tasks',
    selectCalendarsSubjects: 'All subjects',
    onlyByMy: 'Only those created by me',
  },
  value: {},
  data: {
    calendars: [],
  },
  onChange: () => {},
  addEventClick: () => {},
};
export const KANBAN_FILTERS_PROP_TYPES = {
  messages: PropTypes.shape({
    title: PropTypes.string,
    filter: PropTypes.string,
    archived: PropTypes.string,
    selectCalendarsSubjects: PropTypes.string,
    onlyByMy: PropTypes.string,
    new: PropTypes.string,
  }),
  value: PropTypes.object,
  data: PropTypes.object,
  onChange: PropTypes.func,
  addEventClick: PropTypes.func,
};

const KanbanFilters = ({ value, data, messages, onChange, addEventClick, ...props }) => {
  const { classes, cx } = KanbanFiltersStyles({});

  return (
    <Box className={classes.root}>
      <Stack fullWidth justifyContent="space-between" alignItems="center">
        <Stack alignItems="center">
          <Box>
            <Stack alignItems="center">
              <MultiSelect
                value={value.calendars}
                data={data.calendars}
                className={classes.select}
                icon={<PluginSubjectsIcon />}
                onChange={(e) => onChange({ ...value, calendars: e })}
                placeholder={messages.selectCalendarsSubjects}
                clearable={true}
              />
              <Switch
                label={messages.onlyByMy}
                checked={value.onlyByMy}
                onChange={(e) => onChange({ ...value, onlyByMy: e })}
              />
              <Switch
                value={value.showArchived}
                onChange={(e) => onChange({ ...value, showArchived: e })}
                label={messages.archived}
              />
            </Stack>
          </Box>
        </Stack>
        <Stack alignItems="center">
          <Stack alignItems="center">
            <Button leftIcon={<PlusIcon />} onClick={addEventClick}>
              {messages.new}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

KanbanFilters.defaultProps = KANBAN_FILTERS_DEFAULT_PROPS;
KanbanFilters.propTypes = KANBAN_FILTERS_PROP_TYPES;

export { KanbanFilters };
