import { Box, HtmlText, TableInput, TextInput } from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { ellipsis } from '@common';
import PropTypes from 'prop-types';
import React from 'react';

function CurriculumListSubItems({ row, selectedRow, t, values, inputType, onChange }) {
  const subColumns = React.useMemo(
    () => [
      {
        Header: t('newItemOf'),
        accessor: 'value',
        input: {
          node: inputType === 'field' ? <TextInput required /> : <TextEditorInput required />,
          rules: { required: t('fieldRequired') },
        },
        cellTdStyle: {
          backgroundColor: 'transparent',
        },
        valueRender: (e) => <HtmlText>{e}</HtmlText>,
      },
    ],
    [values]
  );

  subColumns[0].Header = t('newItemOf', {
    name: ellipsis(`${row.values.order} ${row.values.value}`, 36),
  });

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
        disabled={row.id !== selectedRow?.id}
        onChange={(e) => {
          values[row.index].childrens = e;
          onChange(values);
        }}
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
  row: PropTypes.any,
  selectedRow: PropTypes.any,
  t: PropTypes.any,
  values: PropTypes.any,
  inputType: PropTypes.string,
  onChange: PropTypes.func,
};

export default CurriculumListSubItems;
