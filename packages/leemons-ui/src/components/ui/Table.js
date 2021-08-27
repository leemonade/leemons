import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { useTable } from 'react-table';
import update from 'immutability-helper';
import Checkbox from './Checkbox';

function Cell({ cell, onChangeCell }) {
  function onCheckedChange(event) {
    onChangeCell(cell, { ...cell, value: { ...cell.value, checked: event.target.checked } });
  }

  // Custom
  if (_.isFunction(cell.value)) {
    return cell.value();
  }
  if (_.isObject(cell.value)) {
    // Checkbox
    if (cell.value.type === 'checkbox') {
      return (
        <div
          className={`flex flex-row justify-center py-3 px-4 ${
            cell.value.checked ? 'bg-primary-100' : ''
          }`}
        >
          <Checkbox color="primary" checked={cell.value.checked} onChange={onCheckedChange} />
        </div>
      );
    }
  }
  // Default
  return <div className="text-sm py-3 px-4">{cell.render('Cell')}</div>;
}

function Table({ columns, data, setData, onChangeData = () => {} }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  function onChangeCell(oldCell, newCell) {
    const newData = update(data, {
      [oldCell.row.index]: { [oldCell.column.id]: { $merge: newCell.value } },
    });

    setData(newData);
    onChangeData({
      changedField: oldCell.column.id,
      oldData: data,
      newData,
      oldItem: oldCell.value,
      newItem: newCell.value,
      itemIndex: oldCell.row.index,
    });
  }

  // Render the UI for your table
  return (
    <table
      {...getTableProps({
        className: 'w-full',
      })}
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr
            {...headerGroup.getHeaderGroupProps({
              className: 'border-b border-base-300',
            })}
          >
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps({
                  className: `text-sm weigth-semibold py-3 px-4 text-secondary ${column.className}`,
                  style: column.style,
                })}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr
              {...row.getRowProps({
                className: 'border-b border-base-300',
              })}
            >
              {row.cells.map((cell, index) => {
                return (
                  <td
                    {...cell.getCellProps({
                      className: 'm-0 p-0',
                    })}
                  >
                    <Cell cell={cell} onChangeCell={onChangeCell} />
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  onChangeData: PropTypes.func,
  setData: PropTypes.func.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string,
      accessor: PropTypes.string,
    })
  ),
};

export default Table;
