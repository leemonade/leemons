import React, { useEffect, useState, useRef } from 'react';
import { flatten } from 'lodash';
import PropTypes from 'prop-types';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { FilterIcon } from '@bubbles-ui/icons/outline';
import {
  Text,
  Box,
  Button,
  Stack,
  PageContainer,
  ContextContainer,
  Select,
} from '@bubbles-ui/components';
import { listTeacherClassesRequest } from '@academic-portfolio/request';
import { getCentersWithToken } from '@users/session';
import { useApi } from '@common';

function SelectClass(props) {
  const userAgents = useRef({});
  const [data, setData] = useState([]);

  const [centers] = useApi(getCentersWithToken);

  useEffect(async () => {
    // EN: Get the new userAgents if required
    // ES: Obtener los nuevos userAgents si es necesario
    if (userAgents.current.centers !== centers) {
      userAgents.current = {
        centers,
        agents: (await getCentersWithToken()).map((agent) => agent.userAgentId),
      };
    }

    // EN: Get the classes the teacher has
    // ES: Obtener las clases que tiene el profesor
    const classes = flatten(
      await Promise.all(
        userAgents.current.agents.map(
          async (agent) =>
            (
              await listTeacherClassesRequest({
                page: 0,
                size: 100,
                teacher: agent,
              })
            ).data.items
        )
      )
    ).map((_class) => ({
      value: _class.id,
      // TODO: Update to standard class name
      label: `${_class.courses.name || _class.courses.index} - ${_class.subject.name}`,
    }));

    if (classes) {
      setData(classes);
    } else {
      setData([]);
    }
  }, []);

  return <Select {...props} data={data} />;
}

export default function Filters({ onChange }) {
  const form = useForm({
    defaultValues: {
      show: false,
    },
  });
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = (values) => {
    const { group } = values;

    onChange({
      group,
    });
  };

  const program = watch('program');
  return (
    <Controller
      name="show"
      control={control}
      render={({ field: { value: show, onChange: onShowChange } }) => (
        <ContextContainer>
          <Box onClick={() => onShowChange(!show)} style={{ cursor: 'pointer' }}>
            <FilterIcon />
            <Text>Filter by</Text>
          </Box>
          {show && (
            <PageContainer>
              <FormProvider {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={5} direction="row" alignItems={'end'}>
                    <Controller
                      control={control}
                      name="group"
                      render={({ field }) => (
                        <SelectClass {...field} label="class" error={errors?.class} />
                      )}
                    />
                    <Button type="submit" variant="light">
                      Apply
                    </Button>
                  </Stack>
                </form>
              </FormProvider>
            </PageContainer>
          )}
        </ContextContainer>
      )}
    />
  );
}

Filters.propTypes = {
  onChange: PropTypes.func.isRequired,
};
