import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Badge, Stack, useTheme } from '@bubbles-ui/components';
import { AlertWarningTriangleIcon } from '@bubbles-ui/icons/solid';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import useModulesData from '../../WeightConfigDrawer/components/Weighting/hooks/useModulesData';

export default function RulesRenderer({
  value,
  row: {
    original: { id },
  },
}) {
  const [typesT] = useTranslateLoader(prefixPN('weightingTypes'));
  const theme = useTheme();

  const isModuleTypes = value === 'modules';

  const { data: modules } = useModulesData({ class: isModuleTypes ? id : null });

  const hasNewModules = useMemo(() => {
    if (!isModuleTypes) {
      return false;
    }

    return modules.some((module) => module.isNew);
  }, [modules, isModuleTypes]);

  return (
    <Stack spacing={3} alignItems="center">
      <Badge closable={false}>{typesT(value ?? 'averages')}</Badge>
      {!!hasNewModules && (
        <AlertWarningTriangleIcon
          color={theme.other.banner.content.color.error}
          width={18}
          height={18}
        />
      )}
    </Stack>
  );
}

RulesRenderer.propTypes = {
  value: PropTypes.string.isRequired,
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
