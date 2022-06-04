import { listSessionClassesRequest } from '@academic-portfolio/request';
import React from 'react';
import _ from 'lodash';
import { useApi } from '@common';
import CenterAlignedSelect from '../CenterAlignedSelect';

export default function Subject({ labels, value, onChange }) {
  const [data] = useApi(listSessionClassesRequest);

  const classes = data?.classes;
  const subjects = classes?.map((klass) => ({
    value: klass.subject.id,
    label: klass.subject.name,
  }));
  const uniqSubjects = _.uniqBy(subjects, 'value');

  return (
    <CenterAlignedSelect
      orientation="horizontal"
      label={labels?.subject}
      data={[
        {
          label: labels?.seeAll,
          value: 'all',
        },
        ...uniqSubjects,
      ]}
      value={value}
      onChange={onChange}
    />
  );
}
