import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  TotalLayoutStepContainer,
  Tabs,
  TabPanel,
  Button,
  Box,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { useNotifications } from '@bubbles-ui/notifications';
import { addErrorAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { cloneDeep, isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import EnrollmentTab from './EnrollmentTab';
import InfoTab from './InfoTab';

import { SOCKET_EVENTS } from '@academic-portfolio/config/constants';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { useSubjectDetails } from '@academic-portfolio/hooks';
import { useUpdateClass } from '@academic-portfolio/hooks/mutations/useMutateClass';

const SubjectView = ({ subjectTreeNode, program, scrollRef, openEnrollmentDrawer }) => {
  const [t] = useTranslateLoader(prefixPN('tree_page'));
  const [tSocket] = useTranslateLoader(prefixPN('socketEvents'));
  const [activeTab, setActiveTab] = useState('0');
  const [dirtyForm, setDirtyForm] = useState(false);
  const [tabsKey, setTabsKey] = useState(0);
  const { data: subjectDetails } = useSubjectDetails(
    subjectTreeNode?.itemId ?? subjectTreeNode?.id,
    {
      enabled: subjectTreeNode?.id?.length > 0 || subjectTreeNode,
      refetchOnWindowFocus: false,
    },
    true
  );

  const { mutate: mutateClass, isLoading: isMutatingClass } = useUpdateClass({
    invalidateOnSuccess: false,
  });
  const updateForm = useForm();
  const stackRef = useRef();
  const notifications = useNotifications();

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

  const selectedClass = useMemo(() => {
    return subjectDetails?.classes?.find((cls) => cls.id === activeTab);
  }, [subjectDetails, activeTab]);

  useEffect(() => {
    setTabsKey((prevKey) => prevKey + 1);
  }, [EnrollmentTabs]);

  const handleUpdateClass = () => {
    const requestBody = updateForm.getValues();
    requestBody.id = activeTab;

    if (!requestBody.address?.length) requestBody.address = null;
    if (!requestBody.virtualUrl?.length) requestBody.virtualUrl = null;

    requestBody.teachers = [];
    if (requestBody.mainTeacher?.length) {
      requestBody.teachers.push({ teacher: requestBody.mainTeacher, type: 'main-teacher' });
    }
    if (requestBody.associateTeachers?.length) {
      requestBody.teachers.push(
        ...requestBody.associateTeachers.map((teacher) => ({
          teacher,
          type: 'associate-teacher',
        }))
      );
    }

    delete requestBody.mainTeacher;
    delete requestBody.associateTeachers;

    if (!isEmpty(requestBody.schedule)) {
      requestBody.schedule = requestBody.schedule.days;
    }

    requestBody.subject = subjectTreeNode?.itemId;

    mutateClass(requestBody, {
      onSuccess: () => {
        const className =
          selectedClass?.alias ??
          selectedClass?.classWithoutGroupId ??
          selectedClass?.classroomId ??
          '-';
        const notificationId = `${SOCKET_EVENTS.CLASS_UPDATE}:${requestBody.id}`;

        notifications.showNotification({
          id: notificationId,
          severity: 'info',
          loading: true,
          title: tSocket('title.CLASS_UPDATE', { className }),
          message: tSocket('message.PROCESSING'),
          autoClose: false,
          disallowClose: true,
        });
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
            <Button
              disabled={!dirtyForm || selectedClass?.status === 'updating'}
              onClick={handleSaveChanges}
              loading={isMutatingClass}
            >
              {t('saveChanges')}
            </Button>
          }
        />
      }
    >
      <Box ref={stackRef}>
        <Tabs
          key={tabsKey}
          tabPanelListStyle={{ backgroundColor: 'white' }}
          fullHeight
          forceRender
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
