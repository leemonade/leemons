import { useIsTeacher } from '@academic-portfolio/hooks';
import { listProgramsRequest } from '@academic-portfolio/request';
import { getUserPrograms } from '@academic-portfolio/request/programs';
import { listRequest } from '@board-messages/request';
import { Box, PaginatedList } from '@bubbles-ui/components';
import { addErrorAlert } from '@layout/alert';
import { listProfilesRequest } from '@users/request';
import getUserCenters from '@users/request/getUserCenters';
import { getCentersWithToken } from '@users/session';
import React, { useMemo, useState } from 'react';
import { Filters } from '../Filters';
import { ActionItem } from './components/ActionItem';
import { DateItem } from './components/DateItem';
import { NameItem } from './components/NameItem';
import { ObjectiveItem } from './components/ObjectiveItem';
import { StatisticsItem } from './components/StatisticsItem';
import { StatusItem } from './components/StatusItem';
import {
  MESSAGES_TABLES_DEFAULT_PROPS,
  MESSAGES_TABLES_PROP_TYPES,
} from './MessagesTable.constants';
import { MessagesTableStyles } from './MessagesTable.styles';

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

  const isTeacher = useIsTeacher();

  const columns = useMessagesColumns(labels?.table);

  const parseMessagesData = (unparsedMessages) => {
    const parsedMessages = unparsedMessages.map((message) => {
      const name = (
        <NameItem name={message.internalName} owner={message.owner.user} asset={message.asset} />
      );
      const objective = (
        <ObjectiveItem
          labels={labels}
          messageCenters={message.centers}
          messagePrograms={message.programs}
          messagesProfiles={message.profiles}
          centers={centers}
          programs={programs}
          profiles={profiles}
        />
      );
      const format = message.zone === 'modal' ? labels.formats.modal : labels.formats.banner;
      const publishDate = <DateItem startDate={message.startDate} endDate={message.endDate} />;
      const state = <StatusItem status={message.status} labels={labels.statuses} />;
      const statistics = (
        <StatisticsItem
          labels={labels.statistics}
          totalClicks={message.totalClicks}
          totalViews={message.totalViews}
          status={message.status}
        />
      );
      const actions = (
        <ActionItem labels={labels.actions} onEdit={openEditDrawer} message={message} />
      );
      return { name, objective, format, publishDate, state, actions, statistics };
    });
    return parsedMessages;
  };

  const getAllPrograms = async (centersResult) => {
    try {
      let allPrograms = [];
      if (isTeacher) {
        const { programs: results } = await getUserPrograms();
        allPrograms = results;
      } else {
        allPrograms = (
          await Promise.all(
            centersResult.map((center) =>
              listProgramsRequest({ page: 0, size: 9999, center: center.id })
            )
          )
        ).reduce((prev, current) => [...prev, ...current.data.items], []);
      }
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
      let finalCenters = [];
      if (isTeacher) {
        finalCenters = [await getCentersWithToken()[0]];
      } else {
        const { centers: centersResult } = await getUserCenters();
        finalCenters = centersResult;
      }
      const {
        data: { items: profilesResult },
      } = await listProfilesRequest({
        page: 0,
        size: 9999,
      });
      if (!filters.zone && isTeacher) filters.zone = 'class-dashboard';
      const {
        data: { items: messagesResult },
      } = await listRequest({ page, size, filters });
      const allPrograms = await getAllPrograms(finalCenters);
      setProfiles(profilesResult.map((profile) => ({ label: profile.name, value: profile.id })));
      setCenters(finalCenters.map((center) => ({ label: center.name, value: center.id })));
      setPrograms(allPrograms);
      setMessages(messagesResult);
    } catch (error) {
      addErrorAlert(error);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (isTeacher === null) return;
    init();
  }, [size, page, filters, isTeacher, shouldReload]);

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
