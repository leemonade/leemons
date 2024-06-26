import React, { useMemo, useState } from 'react';
import { omit, noop } from 'lodash';
import { Box, Button, ContextContainer, PaginatedList } from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import { useIsTeacher } from '@academic-portfolio/hooks';
import { listProgramsRequest, listSessionClassesRequest } from '@academic-portfolio/request';
import { getUserPrograms } from '@academic-portfolio/request/programs';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { listProfilesRequest } from '@users/request';
import getUserCenters from '@users/request/getUserCenters';
import { getCentersWithToken, useSession } from '@users/session';
import { listRequest, saveRequest } from '../../request';
import { Filters } from '../Filters';
import { ActionItem } from './components/ActionItem';
import { DateItem } from './components/DateItem';
import { EmptyState } from './components/EmptyState';
import { NameItem } from './components/NameItem';
import { ObjectiveItem } from './components/ObjectiveItem';
import { StatisticsItem } from './components/StatisticsItem';
import { StatusItem } from './components/StatusItem';
import {
  MESSAGES_TABLES_DEFAULT_PROPS,
  MESSAGES_TABLES_PROP_TYPES,
} from './MessagesTable.constants';

const useMessagesColumns = (labels) =>
  useMemo(
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
  onEdit = noop,
  onNew = noop,
  centers,
  setCenters,
  profiles,
  setProfiles = noop,
  onlyArchived,
}) => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [filters, setFilters] = useState(DEFAULT_VALUES);
  const [messages, setMessages] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesData, setMessagesData] = useState([]);
  const [messagesAreSet, setMessagesAreSet] = useState(false);

  const isTeacher = useIsTeacher();

  const { id: ownerId } = useSession();

  const columns = useMessagesColumns(labels?.table);

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

  const getAllClasses = async (programsValue) => {
    try {
      const results = await Promise.all(
        programsValue.map(({ value: id }) => listSessionClassesRequest({ program: id }))
      );
      const allClasses = results.reduce((prev, current) => [...prev, ...current.classes], []);
      if (allClasses.length > 0) {
        setClasses(allClasses.map((klass) => ({ label: klass.subject.name, value: klass.id })));
      }
    } catch (error) {
      addErrorAlert(error);
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
      if (onlyArchived) filters.status = 'archived';
      filters.status = filters.status
        ? filters.status
        : [('published', 'unpublished', 'completed', 'programmed')];
      const {
        data: { items: messagesResult },
      } = await listRequest({ page, size, filters });
      const allPrograms = await getAllPrograms(finalCenters);
      await getAllClasses(allPrograms);
      setProfiles(profilesResult.map((profile) => ({ label: profile.name, value: profile.id })));
      setCenters(finalCenters.map((center) => ({ label: center.name, value: center.id })));
      setPrograms(allPrograms);
      setMessages(messagesResult);
      setMessagesAreSet(true);
    } catch (error) {
      addErrorAlert(error);
      setLoading(false);
    }
  }

  const archiveMessage = async (message) => {
    const isArchiving = message.status !== 'archived';
    const propsToOmit = [
      'isUnpublished',
      'totalClicks',
      'totalViews',
      'owner',
      'userOwner',
      'updated_at',
      'created_at',
      'deleted_at',
      'updatedAt',
      'createdAt',
      'deletedAt',
      'deleted',
    ];

    if (!message.url) propsToOmit.push('url');
    if (!message.textUrl) propsToOmit.push('textUrl');

    const messageToSave = omit(
      { ...message, status: isArchiving ? 'archived' : 'unpublished' },
      propsToOmit
    );

    try {
      await saveRequest(messageToSave);
      addSuccessAlert(isArchiving ? labels.archivedSuccess : labels.unarchivedSuccess);
      init();
    } catch (error) {
      addErrorAlert(error);
    }
  };

  const parseMessagesData = (unparsedMessages) =>
    unparsedMessages.map((message) => {
      const name = (
        <NameItem name={message.internalName} owner={message.owner.user} asset={message.asset} />
      );
      const objective = (
        <ObjectiveItem
          labels={labels}
          messageCenters={message.centers}
          messagePrograms={message.programs}
          messagesProfiles={message.profiles}
          messageClasses={message.classes}
          centers={centers}
          programs={programs}
          profiles={profiles}
          classes={classes}
          isTeacher={isTeacher}
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
      const isOwner = message.userOwner === ownerId;
      const actions = (
        <ActionItem
          labels={labels.actions}
          status={message.status}
          onEdit={onEdit}
          onArchive={archiveMessage}
          message={message}
          isOwner={isOwner}
        />
      );
      return { name, objective, format, publishDate, state, actions, statistics };
    });

  React.useEffect(() => {
    if (isTeacher === null) return;
    init();
  }, [size, page, filters, isTeacher, shouldReload]);

  React.useEffect(() => {
    if (!labels || !centers.length || !profiles.length || !messagesAreSet) return;
    setLoading(true);
    const parsedMessages = parseMessagesData(messages);
    setMessagesData(parsedMessages);
    setLoading(false);
  }, [messages, labels, centers, profiles]);

  const headerStyles = {
    position: 'sticky',
    top: '0px',
    backgroundColor: 'white',
    zIndex: 10,
  };

  return (
    <ContextContainer padded spacing={0}>
      {!onlyArchived && (
        <Box>
          <Button variant="link" leftIcon={<AddCircleIcon />} onClick={onNew}>
            {labels.new}
          </Button>
        </Box>
      )}
      <ContextContainer>
        <Filters
          labels={labels}
          centers={centers}
          profiles={profiles}
          defaultValues={DEFAULT_VALUES}
          filters={filters}
          setFilters={setFilters}
          onlyArchived={onlyArchived}
        />

        {messagesData.length < 1 && !loading ? (
          <EmptyState label={labels.emptyState} />
        ) : (
          <PaginatedList
            hidePaper
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
        )}
      </ContextContainer>
    </ContextContainer>
  );
};

MessagesTable.defaultProps = MESSAGES_TABLES_DEFAULT_PROPS;
MessagesTable.propTypes = MESSAGES_TABLES_PROP_TYPES;

export { MessagesTable };
