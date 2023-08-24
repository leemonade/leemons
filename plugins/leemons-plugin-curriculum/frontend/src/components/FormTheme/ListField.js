/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { TextEditorInput } from '@bubbles-ui/editors';
import { Box, Button, ContextContainer, createStyles, TextInput } from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/outline';
import { randomString, useStore } from '@common';
import { ParentRelation } from '@curriculum/components/FormTheme/ParentRelation';
import { FormContext } from './FormContext';

const ItemValueRender = ({ item }) => (
  <Box sx={() => ({ width: '100%' })} dangerouslySetInnerHTML={{ __html: item.value }} />
);

const useStyle = createStyles((theme) => ({
  card: {
    border: `1px solid ${theme.colors.ui01}`,
    borderRadius: '8px',
    overflow: 'hidden',
    padding: theme.spacing[4],
  },
}));

const ListField = (props) => {
  const { classes } = useStyle();
  const {
    options,
    uiSchema,
    schema: {
      frontConfig: { blockData },
    },
    readonly,
    canAdd,
    formData,
    disabled,
    rawErrors,
    required,
    title,
  } = props;
  const { t } = useContext(FormContext);
  const [store, render] = useStore();

  const Field = React.useMemo(
    () =>
      ({
        textarea: TextEditorInput,
        field: TextInput,
      }[blockData.listType]),
    [blockData.listType]
  );

  function onNew() {
    const value = props.value || { value: [], metadata: {} };
    value.value.push({
      id: randomString(),
    });
    store.editingItem = value.value[value.value.length - 1];
    console.log(value);
    props.onChange(value);
  }

  console.log(props);

  function onFieldChange(e) {
    console.log(props);
    const index = _.findIndex(props.value.value, { id: store.editingItem.id });
    props.value.value[index].value = e;
    props.onChange(props.value);
  }

  return (
    <Box>
      <ParentRelation {...props} />

      {store.editingItem ? (
        <Box className={classes.card}>
          <ContextContainer>
            <Field
              value={props.value}
              label={uiSchema['ui:title'] || title}
              onChange={onFieldChange}
            />
          </ContextContainer>
        </Box>
      ) : null}

      {!store.editingItem ? (
        <Button variant="light" leftIcon={<AddCircleIcon />} onClick={onNew}>
          {t('addNewElementToList')}
        </Button>
      ) : null}
    </Box>
  );

  /*
  const help = options?.help;

  const config = {
    inputRender: (props) => {
      const onChange = (value) =>
        props.onChange({ ...props.value, value: value === '' ? options.emptyValue : value });
      return <TextEditorInput {...props} value={props?.value?.value} onChange={onChange} />;
    },
  };

  if (schema.frontConfig.blockData.listType === 'textarea') {
    config.inputRender = (props) => {
      const onChange = (value) =>
        props.onChange({ ...props.value, value: value === '' ? options.emptyValue : value });
      return <TextEditorInput {...props} value={props?.value?.value} onChange={onChange} />;
    };
  }

  function _onChange(e) {
    onChange(map(e, 'value'));
  }

  return (
    <>
      <ListInput
        label={uiSchema['ui:title'] || title}
        help={help}
        description={uiSchema['ui:description'] || schema.description}
        required={required}
        readonly={readonly}
        disabled={disabled}
        canAdd={canAdd}
        addButtonLabel={t('add')}
        value={map(formData, (item) => ({ value: item }))}
        listRender={(e) => <ListItem {...e} itemValueRender={ItemValueRender} />}
        error={rawErrors ? rawErrors[0] : null}
        onChange={_onChange}
        valueKey="value"
        {...config}
      />
    </>
  );

   */
};

ListField.propTypes = {
  schema: PropTypes.any,
  onChange: PropTypes.func,
};

export { ListField };
