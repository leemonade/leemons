import React, { useEffect } from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { useQuery, useStore } from '@common';

export default function TreePage() {
  const [t] = useTranslateLoader(prefixPN('profiles_page'));
  const [store, render] = useStore();

  const params = useQuery();
  useEffect(() => {
    store.centerId = params.center;
    store.programId = params.program;
    render();
  }, [params]);

  return <div>Miau</div>;
}
