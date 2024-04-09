import React, { useMemo, useState } from 'react';
import { isArray, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

import {
  LoadingOverlay,
  TotalLayoutStepContainer,
  Tabs,
  TabPanel,
  Button,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';

import { useSubjectDetails } from '@academic-portfolio/hooks';
import { useUpdateClass } from '@academic-portfolio/hooks/mutations/useMutateClass';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import EnrollmentTab from './EnrollmentTab';
import InfoTab from './InfoTab';

const SubjectView = ({ subjectNode, program, scrollRef, openEnrollmentDrawer }) => {
  const [activeTab, setActiveTab] = useState('0');
  const { data: subjectDetails, isLoading } = useSubjectDetails(
    subjectNode?.id,
    {
      enabled: subjectNode?.id?.length > 0,
    },
    true
  );
  const { mutate: mutateClass } = useUpdateClass();
  const updateForm = useForm();

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
            centerId={program?.center}
            updateForm={updateForm}
          />
        </TabPanel>
      );
    }
    return subjectDetails?.classes?.map((cls) => (
      <TabPanel key={cls.id} label={cls?.alias ?? cls.classWithoutGroupId}>
        <EnrollmentTab
          classData={cls}
          openEnrollmentDrawer={openEnrollmentDrawer}
          updateForm={updateForm}
        />
      </TabPanel>
    ));
  }, [subjectDetails, singleClassToShow]);

  const handleUpdateClass = () => {
    const requestBody = updateForm.getValues();

    if (requestBody.mainTeacher?.length) {
      requestBody.teachers = [{ teacher: requestBody.mainTeacher, type: 'main-teacher' }];
      delete requestBody.mainTeacher;
    }
    if (!isEmpty(requestBody.schedule)) {
      requestBody.schedule = isArray(requestBody.schedule)
        ? requestBody.schedule
        : [requestBody.schedule];
    }

    mutateClass(requestBody, {
      onSuccess: () => {
        addSuccessAlert('Clase actualizada con éxito. 🔫');
      },
      onError: (e) => {
        console.error(e);
        addErrorAlert('Error actualizando aula. 🔫');
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
      stepName={subjectNode?.name ? `${program?.name} - ${subjectNode?.name}` : program?.name ?? ''}
      clean
      scrollRef={scrollRef}
      Footer={
        <TotalLayoutFooterContainer
          fixed
          scrollRef={scrollRef}
          rightZone={<Button onClick={handleSaveChanges}>{'Guardar Cambios 🔫'}</Button>}
        />
      }
    >
      <LoadingOverlay visible={isLoading} />
      <Tabs
        tabPanelListStyle={{ backgroundColor: 'white' }}
        fullHeight
        onChange={(val) => {
          setActiveTab(val);
          updateForm.reset();
        }}
      >
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
  scrollRef: PropTypes.any,
};

export default SubjectView;
