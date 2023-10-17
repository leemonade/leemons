import { Box, Button, HtmlText, TableInput, TextInput } from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { ArrowChevDownIcon, ArrowChevUpIcon } from '@bubbles-ui/icons/solid';
import { ellipsis, useStore } from '@common';
import { htmlToText } from '@tests/pages/private/tests/StudentInstance/helpers/htmlToText';
import PropTypes from 'prop-types';
import React from 'react';

import _ from 'lodash';

function CurriculumListSubItems({
  addable = false,
  row,
  selectedRow,
  t,
  disabled,
  values,
  inputType,
  onChange,
  onSave = () => {},
}) {
  const [store, render] = useStore({
    rowsExpanded: [],
  });

  function _onSave() {
    store.subRow = null;
    onSave();
    render();
  }

  const subColumns = React.useMemo(() => {
    const columns = [];
    let hasChilds = false;
    _.forEach(values[row.index].childrens, (val) => {
      if (val.childrens?.length) {
        hasChilds = true;
        return false;
      }
    });

    if (hasChilds && !store.subRow) {
      columns.push({
        Header: ' ',
        accessor: 'open',
        editable: false,
        Cell: (e) => {
          if (!values[row.index].childrens[e.row.index]?.childrens?.length) {
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
    columns.push({
      Header: t('newItemOf', {
        name: ellipsis(
          `${row.values.order ? row.values.order : ''} ${htmlToText(row.values.value)}`,
          36
        ),
      }),
      accessor: 'value',
      input: {
        node: inputType === 'field' ? <TextInput required /> : <TextEditorInput required />,
        rules: { required: t('fieldRequired') },
      },
      cellTdStyle: {
        backgroundColor: 'transparent',
      },
      valueRender: (v, element) => {
        if (store.subRow) {
          const _item = values[row.index].childrens?.[store.subRow.index];
          if (_item?.value === element.value) {
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
                    _onSave();
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
    return columns;
  }, [values]);

  if (store.subRow) {
    if (!store.rowsExpanded.includes(store.subRow.id)) {
      store.rowsExpanded.push(store.subRow.id);
    }
  }

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.colors.uiBackground02,
        padding:
          row.id === selectedRow?.id
            ? theme.spacing[6]
            : `${theme.spacing[0]}px ${theme.spacing[6]}px ${theme.spacing[3]}px ${theme.spacing[6]}px`,
      })}
    >
      <TableInput
        data={values?.[row.index].childrens || []}
        editable
        resetOnAdd
        sortable
        removable
        rowStyles={{ backgroundColor: 'transparent!important' }}
        showHeaders={row.id === selectedRow?.id}
        addable={addable}
        disabled={!!store.subRow || row.id !== selectedRow?.id || disabled}
        onItemAdd={(r) => {
          store.subRow = r;
          render();
        }}
        rowsExpanded={store.rowsExpanded}
        onChange={(e) => {
          values[row.index].childrens = e;
          onChange(values);
        }}
        renderRowSubComponent={({ row: r }) => (
          <CurriculumListSubItems
            inputType={inputType}
            values={values[row.index].childrens}
            t={t}
            selectedRow={store.subRow}
            row={r}
            onChange={(e) => {
              values[row.index].childrens = e;
              onChange(values);
            }}
          />
        )}
        columns={subColumns}
        labels={{
          add: t('add'),
          remove: t('remove'),
          edit: t('edit'),
          accept: t('accept'),
          cancel: t('cancel'),
        }}
      />
    </Box>
  );
}

CurriculumListSubItems.propTypes = {
  addable: PropTypes.bool,
  row: PropTypes.any,
  selectedRow: PropTypes.any,
  t: PropTypes.any,
  values: PropTypes.any,
  inputType: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  onSave: PropTypes.func,
};

export default CurriculumListSubItems;
