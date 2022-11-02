import { getCustomNamesRange } from '../../../helpers';

export default function addConditionalFormatting(ws) {
  const scoresRules = [
    {
      type: 'expression',
      formulae: [
        `${
          getCustomNamesRange({ ws, name: 'types', rowFixed: true }).split(':')[0]
        }<>"calificable"`,
      ],
      style: {
        fill: {
          type: 'pattern',
          bgColor: {
            argb: 'F2F3F2',
          },
        },
        font: {
          color: {
            argb: '000000',
          },
        },
      },
    },
    {
      type: 'cellIs',
      operator: 'lessThan',
      formulae: [5],
      style: {
        fill: {
          type: 'pattern',
          bgColor: {
            argb: 'FFFFFF',
          },
        },
        font: {
          color: {
            argb: 'CD0201',
          },
        },
      },
    },
    {
      type: 'cellIs',
      operator: 'equal',
      formulae: [5],
      style: {
        fill: {
          type: 'pattern',
          bgColor: {
            argb: 'FFFFFF',
          },
        },
        font: {
          color: {
            argb: '000000',
          },
        },
      },
    },
    {
      type: 'cellIs',
      operator: 'greaterThan',
      formulae: [5],
      style: {
        fill: {
          type: 'pattern',
          bgColor: {
            argb: 'FFFFFF',
          },
        },
        font: {
          color: {
            argb: '000000',
          },
        },
      },
    },
  ];

  ws.addConditionalFormatting({
    ref: getCustomNamesRange({ ws, name: 'scores' }),
    rules: scoresRules,
  });

  const [, ...avgScoresRules] = scoresRules.map((rule) => ({
    ...rule,
    style: {
      ...rule.style,
      fill: {
        type: 'pattern',
        bgColor: {
          argb: 'F1F9FE',
        },
      },
    },
  }));

  ws.addConditionalFormatting({
    ref: getCustomNamesRange({ ws, name: 'avgScores' }),
    rules: avgScoresRules,
  });

  ws.addConditionalFormatting({
    ref: getCustomNamesRange({ ws, name: 'customScores' }),
    rules: avgScoresRules,
  });
}
