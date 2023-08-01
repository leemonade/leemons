import React from 'react';
import { Box, Button, LoadingOverlay } from '@bubbles-ui/components';
import { ActivityContainer } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scorm/helpers';
import { useLocale } from '@common';
import { useParams } from 'react-router-dom';
import useAssignableInstances from '@assignables/hooks/assignableInstance/useAssignableInstancesQuery';
import usePackage from '@scorm/request/hooks/queries/usePackage';
import useClassData from '@assignables/hooks/useClassDataQuery';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import ScormRender from '@scorm/components/ScormRender';
import { useViewStyles } from '../View';

function useData({ id }) {
  const { data: scormPackage, isLoading: scormIsLoading } = usePackage({
    id,
    enabled: !!id,
  });

  const coverUrl = React.useMemo(
    () => getFileUrl(scormPackage?.asset?.cover?.id ?? scormPackage?.asset?.cover),
    [scormPackage?.asset?.cover]
  );

  return {
    scormPackage,
    coverUrl,

    isLoading: scormIsLoading,
  };
}

export default function Preview() {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('scormView'));
  const locale = useLocale();
  const { classes } = useViewStyles();

  const { id } = useParams();

  const { scormPackage, coverUrl, isLoading: dataIsLoading } = useData({ id });

  if (dataIsLoading || tLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <Box
      sx={{
        'div div:nth-child(2)': {
          overflow: 'hidden',
        },
      }}
    >
      <ActivityContainer
        header={{
          title: scormPackage?.asset?.name ?? 'name',
          image: coverUrl,
        }}
        collapsed
      >
        <ScormRender scormPackage={scormPackage} />
      </ActivityContainer>
      <Box className={classes.buttonContainer}>
        <Button disabled>{t('markAsFinish')}</Button>
      </Box>
    </Box>
  );
}
