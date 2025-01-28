import { useMemo } from "react";

import {ImageLoader} from "@bubbles-ui/components"
import { keyBy } from "lodash";

import useActivities from "@scores/components/EvaluationNotebook/ScoresTable/hooks/useActivities";
import useAcademicCalendarDates from "@scores/components/__DEPRECATED__/ScoresPage/Filters/hooks/useAcademicCalendarDates";
import useWeights from "@scores/requests/hooks/queries/useWeights";

export default function useActivitiesData({ class: klass }) {
  const { data: weights, isLoading: weightsLoading } = useWeights({ classId: klass.id, enabled: !!klass });
  const { startDate, endDate  } = useAcademicCalendarDates({ selectedClass: klass });
  const { activities, isLoading: activitiesLoading } = useActivities({
    program: klass?.program,
    class: klass,
    period: { startDate, endDate },
    filters: { search: '', searchType: 'activity', showNonEvaluable: false },
  });

  const weightsByActivity = keyBy(weights?.weights, 'id');

  const data = useMemo(() => {
    if (!activities?.length) return [];

    return activities?.map((activity) => {
      return ({
        id: activity.id,
        name: activity.name,
        icon: !!activity.roleIcon && <ImageLoader src={activity.roleIcon} />,

        weight: weightsByActivity[activity.id]?.weight ?? 0,
        isLocked: weightsByActivity[activity.id]?.isLocked ?? false,
      });
    });
  }, [activities, weightsByActivity]);

  return { isLoading: activitiesLoading || weightsLoading || startDate === undefined, data };
}
