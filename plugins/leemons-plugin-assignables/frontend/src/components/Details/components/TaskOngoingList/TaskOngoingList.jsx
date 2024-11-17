import React, { useMemo } from 'react';
import _ from 'lodash';
import { ContextContainer } from '@bubbles-ui/components';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import {
  TASK_ONGOING_LIST_DEFAULT_PROPS,
  TASK_ONGOING_LIST_PROP_TYPES,
} from './TaskOngoingList.constants';
import useTaskOngoingInstanceParser from './hooks/useTaskOngoingInstanceParser';
import prefixPN from '../../../../helpers/prefixPN';
import StatusGraph from './components/StatusGraph/StatusGraph';
import GradesGraph from './components/GradesGraph/GradesGraph';

export function useTaskOngoingListLocalizations() {
  const [, translations] = useTranslateLoader([
    prefixPN('activity_dashboard'),
    prefixPN('activity_status'),
  ]);

  const { dashboardLocalizations, statusLocalizations } = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      return {
        dashboardLocalizations: _.get(res, prefixPN('activity_dashboard')),
        statusLocalizations: _.get(res, prefixPN('activity_status')),
      };
    }

    return {};
  }, [translations]);

  return {
    dashboardLocalizations,
    statusLocalizations,
  };
}

const TaskOngoingList = ({ instance }) => {
  const instanceData = useTaskOngoingInstanceParser(instance);
  const { dashboardLocalizations } = useTaskOngoingListLocalizations();

  return (
    <ContextContainer>
      <ContextContainer title={dashboardLocalizations?.progress}>
        <StatusGraph {...instanceData.leftScoresBar} />
      </ContextContainer>

      {!!instance.requiresScoring && (
        <ContextContainer title={dashboardLocalizations?.evaluation}>
          <GradesGraph
            {...instanceData.rightScoresBar}
            labels={{
              students: dashboardLocalizations?.students,
              califications: dashboardLocalizations?.califications,
              passed: dashboardLocalizations?.passed,
            }}
          />
        </ContextContainer>
      )}
    </ContextContainer>
  );
};

TaskOngoingList.defaultProps = TASK_ONGOING_LIST_DEFAULT_PROPS;
TaskOngoingList.propTypes = TASK_ONGOING_LIST_PROP_TYPES;

export { TaskOngoingList };
