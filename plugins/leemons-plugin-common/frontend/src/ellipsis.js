export function ellipsis(text, maxString, ellipsisText = '...') {
  if (text?.length > maxString) {
    return `${text.substring(0, maxString)}${ellipsisText}`;
  }
  return text;
}
