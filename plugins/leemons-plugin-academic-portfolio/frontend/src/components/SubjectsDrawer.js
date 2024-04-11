/* eslint-disable no-param-reassign */
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { Box, Button, ContextContainer, BaseDrawer, Title } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDeploymentConfig } from '@deployment-manager/hooks/useDeploymentConfig';

function SubjectsDrawer({ saving, opened, onClose, value, columns, onSave }) {
  const [t] = useTranslateLoader(prefixPN('subjectsDrawer'));
  const [reload, setReload] = React.useState(false);
  const form = useForm();
  const deploymentConfig = useDeploymentConfig({
    pluginName: 'academic-portfolio',
    ignoreVersion: true,
  });
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;
  const formValues = watch();

  React.useEffect(() => {
    setReload(true);
    // I don't know why but with a single reset the fields are not deleted and when we take the values with watch it returns the old ones.
    form.reset(value);
    form.reset(value);
    setTimeout(() => {
      setReload(false);
    }, 20);
  }, [value]);

  function getColumnInput(column) {
    if (column && column.input) {
      const { node, rules, onChange, ...inputProps } = column.input;
      return (
        <Controller
          control={control}
          name={column.accessor}
          rules={rules}
          render={({ field }) =>
            React.cloneElement(node, {
              label: column.Header,
              placeholder: column.Header,
              ...field,
              ...inputProps,
              formValues,
              error: errors[column.accessor],
              form,
              onChange: (e) => {
                if (_.isFunction(onChange)) {
                  onChange(e, {
                    form,
                    field,
                  });
                } else {
                  field.onChange(e);
                }
              },
            })
          }
        />
      );
    }

    return null;
  }

  function save() {
    handleSubmit((data) => {
      const v = {};
      _.forEach(columns, (column) => {
        v[column.accessor] = data[column.accessor];
      });
      if (!v.hasOwnProperty('seats') && deploymentConfig?.defaults?.classSeats) {
        v.seats = deploymentConfig?.defaults?.classSeats;
      }
      onSave(v);
    })();
  }

  return (
    <BaseDrawer
      opened={opened}
      onClose={onClose}
      size={360}
      header={
        <Title
          sx={(theme) => ({ paddingLeft: theme.spacing[4], width: '100%', alignSelf: 'center' })}
          order={4}
        >
          {t(value?.id ? 'edit' : 'add')}
        </Title>
      }
    >
      <ContextContainer>
        {reload ? null : (
          <>
            {columns.map((column) => (
              <Box key={column.accessor}>{getColumnInput(column)}</Box>
            ))}
          </>
        )}

        <Box style={{ textAlign: 'right' }}>
          <Button loading={saving} onClick={save}>
            {t('save')}
          </Button>
        </Box>
      </ContextContainer>
    </BaseDrawer>
  );
}

SubjectsDrawer.propTypes = {
  opened: PropTypes.bool,
  value: PropTypes.any,
  columns: PropTypes.array,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  saving: PropTypes.bool,
};

export { SubjectsDrawer };
