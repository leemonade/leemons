import React, { useRef, useState } from 'react';

import {
  TotalLayoutContainer,
  TotalLayoutStepContainer,
  TotalLayoutHeader,
  ImageLoader,
  Stack,
  Box,
} from '@bubbles-ui/components';
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
  const scrollRef = useRef();
  const queryParams = useSearchParams();
  const history = useHistory();

  const [selectedProgram, setSelectedProgram] = useState(queryParams.get('program'));

  const { data: userCenter } = useUserCenters({
    select: (centers) => centers[0].id,
  });

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <TotalLayoutHeader
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
        </TotalLayoutHeader>
      }
    >
      <Stack justifyContent="center" ref={scrollRef} sx={{ overflowY: 'auto' }}>
        <TotalLayoutStepContainer fullWidth>
          <Weights program={selectedProgram} />
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
  );
}
