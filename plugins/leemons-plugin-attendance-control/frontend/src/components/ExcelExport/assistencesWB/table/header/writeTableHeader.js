import { map } from 'lodash';
import { arrayToContent } from '../../../helpers';
import { getStyle } from './getStyle';

function parseActivities({ activities, labels }) {
  return activities.map((activity) => ({
    type: activity?.activity?.assignable?.role,
    evaluation: activity?.type === 'calificable' ? labels.calificable : labels.noCalificable,
    name: activity.name,
    deadline: new Date(activity.deadline),
    weight: activity.weight,
  }));
}

/**
 *
 * @param {{
 * ws: import("exceljs").Worksheet
 * }} param0
 */
export default function writeHeader({ ws, activities, labels, types, initialPosition }) {
  const parsedactivities = parseActivities({ activities, labels });

  const contentArray = [
    [labels.type, ...parsedactivities.map((activity) => types[activity.type]), '', ''],
    [labels.evaluation, ...map(parsedactivities, 'evaluation'), '', ''],
    [labels.activity, ...map(parsedactivities, 'name'), '', ''],
    [labels.deadline, ...map(parsedactivities, 'deadline'), '', ''],
    [
      labels.weight,
      ...map(parsedactivities, 'weight'),
      labels.avg.toLocaleUpperCase(),
      labels.custom.toLocaleUpperCase(),
    ],
  ];

  arrayToContent({
    ws,
    array: contentArray,
    initialPosition,
    getStyle: getStyle({ ws, contentArray, labels }),
  });
}
