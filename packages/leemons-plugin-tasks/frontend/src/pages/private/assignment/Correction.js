import React from 'react';
import { ContextContainer, Text, Select, Button, PageContainer } from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { TextEditor } from '@bubbles-ui/editors';
import { useParams, useHistory } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { useApi } from '@common';
import correctionRequest from '../../../request/instance/correction';

export default function Correction() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      grade: 0,
      teacherFeedback: '',
    },
  });
  const { instance, student } = useParams();
  const history = useHistory();

  const onSubmit = async (values) => {
    await correctionRequest(instance, student, values);
    history.push(`/private/tasks/details/${instance}`);
  };

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
            <Text>Display the submission</Text>
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
                <Select
                  {...field}
                  data={[
                    { label: 'Aprobado', value: 5 },
                    { label: 'Suspenso', value: 0 },
                    { label: 'Matrícula', value: 10 },
                  ]}
                />
              )}
            />
            <Controller
              control={control}
              name="teacherFeedback"
              render={({ field }) => <TextEditor {...field} label="Comentarios" />}
            />
            <Button onClick={handleSubmit(onSubmit)}>Calificate</Button>
          </ContextContainer>
        </ContextContainer>
      </PageContainer>
    </>
  );
}
