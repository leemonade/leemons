import React, { useMemo, useState } from 'react';
import { Box, ActivityAccordion, ActivityAccordionPanel } from '@bubbles-ui/components';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';
import { PluginAssignmentsIcon } from '@bubbles-ui/icons/outline';
import styles from '../../Correction.style';

function TypeNotFound({ labels }) {
  return <Box>{labels?.types?.notFound?.notFound}</Box>;
}

export default function Submission({ assignation, labels }) {
  const [state, setState] = useState([]);

  React.useEffect(() => {
    if (!state.length && labels?.title) {
      setState([labels.title]);
    }
  }, [labels?.title !== undefined]);
  const submissionType = assignation?.instance?.assignable?.submission?.type;
  const { classes } = styles();

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

  if (!submissionType) {
    return null;
  }

  return (
    <ActivityAccordion value={state} onChange={setState}>
      <ActivityAccordionPanel label={labels?.title} icon={<PluginAssignmentsIcon />}>
        <Box className={classes?.accordionPanel}>
          <Component assignation={assignation} labels={labels} />
        </Box>
      </ActivityAccordionPanel>
    </ActivityAccordion>
  );
}
