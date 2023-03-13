import useTranslateLoader from '@multilanguage/useTranslateLoader';
import React, { useMemo } from 'react';

import { detailProgramRequest } from '@academic-portfolio/request';
import {
  Box,
  createStyles,
  HorizontalStepper,
  LoadingOverlay,
  PageContainer,
  Title,
} from '@bubbles-ui/components';
import { useStore } from '@common';
import prefixPN from '@curriculum/helpers/prefixPN';
import AddCurriculumStep0 from '@curriculum/pages/private/AddCurriculumStep0';
import AddCurriculumStep1 from '@curriculum/pages/private/AddCurriculumStep1';
import AddCurriculumStep2 from '@curriculum/pages/private/AddCurriculumStep2';
import AddCurriculumStep3 from '@curriculum/pages/private/AddCurriculumStep3';
import { detailCurriculumRequest } from '@curriculum/request';
import { getPermissionsWithActionsIfIHaveRequest, listCentersRequest } from '@users/request';
import { find } from 'lodash';
import { useHistory, useParams } from 'react-router-dom';

const useStyle = createStyles((theme) => ({
  title: {
    paddingTop: theme.spacing[5],
    paddingLeft: theme.spacing[5],
    paddingBottom: theme.spacing[6],
  },
  container: {
    paddingTop: theme.spacing[4],
    paddingLeft: theme.spacing[5],
  },
}));

function AddCurriculum() {
  const { classes } = useStyle();
  const history = useHistory();
  const [t, , , tLoading] = useTranslateLoader(prefixPN('addCurriculumBase'));
  const [store, render] = useStore({
    currentStep: 0,
  });
  const { id } = useParams();

  function onStep0({ curriculum }) {
    history.push(`/private/curriculum/${curriculum.id}`);
  }

  function onStep1() {
    store.curriculum.step = 2;
    store.currentStep = 2;
    render();
  }

  function onStep2() {
    store.curriculum.step = 3;
    store.currentStep = 3;
    render();
  }

  function onPrev3() {
    // store.curriculum.step = 2;
    store.currentStep = 2;
    render();
  }

  async function load() {
    try {
      store.loading = true;
      render();
      const [
        { curriculum: c },
        {
          data: { items: centers },
        },
        {
          permissions: [{ actionNames }],
        },
      ] = await Promise.all([
        detailCurriculumRequest(id),
        listCentersRequest({ page: 0, size: 999999 }),
        getPermissionsWithActionsIfIHaveRequest(['plugins.curriculum.curriculum']),
      ]);

      const isEditMode = actionNames.includes('admin') || actionNames.includes('edit');

      const { program } = await detailProgramRequest(c.program);

      c.program = program;
      c.center = find(centers, { id: c.center });

      store.isEditMode = isEditMode;
      store.curriculum = c;
      store.currentStep = store.curriculum.step || 1;
    } catch (e) {
      // Nothing
    }
    store.loading = false;
    render();
  }

  const stepperConfig = useMemo(
    () => ({
      currentStep: store.currentStep,
      allowStepClick: false,
      data: [
        { label: t('basic'), status: 'OK' },
        { label: t('config'), status: 'OK' },
        { label: t('contentType'), status: 'OK' },
        { label: t('loadOfContent'), status: 'OK' },
      ],
    }),
    [tLoading, store.currentStep]
  );

  const title = React.useMemo(() => {
    if (store.curriculum)
      return `${store.curriculum.program.name} - ${store.curriculum.name} (${store.curriculum.center.name})`;
    return t('newCurriculum');
  }, [store.curriculum, tLoading]);

  const page = React.useMemo(
    () =>
      [
        <AddCurriculumStep0 key="0" onNext={onStep0} />,
        <AddCurriculumStep1 key="1" onNext={onStep1} curriculum={store.curriculum} />,
        <AddCurriculumStep2 key="2" onNext={onStep2} curriculum={store.curriculum} />,
        <AddCurriculumStep3
          key="3"
          onPrev={onPrev3}
          curriculum={store.curriculum}
          isEditMode={store.isEditMode}
        />,
      ][store.currentStep],
    [store.currentStep]
  );

  React.useEffect(() => {
    if (id) load();
  }, [id]);

  if (store.loading) return <LoadingOverlay visible />;

  return (
    <PageContainer>
      <Title order={2} className={classes.title}>
        {title}
      </Title>
      {store.isEditMode ? <HorizontalStepper {...stepperConfig} /> : null}
      <Box className={classes.container}>{page}</Box>
    </PageContainer>
  );
}

export default AddCurriculum;
