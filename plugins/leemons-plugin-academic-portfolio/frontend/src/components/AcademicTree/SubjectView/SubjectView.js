import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSubjectDetails } from '@academic-portfolio/hooks';

import { LoadingOverlay, TotalLayoutStepContainer, Tabs, TabPanel } from '@bubbles-ui/components';
import EnrollmentTab from './EnrollmentTab';
import InfoTab from './InfoTab';

const SubjectView = ({ subjectNode, program, scrollRef, openEnrollmentDrawer }) => {
  const { data: subjectDetails, isLoading } = useSubjectDetails(
    subjectNode?.id,
    {
      enabled: subjectNode?.id?.length > 0,
    },
    true
  );

  // For cases when the subject is the child of a reference group
  const singleClassToShow = useMemo(() => {
    if (subjectNode?.parent?.type === 'group') {
      return subjectDetails?.classes?.find((cls) => cls.groups?.id === subjectNode?.parent?.id);
    }
    return null;
  }, [subjectDetails, subjectNode]);

  const EnrollmentTabs = useMemo(() => {
    if (singleClassToShow) {
      return (
        <TabPanel label={'Matriculación 🔫'}>
          <EnrollmentTab
            classData={singleClassToShow}
            openEnrollmentDrawer={openEnrollmentDrawer}
          />
        </TabPanel>
      );
    }
    return subjectDetails?.classes?.map((cls) => (
      <TabPanel key={cls.id} label={cls?.alias ?? cls.classWithoutGroupId}>
        <EnrollmentTab classData={cls} openEnrollmentDrawer={openEnrollmentDrawer} />
      </TabPanel>
    ));
  }, [subjectDetails, singleClassToShow]);

  return (
    <TotalLayoutStepContainer
      stepName={subjectNode?.name ? `${program?.name} - ${subjectNode?.name}` : program?.name ?? ''}
      clean
      fullWidth
    >
      <LoadingOverlay visible={isLoading} />
      <Tabs tabPanelListStyle={{ backgroundColor: 'white' }} fullHeight>
        <TabPanel label={'Información 🔫'}>
          <InfoTab
            subjectDetails={subjectDetails}
            onlyClassToShow={singleClassToShow}
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
  openEnrollmentDrawer: PropTypes.func,
  scrollReff: PropTypes.any,
};

export default SubjectView;
