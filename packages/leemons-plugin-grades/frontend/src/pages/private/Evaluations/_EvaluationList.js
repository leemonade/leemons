import React, { useContext, useEffect, useMemo, useState } from 'react';
import { isArray, isNil } from 'lodash';
import {
  Box,
  Col,
  ContextContainer,
  Grid,
  PageContainer,
  Paper,
  Tree,
  useTree,
} from '@bubbles-ui/components';
import {
  AcademicProgramSetupBasicData,
  AcademicProgramSetupCourses,
  AcademicProgramSetupSubjects,
  AdminPageHeader,
} from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useTranslate from '@multilanguage/useTranslate';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { SelectCenter } from '@users/components/SelectCenter';
import { listProgramsRequest } from '@academic-portfolio/request';
import unflatten from '@academic-portfolio/helpers/unflatten';
import { LayoutContext } from '@layout/context/layout';

const ACTIONS = {
  NEW: 'new',
  EDIT: 'edit',
};

export default function EvaluationList() {
  const [t] = useTranslateLoader(prefixPN('programs_page'));
  const [translations] = useTranslate({
    keysStartsWith: prefixPN('programs_page'),
  });

  const [programs, setPrograms] = useState([]);
  const [centerId, setCenterId] = useState(null);
  const [loadPrograms, setLoadPrograms] = useState(false);
  const [loadTree, setLoadTree] = useState(false);
  const [setupLabels, setSetupLabels] = useState(null);
  const [action, setAction] = useState(ACTIONS.NEW);
  const [showDetail, setShowDetail] = useState(false);
  const { setLoading, scrollTo } = useContext(LayoutContext);

  const treeProps = useTree();

  const handleOnSelectCenter = async (center) => {
    setCenterId(center);
    setLoadPrograms(true);
  };

  const handleOnAddProgram = () => {
    setAction(ACTIONS.NEW);
    setShowDetail(true);
  };

  const handleOnSaveProgram = (values) => {
    console.log(values);
    setLoading(true);
  };

  const handleOnNext = () => {
    scrollTo({ top: 110 });
  };

  const handleOnPrev = () => {
    scrollTo({ top: 110 });
  };

  // ····················································································
  // CALLED EVERYTIME "loadPrograms" changes

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (loadPrograms) {
        try {
          const response = await listProgramsRequest({ page: 0, size: 9999, center: centerId });
          if (mounted) {
            const data = response.data?.items || [];
            setPrograms(data);
            setLoadTree(true);
            setLoadPrograms(false);
          }
        } catch (e) {
          setLoadPrograms(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [loadPrograms]);

  useEffect(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = res.plugins['academic-portfolio'].programs_page.setup;
      setSetupLabels(data);
    }
  }, [translations]);

  // ····················································································
  // CALLED EVERYTIME "processTreeData" changes

  useEffect(() => {
    if (loadTree && isArray(programs) && t) {
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
      const data = [ADD_PROGRAM];
      treeProps.setTreeData(data);
      setLoadTree(false);
    }
  }, [loadTree, programs, t]);

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
      const { title, basicData, coursesData, subjectsData, frequencies, firstDigits } = setupLabels;
      const firstDigitOptions = Object.keys(firstDigits).map((key) => ({
        label: firstDigits[key],
        value: key,
      }));
      const frequencyOptions = Object.keys(frequencies).map((key) => ({
        label: frequencies[key],
        value: key,
      }));

      return {
        labels: { title },
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
  }, [setupLabels, action]);

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
                        <Tree {...treeProps} onAdd={handleOnAddProgram} />
                      </Box>
                    )}
                  </ContextContainer>
                </Paper>
              </Col>
              <Col span={7}>
                {!isNil(setupProps) && showDetail && (
                  <Paper fullWidth padding={5}>
                    Hola
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
