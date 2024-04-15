import React, { useMemo } from 'react';

import { ImageLoader } from '@bubbles-ui/components';

import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';
import useRolesList from '@assignables/requests/hooks/queries/useRolesList';
import useWeights from '@scores/requests/hooks/queries/useWeights';

const EVALUATED_ROLES = ['task', 'tests'];

export default function useRolesData({ class: klass }) {
  const rolesLocalizations = useRolesLocalizations(EVALUATED_ROLES);
  const { data: roles } = useRolesList({ details: true });
  const { data: weights, isLoading } = useWeights({ classId: klass, enabled: !!klass });

  const data = useMemo(() => {
    if (!rolesLocalizations || !roles || isLoading) return [];

    return EVALUATED_ROLES.map((role) => {
      const weight = weights?.weights?.find((w) => w.id === role);

      return {
        id: role,
        name: rolesLocalizations?.[role]?.plural,
        icon: !!roles && <ImageLoader src={roles?.find((r) => r.name === role)?.icon} />,
        weight: weight?.weight ?? 0,
        isLocked: !!weight && weight.isLocked,
      };
    });
  }, [rolesLocalizations, roles, weights, isLoading]);

  return { isLoading: isLoading || !rolesLocalizations || !roles, data };
}
