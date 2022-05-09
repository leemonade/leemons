import React from 'react';
import { LibraryDetail } from '@bubbles-ui/leemons';

const TestsDetail = ({ ...props }) => {
  const toolbarItems = {
    edit: 'Edit',
    // duplicate: 'Duplicate',
    // delete: 'Delete',
    assign: 'Assign',
    toggle: 'Toggle',
  };

  // ·········································································
  // HANDLERS

  const handleEdit = (item) => {
    console.log(item);
  };

  const handleDuplicate = (item) => {
    console.log(item);
  };

  const handleDelete = (item) => {
    console.log(item);
  };

  const handleAssign = (item) => {
    console.log(item);
  };

  // ·········································································
  // RENDER

  return (
    <LibraryDetail
      {...props}
      variant="task"
      toolbarItems={toolbarItems}
      onEdit={handleEdit}
      onDuplicate={handleDuplicate}
      onDelete={handleDelete}
      onAssign={handleAssign}
    />
  );
};

TestsDetail.propTypes = {};

export default TestsDetail;
