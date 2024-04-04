import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSubjectDetails } from '@academic-portfolio/hooks';

import {
  Select,
  Stack,
  LoadingOverlay,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
  Tabs,
  TabPanel,
  Box,
  ContextContainer,
  Button,
  VerticalStepperContainer,
} from '@bubbles-ui/components';
import EnrollmentTab from './EnrollmentTab';
import InfoTab from './InfoTab';
import EnrollmentDrawer from '../EnrollmentDrawer/EnrollmentDrawer';

const SubjectView = ({ subjectNode, program, scrollRef, setEnrollmentDrawerIsOpen }) => {
  const [activeTab, setActiveTab] = useState('0');
  const { data: subjectDetails, isLoading } = useSubjectDetails(
    subjectNode?.id,
    {
      enabled: subjectNode?.id?.length > 0,
    },
    true
  );
  console.log('subjectDetails', subjectDetails);

  // For cases when the subject is the child of a reference group
  const onlyClassToShow = useMemo(() => {
    if (subjectNode?.parent?.type === 'group') {
      return subjectDetails?.classes?.find((cls) => cls.groups?.id === subjectNode?.parent?.id);
    }
    return null;
  }, [subjectDetails, subjectNode]);

  const EnrollmentTabs = useMemo(() => {
    if (onlyClassToShow) {
      return (
        <TabPanel label={'Matriculación 🔫'}>
          <EnrollmentTab
            classData={onlyClassToShow}
            setEnrollmentDrawerIsOpen={setEnrollmentDrawerIsOpen}
          />
        </TabPanel>
      );
    }
    return subjectDetails?.classes?.map((cls) => (
      <TabPanel key={cls.id} label={cls?.alias ?? cls.classWithoutGroupId}>
        <EnrollmentTab classData={cls} setEnrollmentDrawerIsOpen={setEnrollmentDrawerIsOpen} />
      </TabPanel>
    ));
  }, [subjectDetails, onlyClassToShow]);

  return (
    <TotalLayoutStepContainer
      stepName={`${program?.name} - ${subjectNode?.name || ''}`}
      clean
      fullWidth
    >
      <LoadingOverlay visible={isLoading} />
      <Tabs
        tabPanelListStyle={{ backgroundColor: 'white' }}
        fullHeight
        onChange={(activeT) => setActiveTab(activeT)}
      >
        <TabPanel label={'Información 🔫'}>
          <InfoTab
            subjectDetails={subjectDetails}
            onlyClassToShow={onlyClassToShow}
            subjectNode={subjectNode}
          />
        </TabPanel>
        {EnrollmentTabs}
      </Tabs>
    </TotalLayoutStepContainer>
  );
};

SubjectView.propTypes = {
  subjectNode: PropTypes.object,
  program: PropTypes.object,
  setEnrollmentDrawerIsOpen: PropTypes.func,
  scrollReff: PropTypes.any,
};

export default SubjectView;
