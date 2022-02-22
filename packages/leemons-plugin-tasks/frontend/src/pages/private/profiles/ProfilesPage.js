import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ContextContainer, PageContainer, Button, Box } from '@bubbles-ui/components';
import { useForm, Controller } from 'react-hook-form';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import { SelectProfile } from '@users/components/SelectProfile';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { getProfiles, setProfiles } from '../../../request/profiles';

export default function ProfilesPage() {
  const { control, handleSubmit, getFieldState, setValue } = useForm();
  const history = useHistory();

  useEffect(async () => {
    const profiles = await getProfiles(['teacher', 'student']);

    profiles
      .filter(({ profile }) => profile)
      .forEach(({ key, profile }) => {
        const state = getFieldState(key);

        if (!state.isTouched) {
          setValue(key, profile);
        }
      });
  }, []);

  const onSubmit = async (data) => {
    try {
      await setProfiles(Object.entries(data).map(([key, profile]) => ({ key, profile })));
      addSuccessAlert('PROFILES SAVED');

      history.push('/private/tasks/welcome');
    } catch (e) {
      addErrorAlert(e.message);
    }
  };

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={{
          title: 'PROFILES PAGE',
          description: 'DESCRIPTION',
        }}
      />
      <PageContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ContextContainer>
            <Controller
              name="teacher"
              control={control}
              render={({ field }) => (
                <SelectProfile
                  {...field}
                  label="SELECT TEACHER PROFILE"
                  description="RESPONSIBLE OF CLASSES"
                />
              )}
            />
            <Controller
              name="student"
              control={control}
              render={({ field }) => (
                <SelectProfile
                  {...field}
                  label="SELECT STUDENT PROFILE"
                  description="ASSIGNED TO TASKS"
                />
              )}
            />
            <Box>
              <Button type="submit">SAVE PROFILES</Button>
            </Box>
          </ContextContainer>
        </form>
      </PageContainer>
    </ContextContainer>
  );
}
