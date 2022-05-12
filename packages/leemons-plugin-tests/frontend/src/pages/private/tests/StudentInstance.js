import React from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useStore } from '@common';
import { useParams } from 'react-router-dom';
import { addErrorAlert } from '@layout/alert';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import { getProgramEvaluationSystemRequest } from '@academic-portfolio/request';
import { isString } from 'lodash';
import { Box, COLORS } from '@bubbles-ui/components';
import { HeaderBackground, TaskHeader } from '@bubbles-ui/leemons';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import { StudentInstanceStyles } from './StudentInstance.style';

export default function StudentInstance() {
  const [t] = useTranslateLoader(prefixPN('testsDetail'));
  const [store, render] = useStore({
    loading: true,
    isFirstStep: true,
  });

  const { classes } = StudentInstanceStyles(
    { isFirstStep: store.isFirstStep },
    { name: 'TaskDoing' }
  );

  const params = useParams();

  async function init() {
    try {
      store.instance = await getAssignableInstance({ id: params.id });
      const { evaluationSystem } = await getProgramEvaluationSystemRequest(
        store.instance.assignable.subjects[0].program
      );
      store.evaluationSystem = evaluationSystem;

      console.log(store);

      store.loading = false;
      render();
    } catch (error) {
      console.log(error);
      addErrorAlert(error);
    }
  }

  React.useEffect(() => {
    if (params?.id) init();
  }, [params]);

  const headerProps = React.useMemo(() => {
    if (store.instance) {
      if (store.instance.assignable.asset.cover) {
        return {
          blur: 10,
          withBlur: true,
          image: getFileUrl(
            isString(store.instance.assignable.asset.cover)
              ? store.instance.assignable.asset.cover
              : store.instance.assignable.asset.cover.id
          ),
          backgroundPosition: 'center',
        };
      }
      return {
        withBlur: false,
        withGradient: false,
        color: store.instance.assignable.asset.color,
      };
    }
    return {};
  }, [store.instance]);

  const taskHeaderProps = React.useMemo(() => {
    if (store.instance) {
      return {
        title: store.instance.assignable.asset.name,
        styles: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: store.isFirstStep && '50%',
          borderRadius: store.isFirstStep ? '16px 16px 0 0' : 0,
          backgroundColor: store.isFirstStep ? COLORS.mainWhite : COLORS.interactive03,
        },
      };
    }
    return {};
  }, [store.instance, store.isFirstStep]);

  if (store.loading) {
    return null;
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <HeaderBackground
          styles={{
            position: 'absolute',
            zIndex: -1,
          }}
          {...headerProps}
        />
        <TaskHeader {...taskHeaderProps} size={store.isFirstStep ? 'md' : 'sm'} />
        {/* <TaskDeadline {...taskDeadlineProps} size={store.isFirstStep ? 'md' : 'sm'} /> */}
      </Box>
      {/* <Box className={classes.mainContent}>
        <Box className={classes.verticalStepper}>
          <VerticalStepper {...mock.verticalStepper} currentStep={currentStep} />
        </Box>
        <Box className={classes.pages}>{mock.pages[currentStep](classes, nextStep, prevStep)}</Box>
      </Box> */}
    </Box>
  );
}
