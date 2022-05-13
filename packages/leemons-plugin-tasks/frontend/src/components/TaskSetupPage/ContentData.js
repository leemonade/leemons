import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isFunction, isEmpty } from 'lodash';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import {
  Box,
  Stack,
  ContextContainer,
  Button,
  Tabs,
  TabPanel,
  InputWrapper,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { ChevRightIcon, ChevLeftIcon } from '@bubbles-ui/icons/outline';
import TimeUnitsInput from '../Inputs/TimeUnitsInput';
import SelfReflection from './components/SelfReflection';
import Submissions from './components/Submissions';
import Objectives from './components/Objectives';
// import Contents from './components/Contents';
// import AssessmentCriteria from './components/AssessmentCriteria';
import Attachments from './components/Attachments';
import Methodology from './components/Methodology';
import useSubjects from '../Assignment/AssignStudents/hooks/useSubjects';
import Curriculum from './components/Curriculum';

function ContentData({
  labels,
  placeholders,
  descriptions,
  helps,
  errorMessages,
  sharedData,
  setSharedData,
  editable,
  onNext,
  onPrevious,
  useObserver,
  ...props
}) {
  // ·······························································
  // FORM

  const defaultValues = {
    ...sharedData,
  };

  const formData = useForm({ defaultValues });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = formData;

  const subjects = useSubjects(sharedData);

  const { subscribe, unsubscribe, emitEvent } = useObserver();

  useEffect(() => {
    const f = (event) => {
      if (event === 'saveTask') {
        handleSubmit(
          (data) => {
            setSharedData(data);
            emitEvent('saveData');
          },
          () => {
            emitEvent('saveTaskFailed');
          }
        )();
      }
    };
    subscribe(f);

    return () => unsubscribe(f);
  }, []);

  // ·······························································
  // HANDLERS

  const handleOnNext = (e) => {
    const data = { ...sharedData, ...e };

    if (isFunction(setSharedData)) setSharedData(data);
    if (isFunction(onNext)) onNext(data);
  };

  // ---------------------------------------------------------------
  // COMPONENT

  return (
    <FormProvider {...formData}>
      <form onSubmit={handleSubmit(handleOnNext)} autoComplete="off">
        <ContextContainer {...props} divided>
          <ContextContainer divided>
            <ContextContainer title={labels.title}>
              <Methodology
                labels={labels}
                errorMessages={errorMessages}
                placeholders={placeholders}
              />
              <Controller
                control={control}
                name="duration"
                render={({ field }) => (
                  <TimeUnitsInput
                    {...field}
                    label={labels.recommendedDuration}
                    error={errors.recommendedDuration}
                  />
                )}
              />
            </ContextContainer>
            <Attachments />

            <ContextContainer title={labels.subjects}>
              {
                // {!!subjects?.length && (
                //   <InputWrapper label={labels?.curriculum} required>
                //     <Tabs>
                //       {subjects?.map((subject, index) => (
                //         <TabPanel key={index} label={subject?.label}>
                //           <ContextContainer>
                //             <InputWrapper label={labels?.content}>
                //               <Controller
                //                 control={control}
                //                 name="program"
                //                 render={({ field: { value: program } }) => (
                //                   <Curriculum
                //                     program={program}
                //                     name={`curriculum.${subject.value}.contents`}
                //                     type="content"
                //                   />
                //                 )}
                //               />
                //             </InputWrapper>
                //             {/* <InputWrapper label={labels?.objectives}>
                //               <Controller
                //                 control={control}
                //                 name="program"
                //                 render={({ field: { value: program } }) => (
                //                   <Curriculum
                //                     program={program}
                //                     name={`curriculum.${subject.value}.objectives`}
                //                     type="objective"
                //                   />
                //                 )}
                //               />
                //             </InputWrapper> */}
                //             <InputWrapper label={labels?.assessmentCriteria}>
                //               <Controller
                //                 control={control}
                //                 name="program"
                //                 render={({ field: { value: program } }) => (
                //                   <Curriculum
                //                     program={program}
                //                     name={`curriculum.${subject.value}.assessmentCriteria`}
                //                     type="assessmentCriteria"
                //                   />
                //                 )}
                //               />
                //             </InputWrapper>
                //             <Objectives
                //               name={`curriculum.${subject.value}.objectives`}
                //               required
                //               label={labels.objectives || ''}
                //               error={errors.objectives}
                //             />
                //           </ContextContainer>
                //           {/* <Contents
                //           name={`curriculum.${subject.subject}.contents`}
                //           required
                //           label={labels.content || ''}
                //           error={errors.content}
                //         />
                //         <Objectives
                //           name={`curriculum.${subject.subject}.objectives`}
                //           required
                //           label={labels.objectives || ''}
                //           error={errors.objectives}
                //         />
                //         <AssessmentCriteria
                //           name={`curriculum.${subject.subject}.assessmentCriteria`}
                //           label={labels.assessmentCriteria || ''}
                //           error={errors.assessmentCriteria}
                //         /> */}
                //         </TabPanel>
                //       ))}
                //     </Tabs>
                //   </InputWrapper>
                // )}
              }
            </ContextContainer>

            <ContextContainer>
              {/* TODO: Make the statement required (Not allowed with TextEditor) */}
              <Controller
                control={control}
                name="statement"
                rules={{
                  required: errorMessages.statement?.required,
                }}
                render={({ field }) => (
                  <TextEditorInput
                    required
                    {...field}
                    label={labels.statement}
                    error={errors.statement}
                  />
                )}
              />
              <Controller
                control={control}
                name="development"
                rules={{ required: errorMessages.development?.required }}
                render={({ field }) => (
                  <TextEditorInput
                    {...field}
                    label={labels.development}
                    placeholder={placeholders.development}
                    error={errors.development}
                    required={!isEmpty(errorMessages.development?.required)}
                  />
                )}
              />
            </ContextContainer>

            <Submissions labels={labels} />
            {/* <SelfReflection
              labels={labels?.selfReflection}
              description={descriptions?.selfReflection}
              showType
              name="selfReflection"
            /> */}
            {/* <SelfReflection
              labels={labels?.feedback}
              description={descriptions?.feedback}
              name="feedback"
            /> */}
          </ContextContainer>
          <Stack fullWidth justifyContent="space-between">
            <Box>
              <Button
                compact
                variant="light"
                leftIcon={<ChevLeftIcon height={20} width={20} />}
                onClick={onPrevious}
              >
                {labels.buttonPrev}
              </Button>
            </Box>
            <Box>
              <Button type="submit" rightIcon={<ChevRightIcon height={20} width={20} />}>
                {labels.buttonNext}
              </Button>
            </Box>
          </Stack>
        </ContextContainer>
      </form>
    </FormProvider>
  );
}

ContentData.defaultProps = {
  helps: {},
  labels: {},
  descriptions: {},
  placeholders: {},
  errorMessages: {},
};
ContentData.propTypes = {
  labels: PropTypes.object,
  descriptions: PropTypes.object,
  placeholders: PropTypes.object,
  helps: PropTypes.object,
  errorMessages: PropTypes.object,
  sharedData: PropTypes.any,
  setSharedData: PropTypes.func,
  editable: PropTypes.bool,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  useObserver: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { ContentData };
