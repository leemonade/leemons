import React, { useMemo, useState, useEffect, useContext, useRef } from 'react';
import { isArray, isNil, isEmpty } from 'lodash';
import {
  Paper,
  Box,
  Tree,
  useTree,
  Grid,
  Col,
  PageContainer,
  ContextContainer,
} from '@bubbles-ui/components';
import {
  AdminPageHeader,
  AcademicProgramSetup,
  AcademicProgramSetupBasicData,
  AcademicProgramSetupSubjects,
  AcademicProgramSetupCourses,
} from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { SelectCenter } from '@users/components/SelectCenter';
import { LayoutContext } from '@layout/context/layout';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import {
  listProgramsRequest,
  createProgramRequest,
  updateProgramRequest,
} from '@academic-portfolio/request';
import unflatten from '@academic-portfolio/helpers/unflatten';
import { ProgramItem } from '@academic-portfolio/components';

export default function ProgramList() {
  const [t, translations] = useTranslateLoader(prefixPN('programs_page'));
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const [centerId, setCenterId] = useState(null);
  const [setupLabels, setSetupLabels] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [, setRender] = useState(null);
  const { setLoading, scrollTo } = useContext(LayoutContext);

  const store = useRef({
    mounted: true,
    programs: [],
    currentProgram: null,
  });

  const treeProps = useTree();

  // ····················································································
  // PROCESS DATA

  useEffect(
    () => () => {
      store.current.mounted = false;
    },
    []
  );

  const render = () => {
    if (store.current.mounted) setRender(new Date().getTime());
  };

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

      console.log('data:', data);

      const programs = data.map((item) => ({
        id: item.id,
        parent: 0,
        draggable: false,
        program: item,
        render: ProgramItem,
      }));
      const treeData = [...programs, ADD_PROGRAM];
      treeProps.setTreeData(treeData);

      if (!isEmpty(store.current.currentProgram)) {
        scrollTo({ top: 0 });
        // eslint-disable-next-line no-use-before-define
        handleShowDetail(() => {
          treeProps.setSelectedNode(store.current.currentProgram.id);
        });
      }

      render();
    }
  };

  const loadPrograms = async (center) => {
    try {
      const response = await listProgramsRequest({ page: 0, size: 9999, center });
      const data = response.data?.items || [];
      store.current.programs = data;
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

      if (!isEmpty(store.current.currentProgram)) {
        const { name, abbreviation, credits } = values;
        body = {
          id: store.current.currentProgram.id,
          name,
          abbreviation,
          credits,
        };
        apiCall = updateProgramRequest;
        messageKey = 'common.update_done';
      }

      const response = await apiCall(body);
      store.current.currentProgram = response.program;

      await loadPrograms(centerId);
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

  const handleOnSelectCenter = async (center) => {
    setCenterId(center);
    loadPrograms(center);
  };

  const handleOnAddProgram = () => {
    scrollTo({ top: 0 });
    handleShowDetail(() => {
      store.current.currentProgram = null;
      treeProps.setSelectedNode(null);
    });
  };

  const handleOnSaveProgram = (values) => {
    saveProgram(values);
  };

  const handleOnEditProgram = (e) => {
    scrollTo({ top: 0 });
    handleShowDetail(() => {
      store.current.currentProgram = e.program;
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

      return {
        editable: isEmpty(store.current.currentProgram),
        values: store.current.currentProgram || {},
        labels: { title: isEmpty(store.current.currentProgram) ? title : editTitle },
        data: [
          {
            label: basicData.step_label,
            content: <AcademicProgramSetupBasicData {...basicData} />,
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
  }, [setupLabels, store.current.currentProgram]);

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={headerValues} />

      <Paper color="solid" shadow="none" padding={0}>
        <PageContainer>
          <ContextContainer padded="vertical">
            <Grid grow>
              <Col span={5}>
                <Paper fullWidth padding={5}>
                  <ContextContainer divided>
                    <Box>
                      <SelectCenter
                        label={t('common.select_center')}
                        onChange={handleOnSelectCenter}
                      />
                    </Box>
                    {centerId && (
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
              </Col>
              <Col span={7}>
                {!isNil(setupProps) && showDetail && (
                  <Paper fullWidth padding={5}>
                    <AcademicProgramSetup
                      {...setupProps}
                      onSave={handleOnSaveProgram}
                      onNext={handleOnNext}
                      onPrev={handleOnPrev}
                    />
                  </Paper>
                )}
              </Col>
            </Grid>
          </ContextContainer>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}
