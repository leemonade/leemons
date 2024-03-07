export function getScaleLabel(item) {
  return item.letter
    ? `${item.number} [${item.letter}] ${item.description ? `(${item.description})` : ''}`
    : `${item.number} ${item.description ? `(${item.description})` : ''}`;
}
