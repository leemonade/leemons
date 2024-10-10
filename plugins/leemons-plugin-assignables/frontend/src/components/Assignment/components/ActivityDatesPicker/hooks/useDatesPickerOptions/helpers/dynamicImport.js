import React from 'react';

import { LoadingOverlay } from '@bubbles-ui/components';
import loadable from '@loadable/component';

export default function dynamicImport({ pluginName, path, preload }) {
  const component = loadable(
    async () => {
      try {
        /* webpackInclude: /src\/widgets\/assignables\/assignmentForm\/datePicker\/.*\.js/ */
        return await import(`@app/plugins/${pluginName}/src/widgets/${path}.js`);
      } catch (error) {
        /* webpackInclude: /src\/widgets\/assignables\/assignmentForm\/datePicker\/.*\.tsx/ */
        return await import(`@app/plugins/${pluginName}/src/widgets/${path}.tsx`);
      }
    },
    {
      fallback: <LoadingOverlay visible />,
    }
  );

  if (preload) {
    component.preload();
  }

  return component;
}
