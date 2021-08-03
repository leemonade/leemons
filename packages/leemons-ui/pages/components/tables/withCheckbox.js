import React, { useState } from 'react';
import { Divider } from '../../../src/components/ui';
import ClassTable from '../../../src/components/ClassTable';
import Table from '../../../src/components/ui/Table';

const _data = {
  showType: true,
  components: [{ class: 'alert', desc: 'Container element' }],
  utilities: [
    { class: 'alert-info', desc: 'Alert with `info` color' },
    { class: 'alert-success', desc: 'Alert with `success` color' },
    { class: 'alert-warning', desc: 'Alert with `warning` color' },
    { class: 'alert-error', desc: 'Alert with `error` color' },
  ],
};

function AlertPage() {
  const [state, setState] = useState([
    {
      name: 'Jaime',
      surname: {
        type: 'checkbox',
        checked: false,
        disabled: true,
      },
    },
  ]);

  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
      className: 'text-left',
    },
    {
      Header: 'Surname',
      accessor: 'surname',
    },
  ];

  function onChangeData(d) {}

  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Table withCheckboxs</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Table columns={columns} data={state} setData={setState} onChangeData={onChangeData} />

        <Divider className="my-6" />

        <ClassTable data={_data} />
      </div>
    </main>
  );
}

export default AlertPage;
