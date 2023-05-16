import React from 'react';

import { ModuleSetup } from '@learning-paths/components/ModuleSetup';
import { ModuleSetupContextProvider } from '@learning-paths/contexts/ModuleSetupContext';

export default function ModuleSetupPage() {
  return (
    <ModuleSetupContextProvider value={{}}>
      <ModuleSetup />
    </ModuleSetupContextProvider>
  );
}
