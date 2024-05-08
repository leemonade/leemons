import { useEffect, useState } from 'react';

import RoomService from '@comunica/RoomService';
import { noop } from 'lodash';
import useAssignations from '@assignables/requests/hooks/queries/useAssignations';

async function setRoomIfExists({ room, setRoom, else: elseFunction = noop }) {
  new RoomService(room).roomExists().then((exists) => {
    if (exists) {
      setRoom(room);
    } else {
      elseFunction();
    }
  });
}

export default function useAssignationComunicaRoom({ assignation, subject }) {
  const [room, setRoom] = useState(null);
  const user = assignation?.user;

  const moduleData = assignation?.instance?.metadata?.module;
  const isModuleActivity = moduleData?.type === 'activity';

  const { data: moduleAssignation } = useAssignations({
    query: {
      instance: moduleData?.id,
      user,
    },
    enabled: !!isModuleActivity,
  });

  const moduleId = isModuleActivity ? moduleAssignation?.id : null;

  useEffect(() => {
    const activityRoom = `assignables.subject|${subject}.assignation|${assignation?.id}.userAgent|${assignation?.user}`;
    const moduleRoom = `assignables.subject|${subject}.assignation|${moduleId}.userAgent|${assignation?.user}`;
    setRoomIfExists({
      room: activityRoom,
      setRoom,
      else: () => {
        if (moduleId) {
          setRoomIfExists({ room: moduleRoom, setRoom });
        }
      },
    });
  }, [assignation?.id, assignation?.user, subject, moduleId]);

  return room;
}
