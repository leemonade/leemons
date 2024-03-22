import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  TextInput,
  Button,
  ContextContainer,
  Box,
  TableInput,
  InputWrapper,
} from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';

const SubstagesSetup = ({ onChange, labels = {}, value }) => {
  const [substages, setSubstages] = useState([]);
  const form = useForm();

  useEffect(() => {
    if (value?.length > 0) {
      setSubstages([
        ...value.map(({ name, abbreviation }, i) => ({
          name,
          abbreviation,
          index: i + 1,
        })),
      ]);
    } else {
      setSubstages([]);
    }
  }, [value]);

  const onAdd = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const name = form.getValues('substageName');
      const abbreviation = form.getValues('substageAbbreviation');
      const cleanSubstages = substages.map(({ name: _name, abbreviation: _abbreviation }) => ({
        name: _name,
        abbreviation: _abbreviation,
      }));
      onChange([...cleanSubstages, { name, abbreviation }]);
    }
  };

  const tableInputColumns = useMemo(
    () => [
      {
        accessor: 'index',
      },
      {
        accessor: 'name',
        input: {
          node: <TextInput required />,
          rules: { required: 'Required Field 🌎' },
        },
      },
      {
        accessor: 'abbreviation',
        input: {
          node: <TextInput />,
        },
      },
    ],
    [labels]
  );

  return (
    <ContextContainer spacing={1}>
      <ContextContainer direction="row" alignItems="start">
        <Box sx={{ width: 216, minHeight: 88 }}>
          <Controller
            control={form.control}
            name="substageName"
            rules={{ required: 'Required Field 🌎' }}
            render={({ field }) => (
              <TextInput
                {...field}
                required
                label={'Nombre 🌎'}
                error={form.formState.errors.substageName}
                placeholder={'Añadir texto... 🌎'}
              />
            )}
          />
        </Box>
        <Box sx={{ width: 216, minHeight: 88 }}>
          <Controller
            control={form.control}
            name="substageAbbreviation"
            render={({ field }) => (
              <TextInput {...field} label={'Abreviatura 🌎'} placeholder={'Añadir texto... 🌎'} />
            )}
          />
        </Box>
        <InputWrapper showEmptyLabel>
          <Button variant="link" leftIcon={<AddCircleIcon />} onClick={onAdd}>
            {'Añadir 🌎'}
          </Button>
        </InputWrapper>
      </ContextContainer>

      {value?.length > 0 && (
        <Box>
          <TableInput
            columns={tableInputColumns}
            labels={{
              add: labels?.add,
              remove: labels?.remove,
              edit: labels?.edit,
              accept: labels?.accept,
              cancel: labels?.cancel,
            }}
            canAdd={false}
            editable
            removable
            unique
            data={substages}
            showHeaders={false}
            onChange={(data) => {
              const updateObject = data.map(({ name, abbreviation }) => ({ name, abbreviation }));
              onChange(updateObject);
            }}
          />
        </Box>
      )}
    </ContextContainer>
  );
};

SubstagesSetup.propTypes = {
  onChange: PropTypes.func,
  labels: PropTypes.object,
  value: PropTypes.arrayOf(PropTypes.object),
};

export default SubstagesSetup;
