import React, { useState, useMemo } from 'react';
import { Box, PaginatedList } from '@bubbles-ui/components';
import { useIsTeacher } from '@academic-portfolio/hooks';
import { addErrorAlert } from '@layout/alert';
import { listRequest } from '@board-messages/request';
import getUserCenters from '@users/request/getUserCenters';
import { listProgramsRequest } from '@academic-portfolio/request';
import { listProfilesRequest } from '@users/request';
import { capitalize } from 'lodash';
import { getUserPrograms } from '@academic-portfolio/request/programs';
import {
  MESSAGES_TABLES_PROP_TYPES,
  MESSAGES_TABLES_DEFAULT_PROPS,
} from './MessagesTable.constants';
import { MessagesTableStyles } from './MessagesTable.styles';
import { Filters } from '../Filters';
import { DateItem } from './components/DateItem';
import { StatusItem } from './components/StatusItem';
import { ActionItem } from './components/ActionItem';
import { NameItem } from './components/NameItem';
import { ObjectiveItem } from './components/ObjectiveItem';

const useMessagesColumns = (labels) => {
  const isTeacher = useIsTeacher();
  let messagesColumns = useMemo(
    () => [
      {
        Header: labels?.name || '',
        accessor: 'name',
      },
      {
        Header: labels?.objective || '',
        accessor: 'objective',
      },
      {
        Header: labels?.format || '',
        accessor: 'format',
      },
      {
        Header: labels?.publishDate || '',
        accessor: 'publishDate',
      },
      {
        Header: labels?.state || '',
        accessor: 'state',
      },
      {
        Header: labels?.statistics || '',
        accessor: 'statistics',
      },
      {
        Header: labels?.actions || '',
        accessor: 'actions',
      },
    ],
    [labels]
  );
  if (isTeacher) {
    messagesColumns = messagesColumns.filter((column) => column.accessor !== 'statistics');
  }
  return messagesColumns;
};

const DEFAULT_VALUES = {
  internalName: '',
  centers: null,
  programs: [],
  profiles: [],
  zone: '',
  status: '',
};

const MessagesTable = ({
  labels,
  shouldReload,
  openEditDrawer,
  centers,
  setCenters,
  profiles,
  setProfiles,
}) => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [filters, setFilters] = useState(DEFAULT_VALUES);
  const [messages, setMessages] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesData, setMessagesData] = useState([]);

  const columns = useMessagesColumns(labels?.table);

  const getObjectiveString = (value, type) => {
    const arrays = {
      centers,
      profiles,
      programs,
    };

    if (value[0] === '*') return labels.objectives[`all${capitalize(type)}`];
    const string = arrays[type]
      .reduce((prev, current) => {
        if (value.includes(current.value)) return [...prev, current.label];
        return prev;
      }, [])
      .join(', ');
    return string;
  };

  const getObjective = (messageCenters, messagePrograms, messagesProfiles) => {
    const centersString = getObjectiveString(messageCenters, 'centers');
    const programsString = getObjectiveString(messagePrograms, 'programs');
    const profilesString = getObjectiveString(messagesProfiles, 'profiles');

    const objective = (
      <ObjectiveItem objective={`${centersString} - ${programsString} - ${profilesString}`} />
    );
    return objective;
  };

  const parseMessagesData = (unparsedMessages) => {
    const parsedMessages = unparsedMessages.map((message) => {
      const name = <NameItem name={message.internalName} asset={message.asset} />;
      const objective = getObjective(message.centers, message.programs, message.profiles);
      const format = message.zone === 'modal' ? labels.formats.modal : labels.formats.banner;
      const publishDate = <DateItem startDate={message.startDate} endDate={message.endDate} />;
      const state = <StatusItem status={message.status} labels={labels.statuses} />;
      // const statistics = '';
      const actions = (
        <ActionItem labels={labels.actions} onEdit={openEditDrawer} message={message} />
      );
      return { name, objective, format, publishDate, state, actions };
    });
    return parsedMessages;
  };

  const getAllPrograms = async (centersResult) => {
    try {
      const results = await Promise.all(
        centersResult.map((center) =>
          listProgramsRequest({ page: 0, size: 9999, center: center.id })
        )
      );
      // console.log(await getUserPrograms());
      const allPrograms = results.reduce((prev, current) => [...prev, ...current.data.items], []);
      if (allPrograms.length > 0) {
        return allPrograms.map((program) => ({ label: program.name, value: program.id }));
      }
      return [];
    } catch (error) {
      addErrorAlert(error);
      return [];
    }
  };

  async function init() {
    try {
      setLoading(true);
      const { centers: centersResult } = await getUserCenters();
      const {
        data: { items: profilesResult },
      } = await listProfilesRequest({
        page: 0,
        size: 9999,
      });
      const {
        data: { items: messagesResult },
      } = await listRequest({ page, size, filters });
      const allPrograms = await getAllPrograms(centersResult);
      setProfiles(profilesResult.map((profile) => ({ label: profile.name, value: profile.id })));
      setCenters(centersResult.map((center) => ({ label: center.name, value: center.id })));
      setPrograms(allPrograms);
      setMessages(messagesResult);
    } catch (error) {
      addErrorAlert(error);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    init();
  }, [size, page, filters, shouldReload]);

  React.useEffect(() => {
    if (!labels) return;
    const parsedMessages = parseMessagesData(messages);
    setMessagesData(parsedMessages);
  }, [messages, labels, centers, profiles]);

  const headerStyles = {
    position: 'sticky',
    top: '0px',
    backgroundColor: 'white',
    zIndex: 10,
  };

  const { classes } = MessagesTableStyles({}, { name: 'MessagesTable' });
  return (
    <Box className={classes.root}>
      <Filters
        labels={labels}
        centers={centers}
        profiles={profiles}
        defaultValues={DEFAULT_VALUES}
        filters={filters}
        setFilters={setFilters}
      />
      <PaginatedList
        columns={columns}
        items={messagesData}
        loading={loading}
        page={page}
        size={size}
        onPageChange={setPage}
        onSizeChange={setSize}
        headerStyles={headerStyles}
        selectable={false}
      />
    </Box>
  );
};

MessagesTable.defaultProps = MESSAGES_TABLES_DEFAULT_PROPS;
MessagesTable.propTypes = MESSAGES_TABLES_PROP_TYPES;

// eslint-disable-next-line import/prefer-default-export
export { MessagesTable };
