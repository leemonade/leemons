import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { isArray, isNil } from 'lodash';
import {
  Paper,
  Divider,
  Box,
  Stack,
  ImageLoader,
  Button,
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
import useTranslate from '@multilanguage/useTranslate';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { useAsync } from '@common/useAsync';
import hooks from 'leemons-hooks';
import { SelectCenter } from '@users/components/SelectCenter';
import { listProgramsRequest } from '@academic-portfolio/request';
import unflatten from '@academic-portfolio/helpers/unflatten';

const ACTIONS = {
  NEW: 'new',
  EDIT: 'edit',
};

export default function ProgramList() {
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

  const treeProps = useTree();

  const handleOnSelectCenter = async (center) => {
    setCenterId(center);
    setLoadPrograms(true);
  };

  const handleOnAddProgram = () => {
    setAction(ACTIONS.NEW);
    setShowDetail(true);
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
      console.log(setupLabels);
      const { title, basicData, coursesData, subjectsData } = setupLabels;
      return {
        labels: { title },
        data: [
          {
            label: basicData.step_label,
            content: <AcademicProgramSetupBasicData {...basicData} />,
          },
          {
            label: coursesData.step_label,
            content: <AcademicProgramSetupCourses {...coursesData} />,
          },
          {
            label: subjectsData.step_label,
            content: <AcademicProgramSetupSubjects {...subjectsData} />,
          },
        ],
      };
    }
    return null;
  }, [setupLabels, action]);

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader values={headerValues} />

      <Paper color="solid" shadow="none" padding="none">
        <PageContainer>
          <ContextContainer padded="vertical">
            <Grid grow>
              <Col span={5}>
                <Paper fullWidth>
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
                  <Paper fullWidth>
                    <AcademicProgramSetup {...setupProps} />
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
