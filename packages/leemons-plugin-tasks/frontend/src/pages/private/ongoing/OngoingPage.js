import React, { useState, useEffect } from 'react';
import { PageContainer, ContextContainer } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';

import TeacherAssignedTasksLists from '../../../components/Ongoing/TeacherAssignedTasksLists';
import { prefixPN } from '../../../helpers';

export default function OngoingPage() {
  const [, translations] = useTranslateLoader(prefixPN('ongoing_page'));
  const [labels, setLabels] = useState({});

  useEffect(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = res.plugins.tasks.ongoing_page;

      setLabels(data);

      // EN: Save your translations keys to use them in your component
      // ES: Guarda tus traducciones para usarlas en tu componente
    }
  }, [translations]);

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={{ title: labels?.page_title }} />
      <PageContainer>
        <TeacherAssignedTasksLists />
      </PageContainer>
    </ContextContainer>
  );
}
