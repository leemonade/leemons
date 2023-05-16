import { useIsTeacher } from '@academic-portfolio/hooks';
import assignablesPrefixPN from '@assignables/helpers/prefixPN';
import useAssignationsByProfile from '@assignables/hooks/assignations/useAssignationsByProfile';
import { Box } from '@bubbles-ui/components';
import { useStore } from '@common';
import getChatUserAgent from '@comunica/helpers/getChatUserAgent';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { RoomInstanceViewStyles } from './RoomInstanceView.styles';

function RoomInstanceView({ room, t }) {
  const { classes } = RoomInstanceViewStyles({}, { name: 'RoomInstanceView' });
  const [store, render] = useStore({
    url: null,
  });
  const history = useHistory();
  const isTeacher = useIsTeacher();

  const instanceIds = React.useMemo(() => {
    if (room?.type === assignablesPrefixPN('assignation')) {
      return [room.key.split(':')[1]];
    }
    if (room?.type === assignablesPrefixPN('assignation.user')) {
      return [room.parentRoom.split(':')[1]];
    }
    return [];
  }, [room, room?.key, room?.type, room?.parentRoom]);

  const { data } = useAssignationsByProfile(instanceIds);

  function goUrl() {
    history.push(store.url);
  }

  React.useEffect(() => {
    store.url = null;
    if (data?.length) {
      const response = data[0];
      if (room.type === 'plugins.assignables.assignation.user') {
        if (isTeacher) {
          const student = getChatUserAgent(room.userAgents);
          if (student) {
            const studentId = student.userAgent.id;
            const assignableStudent = _.find(response.students, { user: studentId });
            if (assignableStudent) {
              if (assignableStudent.finished) {
                store.url = response.assignable.roleDetails.evaluationDetailUrl
                  .replace(':id', response.id)
                  .replace(':user', studentId);
              }
            }
          }
        }
      } else if (isTeacher) {
        store.url = (
          response.assignable.roleDetails.dashboardUrl || '/private/assignables/details/:id'
        ).replace(':id', response.id);
      } else if (!response.finished) {
        store.url = response.instance.assignable.roleDetails.studentDetailUrl
          .replace(':id', response.instance.id)
          .replace(':user', response.user);
      } else {
        store.url = response.instance.assignable.roleDetails.evaluationDetailUrl
          .replace(':id', response.instance.id)
          .replace(':user', response.user);
      }
    }
    render();
  }, [data, isTeacher]);

  if (!store.url) return null;

  return (
    <Box className={classes.view} onClick={goUrl}>
      {t('view')}
    </Box>
  );
}

RoomInstanceView.propTypes = {
  room: PropTypes.any,
  t: PropTypes.func,
};

export { RoomInstanceView };
export default RoomInstanceView;
