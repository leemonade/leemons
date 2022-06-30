function columnToIndex(column) {
  const A = 'A'.charCodeAt(0) - 1;
  const radix = 'Z'.charCodeAt(0) - A;

  return [...column].reduce((sum, char) => {
    const charCode = char.charCodeAt(0);
    return sum * radix + charCode - A;
  }, 0);
}

export default function cellToIndexes(cell) {
  const row = parseInt(/[0-9]{1,}/.exec(cell), 10);
  const column = /[a-zA-Z]{1,}/.exec(cell)[0].toUpperCase();
  const columnIndex = columnToIndex(column);

  return {
    row,
    column,
    columnIndex,
  };
}
