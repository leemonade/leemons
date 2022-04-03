import React from 'react';
import { ContextContainer, Text, Button, PageContainer, Anchor } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { TextEditorInput } from '@bubbles-ui/editors';
import { useParams, useHistory } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { EvaluationNotesSelect } from '@grades/components/EvaluationNotesSelect';
import saveCorrectionRequest from '../../../request/instance/saveCorrection';
import useTask from '../../../components/Student/TaskDetail/helpers/useTask';
import useInstance from '../../../components/Student/TaskDetail/helpers/useInstance';
import useCorrection from '../../../components/Grade/hooks/useCorrection';
import useProgram from '../../../components/Student/TaskDetail/helpers/useProgram';
import { Grade } from '../../../components/Grade';
import useDeliverable from '../../../components/Student/TaskDetail/helpers/useDelivery';

export default function Correction() {
  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      grade: 0,
      teacherFeedback: '',
    },
  });
  const { instance: instanceId, student } = useParams();
  const deliverable = useDeliverable(instanceId, student, 'submission');
  const history = useHistory();

  const correction = useCorrection(instanceId, student);
  const instance = useInstance(instanceId, ['task']);
  const task = useTask(instance?.task?.id, ['program']);
  const program = useProgram(task?.program);

  const onSubmit = async (values) => {
    await saveCorrectionRequest(instance?.id, student, values);
    history.push(`/private/tasks/details/${instance?.id}`);
  };

  React.useEffect(() => {
    const gradeValue = getValues('grade');
    if (correction?.grade !== gradeValue) {
      setValue('grade', correction?.grade);
    }
  }, [correction?.grade]);

  React.useEffect(() => {
    const teacherFeedbackValue = getValues('teacherFeedback');
    if (correction?.teacherFeedback !== teacherFeedbackValue) {
      setValue('teacherFeedback', correction?.teacherFeedback);
    }
  }, [correction?.teacherFeedback]);

  return (
    <>
      <AdminPageHeader />
      <PageContainer>
        <ContextContainer>
          {/* TRANSLATE: Previous task title */}
          <ContextContainer title="Previous task">
            <Text>Display the task results</Text>
          </ContextContainer>
          {/* TRANSLATE: Submission title */}
          <ContextContainer title="Submission">
            <Anchor href={deliverable?.value} target="_blank">
              Student submission
            </Anchor>
          </ContextContainer>
          {/* TRANSLATE: Self Reflection title */}
          <ContextContainer title="Self Reflection">
            <Text>Display the self reflection</Text>
          </ContextContainer>
          {/* TRANSLATE: punctuation */}
          <ContextContainer title="Punctuation">
            <Controller
              control={control}
              name="grade"
              render={({ field }) => (
                <>
                  <EvaluationNotesSelect
                    {...field}
                    label="Grade"
                    evaluation={program?.evaluationSystem}
                    valueKey="id"
                  />
                  <Grade value={field.value} evaluation={program?.evaluationSystem} />
                </>
              )}
            />
            <Controller
              control={control}
              name="teacherFeedback"
              render={({ field }) => <TextEditorInput {...field} label="Comentarios" />}
            />
            <Button onClick={handleSubmit(onSubmit)}>Calificate</Button>
          </ContextContainer>
        </ContextContainer>
      </PageContainer>
    </>
  );
}
