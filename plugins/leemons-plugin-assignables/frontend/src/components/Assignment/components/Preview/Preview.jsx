import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { uniq } from 'lodash';
import propTypes from 'prop-types';

import { Container } from '../Container';

import NYACard from '@assignables/components/NYACard';

export default function Preview({ assignable, localizations }) {
  const { control } = useFormContext();
  const values = useWatch({ control });

  const instance = {
    assignable: {
      ...assignable,
      role: assignable?.role ?? assignable?.roleDetails?.name,
      asset: {
        ...assignable?.asset,
        name: values?.title ?? assignable?.asset?.name,
        cover: values?.thumbnail ?? assignable?.asset?.cover,
      },
    },
    classes: uniq(values?.students?.value?.flatMap((group) => group.group)),
    ...values?.evaluation?.evaluation,
    dates: values?.dates?.dates,
    metadata: {
      completion: {
        total: assignable?.submission?.activities?.length,
        completed: Math.ceil(Math.max((assignable?.submission?.activities?.length ?? 0) / 4, 1)),
      },
      statement: values?.instructions,
    },
  };

  return (
    <Container title={localizations?.title}>
      <NYACard instance={instance} clickable={false} showSubject />
    </Container>
  );
}

Preview.propTypes = {
  assignable: propTypes.object,
  localizations: propTypes.object,
};
