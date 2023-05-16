import { Box, ContextContainer, Title } from '@bubbles-ui/components';
import { PluginSubjectsIcon } from '@bubbles-ui/icons/outline';
import { CutStarIcon, StarIcon } from '@bubbles-ui/icons/solid';
import { useStore } from '@common';
import CurriculumForm from '@curriculum/components/FormTheme/CurriculumForm';
import { getParentNodes } from '@curriculum/helpers/getParentNodes';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { useForm } from 'react-hook-form';

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
  isEditMode = true,
  onSubmit,
  defaultValues,
  schema,
  schemaFormValues,
  readonly,
  curriculum,
  onCloseBranch,
}) {
  const [store, render] = useStore();

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
        tabProps: {
          onChange: (e) => {
            store.hideSaveButton = false;
            if (response.jsonSchema.properties[e].frontConfig.blockData.type === 'list') {
              store.hideSaveButton = true;
            }
            render();
          },
        },
      },
    };
  }, [schema, readonly]);

  const parentNodes = React.useMemo(
    () => getParentNodes(curriculum.nodes, defaultValues.id).reverse(),
    [curriculum, defaultValues]
  );

  /*
  const [form, formActions] = formWithTheme(
    goodDatasetConfig?.jsonSchema,
    goodDatasetConfig?.jsonUI,
    undefined,
    datasetProps,
    {
      customValidateSchema: goodDatasetConfig?.jsonSchema,
      widgets: { BaseInput, wysiwyg: WysiwygWidget, TextareaWidget: WysiwygWidget, ListField },
    }
  );

   */

  async function save(datasetValues, noClose = true) {
    const toSend = { ...defaultValues, datasetValues };
    await onSubmit(toSend, noClose);
  }

  return (
    <ContextContainer>
      <Title order={3}>
        {!isEditMode ? parentNodes.map(({ name }) => `${name} > `) : null}
        {watch('name')}
      </Title>

      <Box>
        <CurriculumForm
          id={defaultValues.id}
          curriculum={curriculum}
          isEditMode={isEditMode}
          schema={goodDatasetConfig?.jsonSchema}
          onSave={save}
          defaultValues={schemaFormValues}
          readonly={readonly}
        />
      </Box>
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
  curriculum: PropTypes.any,
  onCloseBranch: PropTypes.func,
  isEditMode: PropTypes.bool,
};

export default NewBranchDetailValue;
