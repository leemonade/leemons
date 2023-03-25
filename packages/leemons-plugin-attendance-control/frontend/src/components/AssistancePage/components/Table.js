/* eslint-disable no-param-reassign */
import { prefixPN } from '@attendance-control/helpers';
import { getSessionDateString } from '@attendance-control/helpers/getSessionDateString';
import { getSessionsAssistenceAverageOfUserAgents } from '@attendance-control/helpers/getSessionsAssistenceAverageOfUserAgents';
import { getUserAgentIdsFromSessions } from '@attendance-control/helpers/getUserAgentIdsFromSessions';
import {
  Box,
  createStyles,
  Progress,
  Table as BubblesTable,
  Text,
  UserDisplayItem,
} from '@bubbles-ui/components';
import { CheckCircleIcon, RemoveCircleIcon, TimeClockCircleIcon } from '@bubbles-ui/icons/outline';
import { addAction, fireEvent, removeAction } from 'leemons-hooks';

import { generateAssistancesWB } from '@attendance-control/components/ExcelExport/assistencesWB';
import { getFile } from '@attendance-control/components/ExcelExport/helpers/workbook/getFile';
import { CommonTableStyles } from '@bubbles-ui/leemons';
import { useLocale, useStore } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getUserAgentsInfoRequest } from '@users/request';
import _ from 'lodash';
import React from 'react';

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

export default function Table({ sessions, filters }) {
  const [store, render] = useStore();
  const locale = useLocale();
  const [t, , , tLoading] = useTranslateLoader(prefixPN('attendanceControlTable'));

  const { classes } = CommonTableStyles({ overFlowRight: true }, { name: 'CommonTable' });

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
              {session.index >= 0 ? (
                <Text color="primary" role="productive" size="xs" stronger>
                  {t('sessionN', { index: session.index + 1 })}
                </Text>
              ) : null}

              <Box>
                <Text
                  sx={() => ({ whiteSpace: 'nowrap' })}
                  color="secondary"
                  role="productive"
                  size="xs"
                >
                  {getSessionDateString(session, locale)}
                </Text>
              </Box>
            </Box>
          </Box>
        ),
        Cell: ({ value }) => (
          <Box sx={() => ({ fontSize: 18, textAlign: 'center', width: '100%' })}>
            {value === 'on-time' ? (
              <Box sx={(theme) => ({ color: theme.colors.fatic02 })}>
                <CheckCircleIcon />
              </Box>
            ) : null}
            {value === 'not' ? (
              <Box sx={(theme) => ({ color: theme.colors.fatic01 })}>
                <RemoveCircleIcon />
              </Box>
            ) : null}
            {value === 'late' ? (
              <Box sx={(theme) => ({ color: theme.colors.fatic03 })}>
                <TimeClockCircleIcon />
              </Box>
            ) : null}
            {_.isNil(value) ? <Box sx={(theme) => ({ color: theme.colors.text06 })}>-</Box> : null}
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
          sx={() => ({ width: '100%', border: 'none', textAlign: 'right' })}
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
        data[new Date(session.start).getTime().toString()] = null;
        if (session.attendanceByStudent?.[userAgent.id]) {
          data[new Date(session.start).getTime().toString()] =
            session.attendanceByStudent[userAgent.id].assistance;
        }
      });
      store.data.push(data);
    });
    render();
  }

  React.useEffect(() => {
    if (!tLoading) load();
  }, [sessions, filters, tLoading]);

  React.useEffect(() => {
    const onDownload = ({ args: [format] }) => {
      fireEvent('plugins.scores::downloaded-intercepted');

      try {
        const wb = generateAssistancesWB({
          headerShown: format === 'xlsx',
          data: store.data,
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
        console.log(e);
        fireEvent('plugins.scores::download-scores-error', e);
      }
    };

    addAction('plugins.scores::download-scores', onDownload);
    return () => removeAction('plugins.scores::download-scores', onDownload);
  }, [sessions, store.data]);

  return (
    <BubblesTable
      useSticky
      styleTable={{ display: 'table-caption', overflowX: 'auto' }}
      columns={store.columns}
      data={store.data}
    />
  );
}
