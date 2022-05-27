import React, { useMemo } from 'react';
import { Box } from '@bubbles-ui/components';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';

function TypeNotFound({ labels }) {
  return <Box>{labels?.types?.notFound?.notFound}</Box>;
}

export default function Submission({ assignation, labels }) {
  const submissionType = assignation?.instance?.assignable?.submission?.type;

  if (!submissionType) {
    return null;
  }

  const Component = useMemo(
    () =>
      loadable(() =>
        pMinDelay(
          (async () => {
            try {
              return await import(`./Variants/${submissionType}`);
            } catch (e) {
              return TypeNotFound;
            }
          })(),
          1000
        )
      ),
    [submissionType]
  );

  return <Component assignation={assignation} labels={labels} />;
}
