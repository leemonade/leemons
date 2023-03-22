/* eslint-disable no-param-reassign */
import getSessionsBackFromToday from '@attendance-control/helpers/getSessionsBackFromToday';
import prefixPN from '@attendance-control/helpers/prefixPN';
import {
  getSessionRequest,
  getTemporalSessionsRequest,
  saveSessionRequest,
} from '@attendance-control/request';
import {
  Box,
  Button,
  ContextContainer,
  createStyles,
  Drawer,
  InputLabel,
  Loader,
  Radio,
  Select,
  Switch,
  UserDisplayItem,
} from '@bubbles-ui/components';
import { CheckCircleIcon, RemoveCircleIcon, TimeClockCircleIcon } from '@bubbles-ui/icons/outline';
import { useLocale, useRequestErrorMessage, useStore } from '@common';
import { addErrorAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = createStyles((theme) => ({
  selectContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[4],
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.ui03,
  },
  headerIcons: {
    paddingTop: 3,
    alignItems: 'center',
    display: 'flex',
    gap: theme.spacing[4],
    paddingRight: theme.spacing[3],
  },
  usersContainer: {
    '>div:nth-child(2n)': {
      backgroundColor: theme.colors.ui03,
    },
  },
  userItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userItemRadios: {
    display: 'flex',
    gap: theme.spacing[2],
    paddingRight: theme.spacing[1],
    '>div': {
      margin: -theme.spacing[3],
    },
  },
  buttonActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    position: 'absolute',
    bottom: 0,
    right: 20,
    left: 0,
    padding: `${theme.spacing[4]}px ${theme.spacing[6]}px`,
    paddingRight: theme.spacing[6] - 20,
    backgroundColor: theme.colors.uiBackground01,
  },
}));

const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const getOnlyHours = (date) => {
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`;
};

export function AttendanceControlDrawer({ opened, onClose, classe }) {
  const [store, render] = useStore({
    loading: true,
    attendance: {},
  });
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const { classes } = useStyles({});
  const locale = useLocale();
  const [t, , , tLoading] = useTranslateLoader(prefixPN('attendanceControlDrawer'));

  async function load() {
    store.loading = true;
    render();
    const [{ sessions }] = await Promise.all([getTemporalSessionsRequest(classe.id)]);

    store.sessions = sessions;
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };

    store.selectSessions = _.map(getSessionsBackFromToday(sessions), (session) => {
      session.start = new Date(session.start);
      session.end = new Date(session.end);
      return {
        label: `${
          session.id ? `${t('sessionN', { index: session.index + 1 })} - ` : ''
        }${session.start.toLocaleDateString(locale, options)} - ${
          datesAreOnSameDay(session.start, session.end)
            ? getOnlyHours(session.end)
            : session.end.toLocaleDateString(locale, options)
        }`,
        value: session.start.toString(),
        session,
      };
    });
    store.loading = false;
    render();
  }

  async function save() {
    try {
      store.saving = true;
      render();
      const { session } = _.find(store.selectSessions, { value: store.selectedSession });
      const body = {
        class: classe.id,
        start: session.start,
        end: session.end,
        attendance: store.attendance,
      };
      if (session.id) body.id = session.id;
      await saveSessionRequest(body);
      await load();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
    store.saving = false;
    render();
  }

  async function loadSession(session) {
    const {
      session: { attendance },
    } = await getSessionRequest(session.id);
    store.attendance = {};
    _.forEach(attendance, (att) => {
      store.attendance[att.student] = att.assistance;
    });
    render();
  }

  React.useEffect(() => {
    if (store.selectedSession) {
      const { session } = _.find(store.selectSessions, { value: store.selectedSession });
      if (session.id) {
        loadSession(session);
      }
    }
  }, [store.selectedSession]);

  React.useEffect(() => {
    if (locale && !tLoading) load();
  }, [locale, tLoading]);

  const allAttend = React.useMemo(() => {
    let count = 0;
    _.forEach(store.attendance, (e) => {
      if (e === 'on-time') count++;
    });
    return count === classe?.students?.length;
  }, [JSON.stringify(store.attendance), classe]);

  return (
    <Drawer size={430} opened={opened} onClose={onClose}>
      {store.loading ? (
        <Loader />
      ) : (
        <ContextContainer sx={(theme) => ({ marginBottom: theme.spacing[10] })} title={t('title')}>
          <Box class={classes.selectContainer}>
            <InputLabel label={t('session')} />
            <Select
              style={{ width: '100%' }}
              placeholder={t('selectSession')}
              data={store.selectSessions}
              value={store.selectedSession}
              onChange={(e) => {
                store.selectedSession = e;
                render();
              }}
            />
          </Box>
          <Box>
            <Box class={classes.header}>
              <Switch
                checked={allAttend}
                label={t('allAttend')}
                onChange={(e) => {
                  _.forEach(classe?.students, (student) => {
                    store.attendance[student.id] = e ? 'on-time' : null;
                  });
                  render();
                }}
              />

              <Box class={classes.headerIcons}>
                <Box sx={(theme) => ({ color: theme.colors.fatic02 })}>
                  <CheckCircleIcon />
                </Box>
                <Box sx={(theme) => ({ color: theme.colors.fatic01 })}>
                  <RemoveCircleIcon />
                </Box>
                <Box sx={(theme) => ({ color: theme.colors.fatic03 })}>
                  <TimeClockCircleIcon />
                </Box>
              </Box>
            </Box>
            <Box class={classes.usersContainer}>
              {classe?.students.map((student) => (
                <Box class={classes.userItem} key={student.id}>
                  <UserDisplayItem {...student.user} variant="inline" noBreak={true} />
                  <Box class={classes.userItemRadios}>
                    <Radio
                      checked={store.attendance[student.id] === 'on-time'}
                      onChange={(e) => {
                        if (e) store.attendance[student.id] = 'on-time';
                        render();
                      }}
                    />
                    <Radio
                      checked={store.attendance[student.id] === 'not'}
                      onChange={(e) => {
                        if (e) store.attendance[student.id] = 'not';
                        render();
                      }}
                    />
                    <Radio
                      checked={store.attendance[student.id] === 'late'}
                      onChange={(e) => {
                        if (e) store.attendance[student.id] = 'late';
                        render();
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </ContextContainer>
      )}
      {!store.loading ? (
        <Box class={classes.buttonActions}>
          <Button disabled={!store.selectedSession} loading={store.saving} onClick={save}>
            {t('save')}
          </Button>
        </Box>
      ) : null}
    </Drawer>
  );
}

AttendanceControlDrawer.propTypes = {
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  classe: PropTypes.object,
};

export default AttendanceControlDrawer;
