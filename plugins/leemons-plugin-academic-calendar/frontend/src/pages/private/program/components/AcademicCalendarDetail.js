import Step1 from '@academic-calendar/pages/private/program/components/Step1';
import Step2 from '@academic-calendar/pages/private/program/components/Step2';
import Step3 from '@academic-calendar/pages/private/program/components/Step3';
import {
  getConfigRequest,
  listRegionalConfigsRequest,
  saveConfigRequest,
} from '@academic-calendar/request';
import { detailProgram } from '@academic-portfolio/request/programs';
import { ContextContainer, createStyles, HorizontalStepper } from '@bubbles-ui/components';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import listCenters from '@users/request/listCenters';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

const useStyle = createStyles((theme) => ({
  root: {
    padding: theme.spacing[5],
    // maxWidth: 700,
    width: '100%',
  },
}));

export default function AcademicCalendarDetail({ program: { id }, onSave, t }) {
  const { classes } = useStyle();
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const [store, render] = useStore({
    loading: true,
    step: 0,
  });

  async function submit() {
    try {
      store.saving = true;
      render();
      await saveConfigRequest({ ...store.config, program: store.program.id });
      addSuccessAlert(t('configSaved'));
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
    store.saving = false;
    render();
  }

  async function load() {
    try {
      store.loading = true;
      render();
      const [
        { config },
        { program },
        {
          data: { items: centers },
        },
      ] = await Promise.all([
        getConfigRequest(id),
        detailProgram(id),
        listCenters({ page: 0, size: 99999 }),
      ]);
      const { regionalConfigs } = await listRegionalConfigsRequest(program.centers[0]);

      store.centersById = _.keyBy(centers, 'id');
      store.regionalConfigs = regionalConfigs;
      store.program = program;
      store.program.centers = _.map(
        store.program.centers,
        (centerId) => store.centersById[centerId]
      );
      store.config = config || {};
      if (_.isObject(store.config.regionalConfig)) {
        store.config.regionalConfig = store.config.regionalConfig.id;
      }
      if (store.config?.courseDates) {
        _.forIn(store.config.courseDates, (e) => {
          e.startDate = new Date(e.startDate);
          e.endDate = e.endDate ? new Date(e.endDate) : e.endDate;
        });
      }
      if (store.config?.courseEvents) {
        _.forIn(store.config.courseEvents, (val) => {
          _.forEach(val, (e) => {
            e.startDate = new Date(e.startDate);
            e.endDate = e.endDate ? new Date(e.endDate) : e.endDate;
          });
        });
      }
      if (store.config?.substagesDates) {
        _.forIn(store.config.substagesDates, (val) => {
          _.forIn(val, (e) => {
            e.startDate = new Date(e.startDate);
            e.endDate = e.endDate ? new Date(e.endDate) : e.endDate;
          });
        });
      }
      if (store.program.moreThanOneAcademicYear) {
        store.config.allCoursesHaveSameConfig = true;
      }
      store.step = 0;
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
    store.loading = false;
    render();
  }

  React.useEffect(() => {
    if (id) load();
  }, [id]);

  return (
    <ContextContainer divided className={classes.root}>
      <ContextContainer>
        <HorizontalStepper
          data={[{ label: t('basic') }, { label: t('periods') }, { label: t('preview') }]}
          currentStep={store.step}
        />
        {store.step === 0 ? (
          <Step1
            regionalConfigs={store.regionalConfigs}
            config={store.config}
            program={store.program}
            onChange={(data) => {
              store.config = data;
              store.step = 1;
              render();
            }}
            t={t}
          />
        ) : null}
        {store.step === 1 ? (
          <Step2
            config={store.config}
            program={store.program}
            onPrev={(data) => {
              store.config = data;
              store.step = 0;
              render();
            }}
            onChange={(data) => {
              store.config = data;
              store.step = 2;
              render();
            }}
            t={t}
          />
        ) : null}
        {store.step === 2 ? (
          <Step3
            regionalConfigs={store.regionalConfigs}
            config={store.config}
            program={store.program}
            onPrev={() => {
              store.step = 1;
              render();
            }}
            onSave={onSave}
            t={t}
          />
        ) : null}
      </ContextContainer>
    </ContextContainer>
  );
}

AcademicCalendarDetail.propTypes = {
  program: PropTypes.any,
  onSave: PropTypes.func,
  t: PropTypes.func,
};
