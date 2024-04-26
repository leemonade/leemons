/* eslint-disable no-nested-ternary */
import { Box, Button, createStyles, Stack, Text } from '@bubbles-ui/components';
import PropTypes from 'prop-types';
import React from 'react';
import Filters from '@scores/components/__DEPRECATED__/ScoresPage/Filters/Filters';
import Assistances from '@attendance-control/components/AssistancePage/Assistances';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@attendance-control/helpers/prefixPN';
import infoPlugin from '@package-manager/request/infoPlugin';
import { getPermissionsWithActionsIfIHaveRequest, getProfileSysNameRequest } from '@users/request';
import { getTemporalSessionsRequest } from '@attendance-control/request';
import { getSessionsBackFromToday } from '@attendance-control/helpers';
import AttendanceControlDrawer from '@attendance-control/components/attendance-control-drawer';

const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[5],
    height: '100%',
  },
  title: {
    paddingLeft: theme.spacing[2],
    paddingRight: theme.spacing[4],
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '28px',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[5],
    paddingBottom: theme.spacing[6],
  },
}));

function ClassTable({ classe }) {
  const { classes } = useStyles();
  const [filters, setFilters] = React.useState({});
  const [hiddeButton, setHiddeButton] = React.useState(true);
  const [opened, setOpened] = React.useState(false);
  const [t] = useTranslateLoader(prefixPN('classTabDetailTable'));

  async function load() {
    try {
      const [{ data }, { permissions }, { sysName }, { sessions }] = await Promise.all([
        infoPlugin('academic-calendar'),
        getPermissionsWithActionsIfIHaveRequest([prefixPN('attendance')]),
        getProfileSysNameRequest(),
        getTemporalSessionsRequest(classe.id),
      ]);

      const backSessions = getSessionsBackFromToday(sessions);
      const userProfile = sysName;
      let canAttendance;

      if (permissions[0]) {
        canAttendance =
          permissions[0].actionNames.includes('create') ||
          permissions[0].actionNames.includes('admin');
      }
      const academicCalendar = data;

      let _hiddeButton = false;
      if (
        !academicCalendar ||
        !canAttendance ||
        userProfile !== 'teacher' ||
        !backSessions?.length
      ) {
        _hiddeButton = true;
      }
      setHiddeButton(_hiddeButton);
    } catch (e) {
      // addErrorAlert(getErrorMessage(e));
    }
  }

  function openAssistanceControl() {
    setOpened(true);
  }

  function closeAssistanceControl() {
    setOpened(false);
  }

  React.useEffect(() => {
    load();
  }, [classe?.id]);

  return (
    <Box className={classes.root}>
      <AttendanceControlDrawer classe={classe} opened={opened} onClose={closeAssistanceControl} />

      <Stack fullWidth alignItems="center" justifyContent="space-between">
        <Box>
          <Text size="lg" color="primary" className={classes.title}>
            {t('title')}
          </Text>
        </Box>
        <Box>
          {hiddeButton ? (
            <Button variant="link" rightIcon={<ChevRightIcon />} onClick={openAssistanceControl}>
              {t('attendanceMonitoring')}
            </Button>
          ) : null}
        </Box>
      </Stack>

      <Box
        sx={(theme) => ({ padding: theme.spacing[6], backgroundColor: 'white', borderRadius: 4 })}
      >
        <Box className={classes.headerContainer}>
          <Filters classID={classe.id} onChange={setFilters} />
        </Box>
        <Assistances filters={filters} />
      </Box>
    </Box>
  );
}

ClassTable.propTypes = {
  classe: PropTypes.object.isRequired,
  key: PropTypes.string.isRequired,
};

export default ClassTable;
