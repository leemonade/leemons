import {
  ActionButton,
  Box,
  Button,
  ContextContainer,
  createStyles,
  HtmlText,
  Stack,
  Text,
  TextInput,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { DeleteBinIcon, EditWriteIcon } from '@bubbles-ui/icons/solid';
import { htmlToText, useStore } from '@common';
import { TagRelation } from '@curriculum/components/FormTheme/TagRelation';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import CurriculumListSubItems from './CurriculumListSubItems';

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

function CurriculumListItem({
  isEditMode = true,
  label,
  defaultValues,
  schema,
  blockData,
  onSave,
  onCancel,
  onRemove,
  onEdit,
  preview,
  curriculum,
  id,
  t,
}) {
  const { classes } = useStyle();
  const [store, render] = useStore();
  const form = useForm({ defaultValues });
  const values = form.watch();

  function _onSave(silent) {
    form.handleSubmit((formValues) => {
      onSave(formValues, silent);
    })();
  }

  React.useEffect(() => {
    if (_.isArray(blockData.contentRelations)) {
      /*
      const parent = _.find(blockData.contentRelations, {
        typeOfRelation: 'parent',
      });
      if (parent) {
        const ids = parent.relatedTo.split('|');
        const nodeLevelId = ids[0];
        const formValueId = ids[1];
        const node = _.find(parentNodes, { nodeLevel: nodeLevelId });
        const nodeValue = node.formValues[formValueId];
        if (nodeValue) {
          const nodeLevel = _.find(curriculum.nodeLevels, { id: nodeLevelId });
          store.parentNodeValue = nodeValue;
          store.selectParentName = `${nodeLevel.name} - ${node.name}`;
          if (_.isArray(nodeValue)) {
            store.type = 'select';
            store.selectData = _.map(nodeValue, (v) => ({ label: v.value, value: v.id }));
          } else {
            store.type = 'input';
            onChangeParent(nodeValue.id);
          }
          render();
        }
      }

       */
    }
  }, []);

  const valueRules = {
    required: t('fieldRequired'),
  };

  if (blockData.max)
    valueRules.validate = (e) => {
      const text = htmlToText(e);
      if (text.length > blockData.max) {
        return t('maxLength', { max: blockData.max });
      }
    };

  if (preview) {
    const tags = (
      <Controller
        control={form.control}
        name="metadata.tagRelated"
        render={({ field }) => (
          <TagRelation
            {...field}
            curriculum={curriculum}
            blockData={blockData}
            isShow={(e) => {
              store.showSaveButton = e;
              render();
            }}
            readonly
            id={id}
            t={t}
          />
        )}
      />
    );
    return (
      <Box className={classes.card}>
        <Box sx={(theme) => ({ marginBottom: theme.spacing[3] })}>
          {label ? (
            <Text color="primary" role="productive" size="md" strong>
              {label}
            </Text>
          ) : null}
          {isEditMode ? (
            <Box className={classes.editButton}>
              <ActionButton tooltip={t('edit')} icon={<EditWriteIcon />} onClick={onEdit} />
              <ActionButton tooltip={t('remove')} icon={<DeleteBinIcon />} onClick={onRemove} />
            </Box>
          ) : null}
        </Box>
        {!isEditMode ? (
          <Box sx={(theme) => ({ marginBottom: theme.spacing[3] })}>{tags}</Box>
        ) : null}
        <Box sx={() => ({ maxHeight: 200, overflow: 'auto' })}>
          {blockData.listType === 'field' ? (
            <Text color="primary" role="productive">
              {defaultValues.value}
            </Text>
          ) : null}
          {blockData.listType === 'textarea' ? <HtmlText>{defaultValues.value}</HtmlText> : null}
        </Box>
        {isEditMode ? <Box sx={(theme) => ({ marginTop: theme.spacing[3] })}>{tags}</Box> : null}

        {values.childrens?.length ? (
          <CurriculumListSubItems
            inputType={blockData.groupListType}
            values={[values]}
            t={t}
            disabled={true}
            row={{
              values,
              id: '1',
              index: 0,
            }}
            onChange={([e]) => {
              form.setValue('childrens', e.childrens);
            }}
          />
        ) : null}
      </Box>
    );
  }

  return (
    <ContextContainer className={classes.card}>
      <Controller
        control={form.control}
        name="value"
        rules={valueRules}
        render={({ field }) => {
          if (blockData.listType === 'field') {
            return <TextInput {...field} error={form.formState.errors.value} label={label} />;
          }
          if (blockData.listType === 'textarea') {
            return <TextEditorInput {...field} error={form.formState.errors.value} label={label} />;
          }
        }}
      />
      <Controller
        control={form.control}
        name="metadata.tagRelated"
        render={({ field }) => (
          <TagRelation
            {...field}
            curriculum={curriculum}
            blockData={blockData}
            isShow={(e) => {
              store.showSaveButton = e;
              render();
            }}
            id={id}
            t={t}
          />
        )}
      />
      <CurriculumListSubItems
        inputType={blockData.groupListType}
        values={[values]}
        t={t}
        selectedRow={{
          id: '1',
        }}
        row={{
          values,
          id: '1',
          index: 0,
        }}
        addable={true}
        onChange={([e]) => {
          form.setValue('childrens', e.childrens);
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

CurriculumListItem.defaultProps = {
  defaultValues: {},
};

CurriculumListItem.propTypes = {
  t: PropTypes.func,
  onEdit: PropTypes.func,
  onSave: PropTypes.func,
  isEditMode: PropTypes.bool,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func,
  schema: PropTypes.any,
  preview: PropTypes.bool,
  blockData: PropTypes.any,
  defaultValues: PropTypes.any,
  curriculum: PropTypes.any,
  id: PropTypes.any,
};

export default CurriculumListItem;
