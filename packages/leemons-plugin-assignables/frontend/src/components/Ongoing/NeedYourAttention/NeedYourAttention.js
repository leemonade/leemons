import React, { useMemo, useEffect } from 'react';
import { LibraryCard } from '@bubbles-ui/leemons';
import useAssignableInstances from '../../../hooks/assignableInstance/useAssignableInstances';
import useSearchAssignableInstances from '../../../hooks/assignableInstance/useSearchAssignableInstances';

export default function NeedYourAttention() {
  const instances = useSearchAssignableInstances();
  const instancesData = useAssignableInstances(instances);
  return <>Need your attention</>;
}
