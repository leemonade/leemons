import React, { useState, useEffect } from 'react';
import { useApi } from '@common';
import { Paragraph, useDebouncedValue, SearchInput } from '@bubbles-ui/components';
import listTasksRequest from '../../request/task/listTasks';
import Filters from './Filters';
import CardList from './CardList';

export default function ListTasks({ draft = false }) {
  const [options, setOptions] = useState({
    draft,
  });
  const [name, setName] = useState('');
  const [debouncedName] = useDebouncedValue(name, 200);

  useEffect(() => {
    setOptions((o) => ({
      ...o,
      name: debouncedName,
    }));
  }, [debouncedName]);

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
      <SearchInput onChange={(value) => setName(value)} value={name} placeholder="search task" />
      {dataError ? (
        <Paragraph>Error {dataError.message}</Paragraph>
      ) : (
        <CardList data={data?.items} loading={loadingData} refresh={refreshData} />
      )}
    </>
  );
}
