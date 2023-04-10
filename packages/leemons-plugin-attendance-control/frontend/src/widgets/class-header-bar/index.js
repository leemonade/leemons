/* eslint-disable no-nested-ternary */
import AttendanceControlDrawer from '@attendance-control/components/attendance-control-drawer';
import { getSessionsBackFromToday } from '@attendance-control/helpers/getSessionsBackFromToday';
import { prefixPN } from '@attendance-control/helpers/prefixPN';
import { getTemporalSessionsRequest } from '@attendance-control/request';
import { Button } from '@bubbles-ui/components';
import { useRequestErrorMessage, useStore } from '@common';
import { getLocalizations } from '@multilanguage/useTranslate';
import infoPlugin from '@package-manager/request/infoPlugin';
import { getPermissionsWithActionsIfIHaveRequest, getProfileSysNameRequest } from '@users/request';
import PropTypes from 'prop-types';
import React from 'react';

let academicCalendar;
let canAttendance;
let userProfile;
let text;
let backSessions;

function ClassHeaderBar({ classe }) {
  const [store, render] = useStore();
  const [, , , getErrorMessage] = useRequestErrorMessage();
  async function load() {
    try {
      if (academicCalendar === undefined) {
        const [{ data }, { permissions }, { sysName }, { items }, { sessions }] = await Promise.all(
          [
            infoPlugin('academic-calendar'),
            getPermissionsWithActionsIfIHaveRequest([prefixPN('attendance')]),
            getProfileSysNameRequest(),
            getLocalizations({ keysStartsWith: prefixPN('classButton') }),
            getTemporalSessionsRequest(classe.id),
          ]
        );

        backSessions = getSessionsBackFromToday(sessions);
        userProfile = sysName;
        text = items[prefixPN('classButton.attendanceMonitoring')];

        if (permissions[0]) {
          canAttendance =
            permissions[0].actionNames.includes('create') ||
            permissions[0].actionNames.includes('admin');
          render();
        }
        academicCalendar = data;
        render();
      }
    } catch (e) {
      // addErrorAlert(getErrorMessage(e));
    }
  }

  function openAssistanceControl() {
    store.opened = true;
    render();
  }

  function closeAssistanceControl() {
    store.opened = false;
    render();
  }

  React.useEffect(() => {
    load();
  }, [classe?.id]);

  if (!academicCalendar || !canAttendance || userProfile !== 'teacher' || !backSessions?.length) {
    return null;
  }

  return (
    <>
      <Button variant="link" onClick={openAssistanceControl}>
        {text}
      </Button>
      <AttendanceControlDrawer
        classe={classe}
        opened={store.opened}
        onClose={closeAssistanceControl}
      />
    </>
  );
}

ClassHeaderBar.propTypes = {
  classe: PropTypes.object.isRequired,
  key: PropTypes.string.isRequired,
};

export default ClassHeaderBar;
