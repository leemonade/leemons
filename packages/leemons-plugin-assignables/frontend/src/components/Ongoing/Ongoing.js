import React from 'react';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import AssignmentList from './AssignmentList';
import NeedYourAttention from './NeedYourAttention';
import searchAssignableInstances from '../../requests/assignableInstances/searchAssignableInstances';

export default function Ongoing() {
  searchAssignableInstances().then(console.log);
  return (
    <>
      <AdminPageHeader values={{ title: 'Ongoing' }} />
      <NeedYourAttention />
      <AssignmentList />
    </>
  );
}
