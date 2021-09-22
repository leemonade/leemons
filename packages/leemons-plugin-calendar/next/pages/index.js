import { useEffect, useState } from 'react';
import { getCentersWithToken, useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import { getCalendarsToFrontendRequest } from '@calendar/request';
import { Button } from 'leemons-ui';

function Calendar() {
  const session = useSession({ redirectTo: goLoginPage });
  const [centers, setCenters] = useState([]);

  const getCalendarsForCenter = async (center) => {
    const response = await getCalendarsToFrontendRequest(center.token);
    console.log(response);
  };

  useEffect(() => {
    setCenters(getCentersWithToken());
  }, []);

  useEffect(() => {
    if (centers.length) getCalendarsForCenter(centers[0]);
  }, [centers]);

  return (
    <div>
      {centers.length > 1 ? (
        <>
          {centers.map((center) => (
            <Button key={center.id} onClick={() => getCalendarsForCenter(center)}>
              {center.name}
            </Button>
          ))}
        </>
      ) : null}
    </div>
  );
}

export default withLayout(Calendar);
