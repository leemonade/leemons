import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cloneDeep, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import {
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
  const [dirtyForm, setDirtyForm] = useState(false);
  const { data: subjectDetails } = useSubjectDetails(
    subjectTreeNode?.itemId ?? subjectTreeNode?.id,
    {
      enabled: subjectTreeNode?.id?.length > 0 || subjectTreeNode,
      refetchOnWindowFocus: false,
    },
    true
  );
  const { mutate: mutateClass, isLoading: isMutatingClass } = useUpdateClass();
  const updateForm = useForm();
  const stackRef = useRef();

  useEffect(() => {
    setDirtyForm(false);
  }, [subjectTreeNode, activeTab]);

  useEffect(() => {
    setActiveTab('0');
  }, [subjectTreeNode]);

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
        <TabPanel key={singleClassToShow.id} label={t('enrollTitle')}>
          <EnrollmentTab
            classData={cloneDeep(singleClassToShow)}
            openEnrollmentDrawer={openEnrollmentDrawer}
            center={program?.centers}
            updateForm={updateForm}
            setDirtyForm={setDirtyForm}
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
          classData={cloneDeep(sortedClasses.find((c) => c.id === activeTab))}
          openEnrollmentDrawer={openEnrollmentDrawer}
          updateForm={updateForm}
          center={program?.centers}
          setDirtyForm={setDirtyForm}
        />
      </TabPanel>
    ));
  }, [subjectDetails, singleClassToShow, program, activeTab]);

  const handleUpdateClass = () => {
    const requestBody = updateForm.getValues();
    requestBody.id = activeTab;

    if (!requestBody.address?.length) requestBody.address = null;
    if (!requestBody.virtualUrl?.length) requestBody.virtualUrl = null;

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
            <Button disabled={!dirtyForm} onClick={handleSaveChanges} loading={isMutatingClass}>
              {t('saveChanges')}
            </Button>
          }
        />
      }
    >
      <Box ref={stackRef}>
        <Tabs
          tabPanelListStyle={{ backgroundColor: 'white' }}
          fullHeight
          onChange={(val) => {
            setActiveTab(val);
          }}
          activeKey={activeTab}
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
