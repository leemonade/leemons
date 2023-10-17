import { getCustomNamesRange } from '../../../helpers';

export default function addConditionalFormatting({ ws }) {
  ws.addConditionalFormatting({
    ref: getCustomNamesRange({ ws, name: 'types' }),
    rules: [
      {
        type: 'cells',
        formulae: [`${getCustomNamesRange({ ws, name: 'types' }).split(':')[0]} = "${'partial'}"`],
        style: {
          font: {
            color: {
              argb: 'A9AAAD',
            },
          },
        },
      },
      {
        type: 'expression',
        formulae: [`${getCustomNamesRange({ ws, name: 'types' }).split(':')[0]} <> "${'partial'}"`],
        style: {
          font: {
            color: {
              argb: 'C53929',
            },
          },
        },
      },
    ],
  });
}
