import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionButton,
  Box,
  Button,
  ContextContainer,
  createStyles,
  HtmlText,
  Stack,
  Table,
  TableInput,
  TAGIFY_TAG_REGEX,
  Text,
  TextInput,
} from '@bubbles-ui/components';
import { isArray } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { TextEditorInput } from '@bubbles-ui/editors';
import { useStore } from '@common';
import { EditWriteIcon } from '@bubbles-ui/icons/solid';

const useStyle = createStyles((theme) => ({
  card: {
    border: `1px solid ${theme.colors.ui01}`,
    borderRadius: '8px',
    overflow: 'hidden',
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    right: theme.spacing[2],
    top: theme.spacing[2],
  },
}));

function CurriculumGroupItem({
  defaultValues,
  schema,
  blockData,
  onSave,
  onCancel,
  onRemove,
  onEdit,
  preview,
  item,
  t,
}) {
  const { classes } = useStyle();
  const [store, render] = useStore();
  const form = useForm({ defaultValues });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [preview, blockData, defaultValues]);

  function _onSave() {
    form.handleSubmit((formValues) => {
      onSave(formValues);
    })();
  }

  function getTitle() {
    let finalText = blockData.showAs;
    let array;
    while ((array = TAGIFY_TAG_REGEX.exec(blockData.showAs)) !== null) {
      const json = JSON.parse(array[0])[0][0];
      finalText = finalText.replace(array[0], item[json.id]);
    }
    return finalText;
  }

  const columns = React.useMemo(() => {
    const rules = { required: t('fieldRequired') };
    if (blockData.groupMax) {
      rules.pattern = {
        message: t('maxLength', { max: blockData.groupMax }),
        value: new RegExp(`^.{0,${blockData.groupMax}}$`, 'g'),
      };
    }
    const result = [];

    if (!blockData.groupListOrdered || blockData.groupListOrdered !== 'not-ordered') {
      result.push({
        Header: ' ',
        accessor: 'order',
      });
    }

    result.push({
      Header: t('newItemList'),
      accessor: 'value',
      input: {
        node:
          blockData.groupListType === 'field' ? (
            <TextInput required />
          ) : (
            <TextEditorInput required />
          ),
        rules,
      },
    });

    return result;
  }, []);

  if (preview) {
    return (
      <Box className={classes.card}>
        <Box sx={(theme) => ({ marginBottom: theme.spacing[3] })}>
          <Text color="primary" role="productive" size="md" strong>
            {getTitle()}
          </Text>
          <Box className={classes.editButton}>
            <ActionButton tooltip={t('edit')} icon={<EditWriteIcon />} onClick={onEdit} />
          </Box>
        </Box>
        <Box>
          {blockData.groupTypeOfContents === 'field' ? (
            <Text color="primary" role="productive">
              {defaultValues.value}
            </Text>
          ) : null}
          {blockData.groupTypeOfContents === 'textarea' ? (
            <HtmlText>{defaultValues.value}</HtmlText>
          ) : null}
          {blockData.groupTypeOfContents === 'list' && defaultValues.value?.length ? (
            <Table
              data={defaultValues.value}
              columns={columns.map((col) => ({ ...col, Header: ' ' }))}
            />
          ) : null}
        </Box>
      </Box>
    );
  }

  return (
    <ContextContainer className={classes.card}>
      <Box sx={(theme) => ({ marginBottom: theme.spacing[3] })}>
        <Text color="primary" role="productive" size="md" strong>
          {getTitle()}
        </Text>
      </Box>
      <Controller
        control={form.control}
        name="value"
        rules={{
          required: t('fieldRequired'),
        }}
        render={({ field }) => {
          if (blockData.groupTypeOfContents === 'field') {
            return <TextInput {...field} error={form.formState.errors.value} />;
          }
          if (blockData.groupTypeOfContents === 'textarea') {
            return <TextEditorInput {...field} error={form.formState.errors.value} />;
          }
          if (blockData.groupTypeOfContents === 'list') {
            const val = isArray(field.value) ? field.value : [];
            return (
              <TableInput
                data={val}
                onChange={(e) => {
                  field.onChange(e);
                }}
                columns={columns}
                editable
                resetOnAdd
                sortable
                removable
                labels={{
                  add: t('add'),
                  remove: t('remove'),
                  edit: t('edit'),
                  accept: t('accept'),
                  cancel: t('cancel'),
                }}
              />
            );
          }
        }}
      />
      <Stack justifyContent="space-between" fullWidth>
        <Button variant="link" onClick={onCancel} loading={store.loading}>
          {t('cancel')}
        </Button>
        <Button variant="outline" onClick={_onSave} loading={store.loading}>
          {defaultValues?.value ? t('update') : t('add')}
        </Button>
      </Stack>
    </ContextContainer>
  );
}

CurriculumGroupItem.defaultProps = {
  defaultValues: {},
};

CurriculumGroupItem.propTypes = {
  t: PropTypes.func,
  item: PropTypes.any,
  onEdit: PropTypes.func,
  onSave: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func,
  schema: PropTypes.any,
  preview: PropTypes.bool,
  blockData: PropTypes.any,
  defaultValues: PropTypes.any,
};

export default CurriculumGroupItem;
