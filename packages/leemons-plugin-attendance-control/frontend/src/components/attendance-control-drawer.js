import getSessionsBackFromToday from '@attendance-control/helpers/getSessionsBackFromToday';
import prefixPN from '@attendance-control/helpers/prefixPN';
import { getTemporalSessionsRequest } from '@attendance-control/request';
import {
  Box,
  ContextContainer,
  createStyles,
  Drawer,
  InputLabel,
  Loader,
  Select,
} from '@bubbles-ui/components';
import { useLocale, useStore } from '@common';
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
    backgroundColor: '#F7F8FA',
    height: '50px',
  },
}));

export function AttendanceControlDrawer({ opened, onClose, classe }) {
  const [store, render] = useStore({
    loading: true,
  });
  const { classes } = useStyles({});
  const locale = useLocale();
  const [t, , , tLoading] = useTranslateLoader(prefixPN('attendanceControlDrawer'));

  async function load() {
    store.loading = true;
    render();
    const [{ sessions }] = await Promise.all([getTemporalSessionsRequest(classe.id)]);
    store.sessions = sessions;
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    store.selectSessions = _.map(getSessionsBackFromToday(sessions), (session) => ({
      label: `${session.start.toLocaleDateString(
        locale,
        options
      )} - ${session.end.toLocaleDateString(locale, options)}`,
      value: session.start,
    }));
    store.loading = false;
    render();
  }

  React.useEffect(() => {
    if (locale) load();
  }, [locale]);

  return (
    <Drawer size={430} opened={opened} onClose={onClose}>
      {store.loading ? (
        <Loader />
      ) : (
        <ContextContainer title={t('title')}>
          <Box class={classes.selectContainer}>
            <InputLabel label={t('session')} />
            <Select
              style={{ width: '100%' }}
              placeholder={t('selectSession')}
              data={store.selectSessions}
            />
          </Box>
          <Box class={classes.header}>a</Box>
        </ContextContainer>
      )}
    </Drawer>
  );
  /**
   * {classe?.students.map((student) => (
        <UserDisplayItem
          style={{ cursor: 'pointer' }}
          onClick={() => openStudent(student)}
          key={student.id}
          {...student.user}
          variant="inline"
          noBreak={true}
        />
      ))}
   */
}

AttendanceControlDrawer.propTypes = {
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  classe: PropTypes.object,
};

export default AttendanceControlDrawer;
