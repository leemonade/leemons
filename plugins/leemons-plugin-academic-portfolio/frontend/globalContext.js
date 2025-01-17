import { useNotifications } from '@bubbles-ui/notifications';
import { SocketIoService } from '@mqtt-socket-io/service';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';

import { SOCKET_EVENTS } from '@academic-portfolio/config/constants';
import { GlobalContext, GlobalProvider } from '@academic-portfolio/context/global';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { getClassStudentsKey } from '@academic-portfolio/hooks/keys/classStudents';
import { getProgramSubjectsKey } from '@academic-portfolio/hooks/keys/programSubjects';

function getSeverity(status) {
  if (status === 'completed') {
    return 'success';
  }

  if (status === 'error') {
    return 'error';
  }

  return 'info';
}

function getClassName(classData) {
  return classData?.alias ?? classData?.classWithoutGroupId ?? classData?.classroomId ?? '-';
}

function processNotification({
  t,
  notifications,
  class: classData,
  eventName,
  status,
  message,
  error,
  isCompleted,
}) {
  const severity = getSeverity(status);
  const messageKey = `message.${message}`;
  const titleKey = `title.${eventName}`;
  const notificationId = `${SOCKET_EVENTS[eventName]}:${classData.id}`;
  const className = getClassName(classData);

  notifications.updateNotification(notificationId, {
    id: notificationId,
    severity,
    loading: !isCompleted,
    title: t(titleKey, { className }),
    message: severity === 'error' ? error : t(messageKey),
    autoClose: isCompleted ? 3000 : false,
    disallowClose: !isCompleted,
  });
}

export function Provider({ children }) {
  const [t] = useTranslateLoader(prefixPN('socketEvents'));
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  // ·································································
  // HANDLERS

  SocketIoService.useOn(SOCKET_EVENTS.CLASS_UPDATE, (event, data) => {
    const { class: classData, status, message, error } = data ?? {};

    if (classData?.id) {
      const isCompleted = status === 'completed';

      processNotification({
        t,
        error,
        status,
        message,
        isCompleted,
        notifications,
        class: classData,
        eventName: 'CLASS_UPDATE',
      });

      if (isCompleted) {
        const programSubjectsKey = getProgramSubjectsKey(
          classData?.program?.id ?? classData?.program
        );
        queryClient.invalidateQueries(programSubjectsKey);

        const subjectDetailKey = [
          'subjectDetail',
          { subject: classData.subject?.id ?? classData.subject },
        ];
        queryClient.invalidateQueries(subjectDetailKey);
      }
    }
  });

  SocketIoService.useOn(SOCKET_EVENTS.ENROLLMENT_UPDATE, (event, data) => {
    const { class: classData, status, message, error } = data ?? {};

    if (classData?.id) {
      const isCompleted = status === 'completed';

      processNotification({
        t,
        error,
        status,
        message,
        isCompleted,
        notifications,
        class: classData,
        eventName: 'ENROLLMENT_UPDATE',
      });

      if (isCompleted) {
        const programSubjectsKey = getProgramSubjectsKey(classData.program);
        queryClient.invalidateQueries(programSubjectsKey);

        const classStudentsKey = getClassStudentsKey(classData.id);
        queryClient.invalidateQueries(classStudentsKey);
      }
    }
  });

  // ·································································
  // RENDER

  return <GlobalProvider value={{}}>{children}</GlobalProvider>;
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default GlobalContext;
