import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import SelectUserAgent from '@users/components/SelectUserAgent';
import { Button, ContextContainer, Table } from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/outline';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { getProfiles } from '../../request/profiles';

function Actions({ id, onDelete }) {
  return (
    <>
      <DeleteBinIcon onClick={() => typeof onDelete === 'function' && onDelete(id)} />
    </>
  );
}

export default function SelectTeachers({ role, onChange }) {
  const [profiles, setProfiles] = useState([null]);
  const [assignees, setAssignees] = useState([]);
  const { control, handleSubmit, resetField } = useForm();

  const onDelete = (id) => {
    setAssignees((assignee) => assignee.filter((a) => a.id !== id));
  };
  const onSubmit = ({ assignee }) => {
    setAssignees((a) => [
      ...a,
      { id: assignee, actions: <Actions id={assignee} onDelete={onDelete} /> },
    ]);
  };

  // EN: Get the teacher profile selected on the plugin settings
  // ES: Obtenemos el perfil de profesor seleccionado en la configuración del plugin
  useEffect(() => {
    getProfiles(role).then((p) => {
      if (p.length) {
        setProfiles(p.map(({ profile: id }) => id));
      }
    });
  }, [role]);

  useEffect(() => {
    setAssignees([]);
  }, [profiles]);

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(assignees.map((a) => a.id));
    }
  }, [assignees]);

  return (
    <ContextContainer spacing={1}>
      <ContextContainer direction="row" alignItems="center">
        <Controller
          name="assignee"
          control={control}
          render={({ field }) => <SelectUserAgent {...field} profiles={profiles} />}
        />
        <Button leftIcon={<AddCircleIcon />} variant="link" noFlex onClick={handleSubmit(onSubmit)}>
          Add
        </Button>
      </ContextContainer>
      <Table
        columns={[
          { Header: 'userId', accessor: 'id' },
          { Header: '', accessor: 'actions' },
        ]}
        data={assignees}
      />
    </ContextContainer>
  );
}
