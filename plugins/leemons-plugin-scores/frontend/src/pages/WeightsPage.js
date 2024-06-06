import React, { useState } from 'react';

import { ImageLoader, Box, TLayout } from '@bubbles-ui/components';
import { useHistory } from 'react-router-dom';
import { useSearchParams } from '@common';

import { SelectProgram } from '@academic-portfolio/components';
import { useUserCenters } from '@users/hooks';
import Weights from '@scores/components/Weights/Weights';
import evaluationsIcon from '@scores/../public/menu-icon.svg';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';

export default function WeightsPage() {
  const [t] = useTranslateLoader(prefixPN('weighting'));
  const queryParams = useSearchParams();
  const history = useHistory();

  const [selectedProgram, setSelectedProgram] = useState(queryParams.get('program'));

  const { data: userCenter } = useUserCenters({
    select: (centers) => centers[0].id,
  });

  return (
    <TLayout>
      <TLayout.Header
        cancelable={false}
        title={t('title')}
        icon={
          <Box sx={{ position: 'relative', width: 20, height: 20 }}>
            <ImageLoader src={evaluationsIcon} />
          </Box>
        }
      >
        <SelectProgram
          center={userCenter}
          firstSelected
          value={selectedProgram}
          onChange={(program) => {
            setSelectedProgram(program);

            if (program) {
              const newParams = new URLSearchParams(queryParams);
              newParams.set('program', program);
              history.replace({ search: newParams.toString() });
            }
          }}
        />
      </TLayout.Header>
      <TLayout.Content>
        <Weights program={selectedProgram} />
      </TLayout.Content>
    </TLayout>
  );
}
