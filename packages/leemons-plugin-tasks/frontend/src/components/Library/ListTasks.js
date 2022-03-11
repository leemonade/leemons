import React, { useState } from 'react';
import { useApi } from '@common';
import listTasksRequest from '../../request/task/listTasks';
import Filters from './Filters';
import CardList from './CardList';

export default function ListTasks({ draft = false }) {
  const [options, setOptions] = useState({
    draft,
  });
  const [data, dataError, loadingData, refreshData] = useApi(listTasksRequest, options, 30000);

  return (
    <>
      <Filters
        onChange={(value) => {
          setOptions({
            ...value,
            draft,
          });
        }}
      />

      <CardList data={data?.items} loading={loadingData} refresh={refreshData} />
    </>
  );
}
