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
import { TextEditorInput } from '@bubbles-ui/editors';
import { ArrowChevDownIcon, ArrowChevUpIcon, EditWriteIcon } from '@bubbles-ui/icons/solid';
import { htmlToText, numberToEncodedLetter, useStore } from '@common';
import { StartNumbering } from '@curriculum/components/FormTheme/StartNumbering';
import { TagRelation } from '@curriculum/components/FormTheme/TagRelation';
import { getItemTitleNumberedWithParents } from '@curriculum/helpers/getItemTitleNumberedWithParents';
import _, { forEach, isArray, isNumber } from 'lodash';
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

function CurriculumGroupItem({
  defaultValues,
  curriculum,
  parentRelated,
  id,
  isEditMode = true,
  blockData,
  onSave,
  onCancel: _onCancel,
  onEdit,
  preview,
  item,
  t,
}) {
  const { classes } = useStyle();
  const [store, render] = useStore({
    rowsExpanded: [],
  });
  const form = useForm({ defaultValues });
  const values = form.watch();
  const initNumber = form.watch('metadata.initNumber');

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [JSON.stringify(preview), JSON.stringify(blockData), JSON.stringify(defaultValues)]);

  function onExit() {
    if (store.subRow) {
      const index = store.rowsExpanded.indexOf(store.subRow.id);
      if (index >= 0) {
        store.rowsExpanded.splice(index, 1);
      }
    }
    store.subRow = null;
  }

  function onCancel() {
    onExit();
    _onCancel();
  }

  function _onSave(close = true) {
    form.handleSubmit((formValues) => {
      onExit();
      onSave(formValues, close);
    })();
  }

  function getTitle(index, text = 'showAs') {
    let finalText = blockData[text];
    let array;
    while ((array = TAGIFY_TAG_REGEX.exec(blockData[text])) !== null) {
      const json = JSON.parse(array[0])[0][0];
      if (json.numberingStyle && isNumber(index)) {
        if (json.numberingStyle === 'style-1') {
          finalText = finalText.replace(
            array[0],
            (initNumber + index).toString().padStart(json.numberingDigits, '0')
          );
        }
        if (json.numberingStyle === 'style-2') {
          finalText = finalText.replace(array[0], numberToEncodedLetter(initNumber + index));
        }
      } else {
        finalText = finalText.replace(array[0], item[json.id]);
      }
    }
    return finalText;
  }

  const customNumberingStyle = React.useMemo(() => {
    let result = null;
    if (blockData.listOrderedText) {
      let array;
      // eslint-disable-next-line no-cond-assign
      while ((array = TAGIFY_TAG_REGEX.exec(blockData.listOrderedText)) !== null) {
        const json = JSON.parse(array[0])[0][0];
        if (json.numberingStyle) {
          result = json;
        }
      }
    }
    return result;
  }, [blockData]);

  const useOrder = React.useMemo(() => {
    if (blockData.groupListOrdered === 'style-1') {
      return 'numbers';
    }
    if (blockData.groupListOrdered === 'style-2') {
      return 'vocals';
    }
    if (blockData.groupListOrdered === 'custom' && customNumberingStyle) {
      if (customNumberingStyle.numberingStyle === 'style-1') {
        return 'numbers';
      }
      if (customNumberingStyle.numberingStyle === 'style-2') {
        return 'vocals';
      }
    }
    return null;
  }, [blockData, customNumberingStyle]);

  const columns = React.useMemo(() => {
    const rules = { required: t('fieldRequired') };
    if (blockData.groupMax) {
      rules.validate = (e) => {
        const text = htmlToText(e);
        if (text.length > blockData.groupMax) {
          return t('maxLength', { max: blockData.groupMax });
        }
      };
    }
    const result = [];
    let hasChilds = false;
    _.forEach(values.value, (val) => {
      if (val.childrens?.length) {
        hasChilds = true;
        return false;
      }
    });

    if (hasChilds && !store.subRow) {
      result.push({
        Header: ' ',
        accessor: 'open',
        Cell: (e) => {
          const vals = form.getValues('value');
          if (!vals[e.row.index]?.childrens?.length) {
            return null;
          }
          return (
            <Box
              sx={(theme) => ({
                color: theme.colors.text05,
              })}
              onClick={() => {
                const index = store.rowsExpanded.indexOf(e.row.id);
                if (index < 0) {
                  store.rowsExpanded.push(e.row.id);
                } else {
                  store.rowsExpanded.splice(index, 1);
                }
                render();
              }}
            >
              {store.rowsExpanded.includes(e.row.id) ? <ArrowChevUpIcon /> : <ArrowChevDownIcon />}
            </Box>
          );
        },
        cellStyle: {
          width: '10px',
        },
        style: {
          width: '10px',
        },
      });
    }

    if (blockData.groupListOrdered && blockData.groupListOrdered !== 'not-ordered') {
      result.push({
        Header: ' ',
        accessor: 'order',
        input: {
          node: <Box />,
        },
        cellStyle: {
          width: '100px',
        },
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
      valueRender: (v, element) => {
        if (store.subRow) {
          const vals = form.getValues('value');
          const _item = vals[store.subRow.index];

          if (_item.value === element.value) {
            return (
              <Box
                sx={() => ({
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                })}
              >
                <HtmlText>{v}</HtmlText>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => {
                    _onSave(false);
                  }}
                >
                  {t('save')}
                </Button>
              </Box>
            );
          }
        }
        return <HtmlText>{v}</HtmlText>;
      },
    });

    return result;
  }, [values.value, store.subRow]);

  function getNumbering(index) {
    return getItemTitleNumberedWithParents(
      curriculum,
      blockData,
      id,
      {
        ...values,
        metadata: { ...values?.metadata, parentRelated },
      },
      index,
      item
    );
  }

  if (preview) {
    const tag = (
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
          <Text color="primary" role="productive" size="md" strong>
            {getTitle()}
          </Text>
          {isEditMode ? (
            <Box className={classes.editButton}>
              <ActionButton tooltip={t('edit')} icon={<EditWriteIcon />} onClick={onEdit} />
            </Box>
          ) : null}
        </Box>
        {!isEditMode ? <Box sx={(theme) => ({ marginBottom: theme.spacing[3] })}>{tag}</Box> : null}
        <Box sx={() => ({ maxHeight: 200, overflow: 'auto' })}>
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
              data={_.map(defaultValues.value, (v, i) => ({
                ...v,
                order: getNumbering(i),
              }))}
              rowsExpanded={store.rowsExpanded}
              renderRowSubComponent={({ row }) => (
                <CurriculumListSubItems
                  inputType={blockData.groupListType}
                  values={values?.value}
                  t={t}
                  selectedRow={store.subRow}
                  row={row}
                />
              )}
              columns={columns.map((col) => ({ ...col, Header: ' ' }))}
            />
          ) : null}
        </Box>
        {isEditMode ? <Box sx={(theme) => ({ marginTop: theme.spacing[3] })}>{tag}</Box> : null}
      </Box>
    );
  }

  if (store.subRow) {
    if (!store.rowsExpanded.includes(store.subRow.id)) {
      store.rowsExpanded.push(store.subRow.id);
    }
  }

  return (
    <ContextContainer className={classes.card}>
      <Box sx={(theme) => ({ marginBottom: theme.spacing[3] })}>
        <Text color="primary" role="productive" size="md" strong>
          {getTitle()}
        </Text>
      </Box>
      {useOrder && isEditMode ? (
        <Controller
          control={form.control}
          name="metadata.initNumber"
          render={({ field }) => (
            <StartNumbering
              t={t}
              custom={customNumberingStyle}
              type={useOrder}
              value={values}
              onChange={(e) => {
                field.onChange(e.metadata.initNumber);
              }}
            />
          )}
        />
      ) : null}
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
            forEach(val, (v, i) => {
              v.order = getNumbering(i);
            });
            return (
              <TableInput
                data={_.cloneDeep(val)}
                onChange={(e) => {
                  field.onChange(e);
                }}
                columns={columns}
                onItemAdd={(row) => {
                  store.subRow = row;
                  render();
                }}
                rowsExpanded={store.rowsExpanded}
                addable
                editable
                resetOnAdd
                sortable
                removable
                disabled={!!store.subRow}
                renderRowSubComponent={({ row }) => (
                  <CurriculumListSubItems
                    inputType={blockData.groupListType}
                    values={values?.value}
                    t={t}
                    selectedRow={store.subRow}
                    row={row}
                    onChange={(e) => field.onChange(e)}
                  />
                )}
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
      <Stack justifyContent="space-between" fullWidth>
        <Button variant="link" onClick={onCancel} loading={store.loading}>
          {t('cancel')}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            _onSave(true);
          }}
          loading={store.loading}
        >
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
  id: PropTypes.string,
  item: PropTypes.any,
  onEdit: PropTypes.func,
  onSave: PropTypes.func,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func,
  curriculum: PropTypes.any,
  schema: PropTypes.any,
  preview: PropTypes.bool,
  blockData: PropTypes.any,
  defaultValues: PropTypes.any,
  isEditMode: PropTypes.bool,
  parentRelated: PropTypes.string,
};

export default CurriculumGroupItem;
