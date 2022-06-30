import { useEffect, useState } from 'react';

import getInstanceRequest from '../../../../request/instance/get';

export default function useInstance(id, columns) {
  const cols = Array.isArray(columns) ? columns : [];
  const [instance, setInstance] = useState(null);

  useEffect(async () => {
    if (!id) {
      return;
    }

    const inst = await getInstanceRequest({ id, columns: JSON.stringify(cols) });
    setInstance(inst);
  }, [id, ...cols]);

  return instance;
}
