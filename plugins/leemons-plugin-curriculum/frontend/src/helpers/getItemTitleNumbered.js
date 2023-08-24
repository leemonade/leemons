import { TAGIFY_TAG_REGEX } from '@bubbles-ui/components';
import { numberToEncodedLetter } from '@common';

// eslint-disable-next-line import/prefer-default-export
export function getItemTitleNumbered(blockData, values, index, onlyNumber, item) {
  if (values?.metadata?.initNumber) {
    if (blockData.listOrdered === 'style-1' || blockData.groupListOrdered === 'style-1') {
      return values.metadata.initNumber + index;
    }
    if (blockData.listOrdered === 'style-2' || blockData.groupListOrdered === 'style-2') {
      return numberToEncodedLetter(values.metadata.initNumber + index);
    }
    if (blockData.listOrdered === 'custom' || blockData.groupListOrdered === 'custom') {
      let finalText = blockData.listOrderedText;
      let array;
      // eslint-disable-next-line no-cond-assign
      while ((array = TAGIFY_TAG_REGEX.exec(blockData.listOrderedText)) !== null) {
        const json = JSON.parse(array[0])[0][0];
        if (json.numberingStyle) {
          if (json.numberingStyle === 'style-1') {
            const n = (values.metadata.initNumber + index)
              .toString()
              .padStart(json.numberingDigits, '0');
            if (onlyNumber) {
              finalText = n;
            } else {
              finalText = finalText.replace(array[0], n);
            }
          }
          if (json.numberingStyle === 'style-2') {
            const n = numberToEncodedLetter(values.metadata.initNumber + index);
            if (onlyNumber) {
              finalText = n;
            } else {
              finalText = finalText.replace(array[0], n);
            }
          }
        } else if (item) {
          finalText = finalText.replace(array[0], item[json.id]);
        }
      }
      return finalText;
    }
  }
  return null;
}
