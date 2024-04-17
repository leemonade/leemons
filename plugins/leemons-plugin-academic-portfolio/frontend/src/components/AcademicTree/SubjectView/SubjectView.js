import React, { useMemo, useRef, useState } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import {
  LoadingOverlay,
  TotalLayoutStepContainer,
  Tabs,
  TabPanel,
  Button,
  Box,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';

import { useSubjectDetails } from '@academic-portfolio/hooks';
import { useUpdateClass } from '@academic-portfolio/hooks/mutations/useMutateClass';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import EnrollmentTab from './EnrollmentTab';
import InfoTab from './InfoTab';

const SubjectView = ({ subjectTreeNode, program, scrollRef, openEnrollmentDrawer }) => {
  const [t] = useTranslateLoader(prefixPN('tree_page'));
  const [activeTab, setActiveTab] = useState('0');
  const { data: subjectDetails, isLoading } = useSubjectDetails(
    subjectTreeNode?.itemId ?? subjectTreeNode?.id,
    {
      enabled: subjectTreeNode?.id?.length > 0 || subjectTreeNode,
    },
    true
  );
  const { mutate: mutateClass } = useUpdateClass();
  const updateForm = useForm();
  const { isDirty } = updateForm.formState;
  const stackRef = useRef();

  // For cases when the subject is the child of a reference group
  const singleClassToShow = useMemo(() => {
    const subjectParentNodeIsGroup = subjectDetails?.classes?.every((cls) => cls.groups);
    if (subjectParentNodeIsGroup) {
      return subjectDetails?.classes?.find(
        (cls) => cls.groups?.id === subjectTreeNode?.parentItemId
      );
    }
    return null;
  }, [subjectDetails, subjectTreeNode]);

  const EnrollmentTabs = useMemo(() => {
    if (singleClassToShow) {
      return (
        <TabPanel label={t('enrollTitle')}>
          <EnrollmentTab
            classData={singleClassToShow}
            openEnrollmentDrawer={openEnrollmentDrawer}
            center={program?.centers}
            updateForm={updateForm}
          />
        </TabPanel>
      );
    }
    const sortedClasses = subjectDetails?.classes?.sort(
      (a, b) => a.classWithoutGroupId - b.classWithoutGroupId
    );
    return sortedClasses?.map((cls) => (
      <TabPanel key={cls.id} label={cls?.alias ?? cls.classWithoutGroupId}>
        <EnrollmentTab
          classData={cls}
          openEnrollmentDrawer={openEnrollmentDrawer}
          updateForm={updateForm}
          center={program?.centers}
        />
      </TabPanel>
    ));
  }, [subjectDetails, singleClassToShow, program]);

  const handleUpdateClass = () => {
    const requestBody = updateForm.getValues();

    if (requestBody.mainTeacher?.length) {
      requestBody.teachers = [{ teacher: requestBody.mainTeacher, type: 'main-teacher' }];
    } else {
      requestBody.teachers = [];
    }
    delete requestBody.mainTeacher;

    if (!isEmpty(requestBody.schedule)) {
      requestBody.schedule = requestBody.schedule.days;
    }

    mutateClass(requestBody, {
      onSuccess: () => {
        addSuccessAlert(t('updateClassMessage'));
      },
      onError: (e) => {
        console.error(e);
        addErrorAlert(t('updateClassError'));
      },
    });
  };

  const handleSaveChanges = () => {
    if (activeTab !== '0') {
      handleUpdateClass();
    }
  };

  return (
    <TotalLayoutStepContainer
      stepName={
        subjectTreeNode?.text ? `${program?.name} - ${subjectTreeNode?.text}` : program?.name ?? ''
      }
      clean
      fullWidth
      scrollRef={scrollRef}
      Footer={
        <TotalLayoutFooterContainer
          scrollRef={scrollRef}
          fixed
          rectRef={stackRef}
          rightZone={
            <Button disabled={!isDirty} onClick={handleSaveChanges}>
              {t('saveChanges')}
            </Button>
          }
        />
      }
    >
      <Box ref={stackRef}>
        <LoadingOverlay visible={isLoading} />
        <Tabs
          tabPanelListStyle={{ backgroundColor: 'white' }}
          fullHeight
          onChange={(val) => {
            setActiveTab(val);
            updateForm.reset();
          }}
        >
          <TabPanel label={t('info')}>
            <InfoTab
              subjectDetails={subjectDetails}
              onlyClassToShow={singleClassToShow}
              subjectNode={subjectTreeNode}
            />
          </TabPanel>
          {EnrollmentTabs}
        </Tabs>
      </Box>
    </TotalLayoutStepContainer>
  );
};

SubjectView.propTypes = {
  subjectTreeNode: PropTypes.object,
  program: PropTypes.object,
  openEnrollmentDrawer: PropTypes.func,
  scrollRef: PropTypes.any,
};

export default SubjectView;
