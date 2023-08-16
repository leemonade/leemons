/* eslint-disable no-param-reassign */
import { prefixPN } from '@attendance-control/helpers';
import { getSessionDateString } from '@attendance-control/helpers/getSessionDateString';
import { getSessionsAssistenceAverageOfUserAgents } from '@attendance-control/helpers/getSessionsAssistenceAverageOfUserAgents';
import { getUserAgentIdsFromSessions } from '@attendance-control/helpers/getUserAgentIdsFromSessions';
import {
  Box,
  Table as BubblesTable,
  InputLabel,
  Progress,
  Text,
  TextInput,
  Tooltip,
  UserDisplayItem,
  createStyles,
} from '@bubbles-ui/components';
import { CheckCircleIcon, RemoveCircleIcon, TimeClockCircleIcon } from '@bubbles-ui/icons/outline';
import { CommentIcon, EditWriteIcon } from '@bubbles-ui/icons/solid';
import getUserFullName from '@users/helpers/getUserFullName';
import { addAction, fireEvent, removeAction } from 'leemons-hooks';

import { generateAssistancesWB } from '@attendance-control/components/ExcelExport/assistencesWB';
import { getFile } from '@attendance-control/components/ExcelExport/helpers/workbook/getFile';
import { CommonTableStyles } from '@bubbles-ui/leemons';
import { useLocale, useStore } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getUserAgentsInfoRequest } from '@users/request';
import _ from 'lodash';
import React from 'react';
import AttendanceControlDrawer from '../../attendance-control-drawer';

const useTableStyles = createStyles((theme) => ({
  root: {
    width: '100%',
    boxSizing: 'border-box',
    transition: 'width 0.3s ease-in-out',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  tabHeader: {
    flex: 1,
  },
}));

export default function Table({ sessions, classe, onSave }) {
  const [store, render] = useStore();
  const locale = useLocale();
  const [t, , , tLoading] = useTranslateLoader(prefixPN('attendanceControlTable'));

  const { classes } = CommonTableStyles({ overFlowRight: true }, { name: 'CommonTable' });

  async function filter() {
    store.filteredData = _.cloneDeep(store.data);
    if (store.search) {
      store.filteredData = _.filter(store.filteredData, ({ student }) =>
        getUserFullName(student).toLowerCase().includes(store.search.toLowerCase())
      );
    }
    render();
  }

  async function onSearch(search) {
    store.search = search;
    filter();
  }

  function editSession(session) {
    store.editSession = session;
    render();
  }

  function closeEditSession() {
    store.editSession = null;
    render();
  }

  async function onDrawerSave() {
    await onSave();
    closeEditSession();
  }

  async function load() {
    const userAgentIds = getUserAgentIdsFromSessions(sessions);
    if (!_.isEqual(store.userAgentIds, userAgentIds)) {
      store.userAgentIds = userAgentIds;
      const { userAgents } = await getUserAgentsInfoRequest(store.userAgentIds);
      store.userAgents = userAgents;
    }
    store.userAgentAverage = getSessionsAssistenceAverageOfUserAgents(sessions, userAgentIds);
    store.columns = [];
    store.columns.push({
      accessor: 'student',
      width: 220,
      sticky: 'left',
      style: {
        backgroundColor: 'white',
      },
      cellStyle: {
        backgroundColor: 'white',
      },
      Header: (
        <Box className={classes.students}>
          <Box>
            <Text color="primary" role="productive" size="xs" stronger>
              {t('students')}
            </Text>
            <Box>
              <Text
                sx={() => ({ whiteSpace: 'nowrap' })}
                color="secondary"
                role="productive"
                size="xs"
              >
                {store.userAgentIds.length} {t('students').toLowerCase()}
              </Text>
            </Box>
          </Box>
        </Box>
      ),
      Cell: ({ value }) => (
        <Box sx={() => ({ width: 220, border: 'none' })} className={classes.studentsCells}>
          <UserDisplayItem {...value} noBreak />
        </Box>
      ),
    });

    _.forEach(sessions, (session) => {
      store.columns.push({
        accessor: new Date(session.start).getTime().toString(),
        Header: (
          <Box className={classes.students}>
            <Box>
              <Box
                sx={(theme) => ({
                  display: 'flex',
                  gap: theme.spacing[3],
                  alignItems: 'center',
                })}
              >
                {session.index >= 0 ? (
                  <Box style={{ whiteSpace: 'nowrap' }}>
                    <Text color="primary" role="productive" size="xs" stronger>
                      {t('sessionN', { index: session.index + 1 })}
                    </Text>
                  </Box>
                ) : null}
                <Box
                  onClick={() => editSession(session)}
                  sx={(theme) => ({ cursor: 'pointer', color: theme.colors.text06 })}
                >
                  <EditWriteIcon />
                </Box>
              </Box>

              <Box>
                <Text
                  sx={() => ({ whiteSpace: 'nowrap' })}
                  color="secondary"
                  role="productive"
                  size="xs"
                >
                  {getSessionDateString(session, locale, { onlyDate: true })}
                </Text>
              </Box>
              <Box>
                <Text
                  sx={() => ({ whiteSpace: 'nowrap' })}
                  color="secondary"
                  role="productive"
                  size="xs"
                >
                  {getSessionDateString(session, locale, { onlyHours: true })}
                </Text>
              </Box>
            </Box>
          </Box>
        ),
        Cell: ({ value }) => (
          <Box
            sx={(theme) => ({
              display: 'flex',
              gap: theme.spacing[2],
              fontSize: 18,
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
            })}
          >
            {value.assistance === 'on-time' ? (
              <Box sx={(theme) => ({ color: theme.colors.fatic02 })}>
                <CheckCircleIcon />
              </Box>
            ) : null}
            {value.assistance === 'not' ? (
              <Box sx={(theme) => ({ color: theme.colors.fatic01 })}>
                <RemoveCircleIcon />
              </Box>
            ) : null}
            {value.assistance === 'late' ? (
              <Box sx={(theme) => ({ color: theme.colors.fatic03 })}>
                <TimeClockCircleIcon />
              </Box>
            ) : null}
            {_.isNil(value.assistance) ? (
              <Box sx={(theme) => ({ color: theme.colors.text06 })}>-</Box>
            ) : null}
            {!_.isNil(value.comment) ? (
              <Tooltip label={value.comment}>
                <Box sx={(theme) => ({ color: theme.colors.text06 })}>
                  <CommentIcon />
                </Box>
              </Tooltip>
            ) : null}
          </Box>
        ),
      });
    });
    store.columns.push({
      accessor: 'avg',
      width: 220,
      sticky: 'right',
      style: {
        backgroundColor: 'white',
        boxShadow: '-6px 0px 6px 0px rgba(0,0,0,0.10)',
      },
      tdStyle: {
        boxShadow: '-8px 0px 8px 0px rgba(0,0,0,0.10)',
      },
      cellStyle: {
        backgroundColor: 'white',
      },
      Header: (
        <Box className={classes.students}>
          <Box sx={() => ({ whiteSpace: 'nowrap' })}>
            <Text color="primary" role="productive" size="xs" stronger>
              {t('studentAvg')}
            </Text>
            <Box>
              <Text
                sx={() => ({ whiteSpace: 'nowrap' })}
                color="secondary"
                role="productive"
                size="xs"
              >
                {getSessionDateString({
                  start: new Date(sessions[0].start),
                  end: new Date(sessions[sessions.length - 1].end),
                })}
              </Text>
            </Box>
          </Box>
        </Box>
      ),
      Cell: ({ value }) => (
        <Box
          sx={() => ({
            width: '100%',
            border: 'none',
            textAlign: 'right',
          })}
          className={classes.studentsCells}
        >
          <Text color="secondary" role="productive" size="xs">
            {value.avg}%
          </Text>
          <Progress value={value.avg} />
        </Box>
      ),
    });
    store.data = [];
    const _sessions = _.cloneDeep(sessions);
    _.forEach(_sessions, (session) => {
      if (session.attendance) {
        session.attendanceByStudent = _.keyBy(session.attendance, 'student');
      }
    });
    _.forEach(store.userAgents, (userAgent) => {
      const data = {
        student: userAgent.user,
        avg: store.userAgentAverage[userAgent.id],
      };
      _.forEach(_sessions, (session) => {
        data[new Date(session.start).getTime().toString()] = {
          assistance: null,
          comment: null,
        };
        if (session.attendanceByStudent?.[userAgent.id]) {
          data[new Date(session.start).getTime().toString()] = {
            assistance: session.attendanceByStudent[userAgent.id].assistance,
            comment: session.attendanceByStudent[userAgent.id].comment,
          };
        }
      });
      store.data.push(data);
    });
    filter();
    render();
  }

  React.useEffect(() => {
    if (!tLoading) load();
  }, [sessions, tLoading]);

  React.useEffect(() => {
    const onDownload = ({ args: [format] }) => {
      fireEvent('plugins.scores::downloaded-intercepted');

      try {
        const wb = generateAssistancesWB({
          headerShown: format === 'xlsx',
          data: _.map(store.data, (item) => {
            const result = {};
            _.forIn(item, (value, key) => {
              result[key] = {
                ...value,
                assistance: t(value.assistance),
              };
            });
            return result;
          }),
          sessions,
          labels: {
            students: t('students'),
            session: t('sessionN'),
            studentAvg: t('studentAvg'),
          },
        });
        getFile(wb, format);
        fireEvent('plugins.scores::downloaded');
      } catch (e) {
        fireEvent('plugins.scores::download-scores-error', e);
      }
    };

    addAction('plugins.scores::download-scores', onDownload);
    return () => removeAction('plugins.scores::download-scores', onDownload);
  }, [sessions, store.data, tLoading]);

  return (
    <>
      <Box
        sx={(theme) => ({
          display: 'flex',
          gap: theme.spacing[4],
          padding: theme.spacing[4],
          alignItems: 'center',
        })}
      >
        <InputLabel label={t('search')} />
        <TextInput value={store.search} onChange={onSearch} />
      </Box>
      <BubblesTable
        useSticky
        styleTable={{ display: 'table-caption', overflowX: 'auto' }}
        columns={store.columns}
        data={store.filteredData}
      />
      <AttendanceControlDrawer
        opened={!!store.editSession}
        onClose={closeEditSession}
        classe={classe}
        session={store.editSession}
        onSave={onDrawerSave}
      />
    </>
  );
}
