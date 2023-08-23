/* eslint-disable no-param-reassign */
import { classDetailForDashboardRequest } from '@academic-portfolio/request';
import { getSessionDateString } from '@attendance-control/helpers/getSessionDateString';
import { getSessionsBackFromToday } from '@attendance-control/helpers/getSessionsBackFromToday';
import { prefixPN } from '@attendance-control/helpers/prefixPN';
import {
  getSessionRequest,
  getTemporalSessionsRequest,
  saveSessionRequest,
} from '@attendance-control/request';
import {
  ActionButton,
  Box,
  Button,
  ContextContainer,
  Drawer,
  InputLabel,
  Loader,
  Popover,
  Radio,
  Select,
  Switch,
  Textarea,
  Title,
  UserDisplayItem,
  createStyles,
} from '@bubbles-ui/components';

import { CheckCircleIcon, RemoveCircleIcon, TimeClockCircleIcon } from '@bubbles-ui/icons/outline';
import { CommentIcon, EditWriteIcon } from '@bubbles-ui/icons/solid';
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
    gap: theme.spacing[4] + 1,
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
    alignItems: 'center',
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

export function AttendanceControlDrawer({
  opened,
  onClose,
  onSave = () => {},
  classe,
  session: _session,
}) {
  const [store, render] = useStore({
    loading: true,
    attendance: {},
    comments: {},
  });
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const { classes } = useStyles({});
  const locale = useLocale();
  const [t, , , tLoading] = useTranslateLoader(prefixPN('attendanceControlDrawer'));

  async function loadSession(session) {
    store.attendance = {};
    store.comments = {};
    if (session?.id) {
      const {
        session: { attendance },
      } = await getSessionRequest(session.id);
      _.forEach(attendance, (att) => {
        store.attendance[att.student] = att.assistance;
        store.comments[att.student] = att.comment;
      });
    }
    render();
  }

  async function load() {
    store.loading = true;
    render();

    store.classe = classe;

    const promises = [getTemporalSessionsRequest(classe.id)];
    if (!classe.students || _.isString(classe.students[0]))
      promises.push(classDetailForDashboardRequest(classe.id));

    const [{ sessions }, data] = await Promise.all(promises);

    if (data?.classe) store.classe = data.classe;

    store.sessions = sessions;

    store.selectSessions = _.map(getSessionsBackFromToday(sessions), (session) => {
      session.start = new Date(session.start);
      session.end = new Date(session.end);
      return {
        label: `${
          session.index >= 0 ? `${t('sessionN', { index: session.index + 1 })} - ` : ''
        }${getSessionDateString(session, locale)}`,
        value: session.start.toString(),
        session,
      };
    });
    if (_session) loadSession(_session);
    store.loading = false;
    render();
  }

  async function save() {
    try {
      store.saving = true;
      render();
      let ses = _session;
      if (!ses) {
        const { session } = _.find(store.selectSessions, { value: store.selectedSession });
        ses = session;
      }
      const body = {
        class: classe.id,
        start: ses.start,
        end: ses.end,
        attendance: store.attendance,
        comments: store.comments,
      };
      if (ses.id) body.id = ses.id;
      await saveSessionRequest(body);
      await onSave();
      await load();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
    store.saving = false;
    render();
  }

  React.useEffect(() => {
    if (store.selectedSession) {
      const { session } = _.find(store.selectSessions, { value: store.selectedSession });
      if (session.id) {
        loadSession(session);
      } else {
        store.attendance = {};
        store.comments = {};
        render();
      }
    }
  }, [store.selectedSession]);

  React.useEffect(() => {
    if (locale && !tLoading) load();
  }, [locale, tLoading, classe, _session]);

  const allAttend = React.useMemo(() => {
    let count = 0;
    _.forEach(store.attendance, (e) => {
      if (e === 'on-time') count++;
    });
    return count === store.classe?.students?.length;
  }, [JSON.stringify(store.attendance), store.classe]);

  return (
    <Drawer size={430} opened={opened} onClose={onClose}>
      {store.loading ? (
        <Loader />
      ) : (
        <ContextContainer sx={(theme) => ({ marginBottom: theme.spacing[10] })} title={t('title')}>
          {_session ? (
            <Title order={5}>{t('sessionN', { index: _session.index + 1 })}</Title>
          ) : (
            <Box className={classes.selectContainer}>
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
          )}

          <Box>
            <Box className={classes.header}>
              <Switch
                checked={allAttend}
                label={t('allAttend')}
                onChange={(e) => {
                  _.forEach(store.classe?.students, (student) => {
                    store.attendance[student.id] = e ? 'on-time' : null;
                  });
                  render();
                }}
              />

              <Box className={classes.headerIcons}>
                <Box sx={(theme) => ({ color: theme.colors.fatic02 })}>
                  <CheckCircleIcon />
                </Box>
                <Box sx={(theme) => ({ color: theme.colors.fatic01 })}>
                  <RemoveCircleIcon />
                </Box>
                <Box sx={(theme) => ({ color: theme.colors.fatic03 })}>
                  <TimeClockCircleIcon />
                </Box>
                <Box sx={(theme) => ({ color: theme.colors.text06 })}>
                  <CommentIcon />
                </Box>
              </Box>
            </Box>
            <Box className={classes.usersContainer}>
              {store.classe?.students.map((student) => (
                <Box className={classes.userItem} key={student.id}>
                  <UserDisplayItem {...student.user} variant="inline" noBreak={true} />
                  <Box className={classes.userItemRadios}>
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
                    <Popover
                      target={
                        <Box
                          sx={(theme) => ({
                            paddingLeft: theme.spacing[2],
                            paddingRight: theme.spacing[2],
                          })}
                        >
                          <ActionButton
                            icon={<EditWriteIcon />}
                            onClick={() => {
                              store.openedIndex = '';
                              render();
                            }}
                          />
                        </Box>
                      }
                    >
                      <Box style={{ padding: 8 }}>
                        <Textarea
                          value={store.comments[student.id]}
                          label={t('comment')}
                          onChange={(e) => {
                            store.comments[student.id] = e;
                            render();
                          }}
                        />
                      </Box>
                    </Popover>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </ContextContainer>
      )}
      {!store.loading ? (
        <Box className={classes.buttonActions}>
          <Button
            disabled={!store.selectedSession && !_session}
            loading={store.saving}
            onClick={save}
          >
            {t('save')}
          </Button>
        </Box>
      ) : null}
    </Drawer>
  );
}

AttendanceControlDrawer.propTypes = {
  opened: PropTypes.bool,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
  classe: PropTypes.object,
  session: PropTypes.object,
};

export default AttendanceControlDrawer;
