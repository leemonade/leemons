import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import formWithTheme from '@common/formWithTheme';
import { Box, Button, ContextContainer, Stack, Title } from '@bubbles-ui/components';
import * as _ from 'lodash';
import { CutStarIcon, StarIcon } from '@bubbles-ui/icons/solid';
import { PluginSubjectsIcon } from '@bubbles-ui/icons/outline';

export const NEW_BRANCH_DETAIL_VALUE_MESSAGES = {
  nameLabel: 'Name',
  subjectLabel: 'Subject',
  namePlaceholder: 'Branch name...',
  saveButtonLabel: 'Save config',
};

export const NEW_BRANCH_DETAIL_VALUE_ERROR_MESSAGES = {
  nameRequired: 'Field required',
};

function NewBranchDetailValue({
  isSubject,
  subjectData,
  messages,
  errorMessages,
  isLoading,
  onSubmit,
  defaultValues,
  schema,
  schemaFormValues,
  readonly,
  onCloseBranch,
}) {
  const {
    reset,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    reset(defaultValues);
  }, [JSON.stringify(defaultValues)]);

  const datasetProps = React.useMemo(
    () => ({ formData: schemaFormValues }),
    [JSON.stringify(schemaFormValues)]
  );

  function getIcon(curricularContent) {
    switch (curricularContent) {
      case 'knowledges':
        return <PluginSubjectsIcon />;
      case 'qualifying-criteria':
        return <StarIcon />;
      case 'non-qualifying-criteria':
        return <CutStarIcon />;
      default:
        return null;
    }
  }

  const goodDatasetConfig = React.useMemo(() => {
    const response = _.cloneDeep(schema);
    if (response && response.jsonSchema) {
      _.forIn(response.jsonSchema.properties, (value, key) => {
        response.jsonSchema.properties[key].tabTitle = (
          <Box sx={(theme) => ({ display: 'flex', alignItem: 'center', gap: theme.spacing[2] })}>
            {getIcon(value.frontConfig.blockData.curricularContent)} {value.title}
          </Box>
        );
        response.jsonSchema.properties[key].frontConfig.required = false;
        if (readonly) {
          if (!response.jsonUI[key]) response.jsonUI[key] = {};
          response.jsonUI[key]['ui:readonly'] = true;
        }
      });
    }
    return {
      ...response,
      jsonSchema: {
        ...response.jsonSchema,
        required: [],
        asTabs: true,
      },
    };
  }, [schema, readonly]);

  const [form, formActions] = formWithTheme(
    goodDatasetConfig?.jsonSchema,
    goodDatasetConfig?.jsonUI,
    undefined,
    datasetProps
  );

  async function save() {
    handleSubmit(async (data) => {
      const toSend = { ...data, id: defaultValues?.id };
      let fErrors = [];
      if (formActions.isLoaded()) {
        await formActions.submit();
        fErrors = formActions.getErrors();
        toSend.datasetValues = formActions.getValues();
      }
      if (!fErrors.length) {
        onSubmit(toSend);
      }
    })();
  }

  return (
    <ContextContainer>
      <Title order={3}>{watch('name')}</Title>

      <Box>{form}</Box>

      {!readonly ? (
        <Stack justifyContent="end">
          <Button variant="outline" loading={isLoading} onClick={save}>
            {messages.saveButtonLabel}
          </Button>
        </Stack>
      ) : null}
    </ContextContainer>
  );
}

NewBranchDetailValue.defaultProps = {
  messages: NEW_BRANCH_DETAIL_VALUE_MESSAGES,
  errorMessages: NEW_BRANCH_DETAIL_VALUE_ERROR_MESSAGES,
  isLoading: false,
  onSubmit: () => {},
  onCloseBranch: () => {},
};

NewBranchDetailValue.propTypes = {
  isSubject: PropTypes.bool,
  subjectData: PropTypes.any,
  messages: PropTypes.shape({
    nameLabel: PropTypes.string,
    subjectLabel: PropTypes.string,
    namePlaceholder: PropTypes.string,
    saveButtonLabel: PropTypes.string,
  }),
  defaultValues: PropTypes.object,
  errorMessages: PropTypes.shape({
    nameRequired: PropTypes.string,
  }),
  schema: PropTypes.shape({
    jsonSchema: PropTypes.object,
    jsonUI: PropTypes.object,
  }),
  schemaFormValues: PropTypes.object,
  onSubmit: PropTypes.func,
  isLoading: PropTypes.bool,
  readonly: PropTypes.bool,
  onCloseBranch: PropTypes.func,
};

export default NewBranchDetailValue;
