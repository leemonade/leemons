import React from 'react';
import useTranslateTitle from '@calendar/helpers/useTranslateTitle';
import { useIsTeacher } from '@academic-portfolio/hooks';
import { listKanbanColumnsRequest } from '@calendar/request';
import { useStore } from '@common';
import * as _ from 'lodash';
import transformEvent from './transformEvent';

async function getKanbanColumns() {
  const { columns } = await listKanbanColumnsRequest();
  return _.orderBy(columns, ['order'], ['asc']);
}

export default function useTransformEvent({ forKanban } = {}) {
  const [store, render] = useStore({
    columns: [],
  });

  async function init() {
    store.columns = await getKanbanColumns();
    render();
  }

  React.useEffect(() => {
    init();
  }, []);

  const isTeacher = useIsTeacher();
  const [translate, t, loading] = useTranslateTitle();
  return [
    (event, calendars) =>
      transformEvent(event, calendars, {
        columns: store.columns,
        forKanban,
        isTeacher,
        t,
        translate,
      }),
    loading,
  ];
}
