import { ProgramItem } from '@academic-portfolio/components';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import {
  createProgramRequest,
  listProgramsRequest,
  updateProgramRequest,
} from '@academic-portfolio/request';
import {
  Alert,
  Anchor,
  Box,
  Col,
  ContextContainer,
  Grid,
  PageContainer,
  Paper,
  Tree,
  useResizeObserver,
  useTree,
} from '@bubbles-ui/components';
import {
  AcademicProgramSetup,
  AcademicProgramSetupBasicData,
  AcademicProgramSetupCourses,
  AcademicProgramSetupSubjects,
  AdminPageHeader,
} from '@bubbles-ui/leemons';
import { unflatten, useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { EvaluationsSelect } from '@grades/components/EvaluationsSelect';
import { listGradesRequest } from '@grades/request';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import { LayoutContext } from '@layout/context/layout';
import ImagePicker from '@leebrary/components/ImagePicker';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { SelectCenter } from '@users/components/SelectCenter';
import { cloneDeep, isArray, isEmpty, isNil, keyBy, map } from 'lodash';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { activeMenuItemSubjects } from '../../../helpers/activeMenuItemSubjects';
import { detailProgramRequest } from '../../../request';

export default function ProgramList() {
  const [t, translations, , loading] = useTranslateLoader(prefixPN('programs_page'));
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const [errorNoEvaluation, setErrorNoEvaluation] = useState(false);
  const [centerId, setCenterId] = useState(null);
  const [setupLabels, setSetupLabels] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const { setLoading, scrollTo } = useContext(LayoutContext);
  const [store, render] = useStore({
    scroll: 0,
    mounted: true,
    programs: [],
    currentProgram: null,
  });

  const { layoutState } = useLayout();
  const [containerRef, container] = useResizeObserver();
  const [headerBaseRef, headerBase] = useResizeObserver();
  const [headerDescriptionRef, headerDescription] = useResizeObserver();

  const history = useHistory();

  const treeProps = useTree();

  // ····················································································
  // PROCESS DATA

  useEffect(
    () => () => {
      store.mounted = false;
    },
    []
  );

  const loadTree = (data) => {
    if (isArray(data) && t) {
      const ADD_PROGRAM = {
        id: 'PROGRAM-ADD',
        parent: 0,
        text: t('common.add_program'),
        type: 'button',
        draggable: false,
        data: {
          action: 'add',
        },
      };

      const programs = data.map((item) => ({
        id: item.id,
        parent: 0,
        draggable: false,
        program: item,
        render: ProgramItem,
      }));
      const treeData = [...programs, ADD_PROGRAM];
      treeProps.setTreeData(treeData);

      if (!isEmpty(store.currentProgram)) {
        scrollTo({ top: 0 });
        // eslint-disable-next-line no-use-before-define
        handleShowDetail(() => {
          treeProps.setSelectedNode(store.currentProgram.id);
        });
      }

      render();
    }
  };

  const loadPrograms = async (center) => {
    try {
      const response = await listProgramsRequest({ page: 0, size: 9999, center });
      const data = response.data?.items || [];
      store.programs = data;
      loadTree(data);
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  };

  const saveProgram = async (values) => {
    try {
      setLoading(true);
      let body = { ...values, centers: [centerId] };
      let apiCall = createProgramRequest;
      let messageKey = 'common.create_done';

      if (!isEmpty(store.currentProgram)) {
        const { name, abbreviation, credits, image, color, totalHours, hideStudentsToStudents } =
          values;
        body = {
          id: store.currentProgram.id,
          name,
          abbreviation,
          credits,
          image,
          color,
          totalHours: totalHours || 0,
          hideStudentsToStudents: !!hideStudentsToStudents,
        };
        apiCall = updateProgramRequest;
        messageKey = 'common.update_done';
      }

      const response = await apiCall(body);
      store.currentProgram = response.program;

      await loadPrograms(centerId);
      await activeMenuItemSubjects();
      setLoading(false);
      addSuccessAlert(t(messageKey));
    } catch (e) {
      setLoading(false);
      addErrorAlert(getErrorMessage(e));
    }
  };

  useEffect(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = res.plugins['academic-portfolio'].programs_page.setup;
      setSetupLabels(data);
    }
  }, [translations]);

  // ····················································································
  // HANDLERS

  const handleShowDetail = (callback) => {
    if (showDetail) {
      setTimeout(
        () => {
          setShowDetail(false);
          callback();

          setTimeout(() => setShowDetail(true), 500);
        },
        showDetail ? 500 : 0
      );
    } else {
      setShowDetail(true);
      callback();
    }
  };

  async function checkIfExistsEvaluationSystemsOnSelectedCenter() {
    try {
      const {
        data: { items },
      } = await listGradesRequest({ page: 0, size: 1, center: centerId });
      setErrorNoEvaluation(!items.length);
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  }

  React.useEffect(() => {
    if (centerId && !loading) {
      checkIfExistsEvaluationSystemsOnSelectedCenter();
      loadPrograms(centerId);
    }
  }, [loading, centerId]);

  const handleOnSelectCenter = async (center) => {
    setCenterId(center);
    scrollTo({ top: 0 });
    treeProps.setSelectedNode(null);
    setTimeout(() => {
      store.currentProgram = null;
      setShowDetail(false);
      // loadPrograms(center);
    }, 300);
  };

  const handleOnAddProgram = () => {
    scrollTo({ top: 0 });
    handleShowDetail(() => {
      store.currentProgram = null;
      treeProps.setSelectedNode(null);
    });
  };

  const handleOnSaveProgram = (values) => {
    saveProgram(values);
  };

  const handleOnEditProgram = (e) => {
    scrollTo({ top: 0 });
    handleShowDetail(async () => {
      const { program } = await detailProgramRequest(e.program.id);
      store.currentProgram = program;
      store.currentProgram.allSubjectsSameDuration = !store.currentProgram.customSubstages?.length;
      treeProps.setSelectedNode(e.id);
    });
  };

  const handleOnNext = () => {
    scrollTo({ top: 110 });
  };

  const handleOnPrev = () => {
    scrollTo({ top: 110 });
  };

  // ····················································································
  // STATIC VALUES

  const headerValues = useMemo(
    () => ({
      title: t('page_title'),
      description: t('page_description'),
    }),
    [t]
  );

  const setupProps = useMemo(() => {
    if (!isNil(setupLabels)) {
      const { title, editTitle, basicData, coursesData, subjectsData, frequencies, firstDigits } =
        setupLabels;
      const firstDigitOptions = Object.keys(firstDigits).map((key) => ({
        label: firstDigits[key],
        value: key,
      }));
      const frequencyOptions = Object.keys(frequencies).map((key) => ({
        label: frequencies[key],
        value: key,
      }));

      const values = store.currentProgram ? cloneDeep(store.currentProgram) : {};
      if (values.cycles) {
        const coursesById = keyBy(values.courses, 'id');
        values.cycles = map(values.cycles, (cycle) => ({
          ...cycle,
          courses: map(cycle.courses, (courseId) => coursesById[courseId]?.index),
        }));
      }

      return {
        editable: isEmpty(store.currentProgram),
        values: {
          ...values,
          haveCycles: !!values.cycles?.length,
          maxNumberOfCourses: values.courses?.length,
        },
        labels: { title: isEmpty(store.currentProgram) ? title : editTitle },
        data: [
          {
            label: basicData.step_label,
            content: (
              <AcademicProgramSetupBasicData
                {...basicData}
                ImagePicker={ImagePicker}
                evaluationSystemSelect={<EvaluationsSelect center={centerId} />}
              />
            ),
          },
          {
            label: coursesData.step_label,
            content: (
              <AcademicProgramSetupCourses {...coursesData} frequencyOptions={frequencyOptions} />
            ),
          },
          {
            label: subjectsData.step_label,
            content: (
              <AcademicProgramSetupSubjects
                {...subjectsData}
                firstDigitOptions={firstDigitOptions}
                frequencyOptions={frequencyOptions}
              />
            ),
          },
        ],
      };
    }
    return null;
  }, [setupLabels, centerId, store.currentProgram]);

  function onScroll() {
    store.scroll = layoutState.contentRef.current.scrollTop;
    render();
  }

  React.useEffect(() => {
    layoutState.contentRef.current?.addEventListener('scroll', onScroll);

    // cleanup this component
    return () => {
      layoutState.contentRef.current?.removeEventListener('scroll', onScroll);
    };
  }, [layoutState.contentRef.current]);

  let { scroll } = store;
  if (scroll > headerBase.height) scroll = headerBase.height;
  const correct = 48;
  const correctBottom = 24;

  let top = headerBase.height + correct - scroll;
  const minTop = headerBase.height - headerDescription.height + 24;
  if (top < minTop) {
    top = minTop;
  }

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        baseRef={headerBaseRef}
        descriptionRef={headerDescriptionRef}
        values={headerValues}
      />

      <Paper color="solid" shadow="none" padding={0}>
        <PageContainer>
          <ContextContainer padded="vertical">
            <Grid grow>
              <Col span={5}>
                <Box ref={containerRef}>
                  <Box
                    style={{
                      width: `${container.width}px`,
                      position: 'fixed',
                      top: `${top}px`,
                      height: `calc(100vh - ${top + correctBottom}px)`,
                    }}
                  >
                    <Paper fullWidth padding={5}>
                      <ContextContainer divided>
                        <Box>
                          <SelectCenter
                            label={t('common.select_center')}
                            onChange={handleOnSelectCenter}
                            firstSelected
                          />
                        </Box>
                        {errorNoEvaluation ? (
                          <Box>
                            <Alert severity="error" closeable={false}>
                              {t('errorNoEvaluationSystems')}
                              <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
                                <Anchor
                                  component={Link}
                                  onClick={() =>
                                    history.push(`/private/grades/evaluations?center=${centerId}`)
                                  }
                                  to={`/private/grades/evaluations?center=${centerId}`}
                                >
                                  {t('errorNoEvaluationSystemsGoTo')}
                                </Anchor>
                              </Box>
                            </Alert>
                          </Box>
                        ) : null}

                        {centerId && !errorNoEvaluation && (
                          <Box>
                            <Tree
                              {...treeProps}
                              allowDragParents={false}
                              onSelect={handleOnEditProgram}
                              onAdd={handleOnAddProgram}
                            />
                          </Box>
                        )}
                      </ContextContainer>
                    </Paper>
                  </Box>
                </Box>
              </Col>
              <Col span={7}>
                {!isNil(setupProps) && showDetail && (
                  <>
                    <Paper fullWidth padding={5}>
                      <AcademicProgramSetup
                        {...setupProps}
                        onSave={handleOnSaveProgram}
                        onNext={handleOnNext}
                        onPrev={handleOnPrev}
                      />
                    </Paper>
                  </>
                )}
              </Col>
            </Grid>
          </ContextContainer>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}
