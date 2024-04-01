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

const SubstagesSetup = ({ onChange, localizations = {}, value }) => {
  const [substages, setSubstages] = useState([]);
  const form = useForm();

  const formLabels = useMemo(() => {
    if (!localizations) return {};
    return localizations?.programDrawer?.addProgramForm?.substagesSetup;
  }, [localizations]);

  useEffect(() => {
    if (value?.length > 0) {
      form.reset();
      setSubstages([
        ...value.map(({ name, abbreviation, id, index }) => ({
          name,
          abbreviation,
          id,
          index,
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
      const index = substages.length + 1;
      onChange([...substages, { name, abbreviation, index }]);
    }
  };

  const tableInputColumns = useMemo(
    () => [
      {
        accessor: 'index',
        editable: false,
      },
      {
        accessor: 'name',
        input: {
          node: <TextInput required />,
          rules: { required: localizations?.programDrawer?.requiredField },
        },
      },
      {
        accessor: 'abbreviation',
        input: {
          node: <TextInput />,
        },
      },
    ],
    [localizations]
  );

  return (
    <ContextContainer spacing={1}>
      <ContextContainer direction="row" alignItems="start">
        <Box sx={{ width: 216, minHeight: 88 }}>
          <Controller
            control={form.control}
            name="substageName"
            rules={{ required: localizations?.programDrawer?.requiredField }}
            render={({ field }) => (
              <TextInput
                {...field}
                required
                label={formLabels?.name}
                error={form.formState.errors.substageName}
                placeholder={formLabels?.addTextPlaceholder}
              />
            )}
          />
        </Box>
        <Box sx={{ width: 216, minHeight: 88 }}>
          <Controller
            control={form.control}
            name="substageAbbreviation"
            render={({ field }) => (
              <TextInput
                {...field}
                label={formLabels?.abbreviation}
                placeholder={formLabels?.addTextPlaceholder}
              />
            )}
          />
        </Box>
        <InputWrapper showEmptyLabel>
          <Button variant="link" leftIcon={<AddCircleIcon />} onClick={onAdd}>
            {formLabels?.add}
          </Button>
        </InputWrapper>
      </ContextContainer>

      {value?.length > 0 && (
        <Box>
          <TableInput
            columns={tableInputColumns}
            labels={{
              add: localizations?.labels?.add,
              remove: localizations?.labels?.remove,
              edit: localizations?.labels?.edit,
              accept: localizations?.labels?.accept,
              cancel: localizations?.labels?.cancel,
            }}
            canAdd={false}
            editable
            removable
            unique
            data={substages}
            showHeaders={false}
            onChange={(data) => {
              const updateObject = [...data].map((item, i) => ({ ...item, index: i + 1 }));

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
  localizations: PropTypes.object,
  value: PropTypes.arrayOf(PropTypes.object),
};

export default SubstagesSetup;
