import React from 'react';
import {
  Box,
  Button,
  ContextContainer,
  PageContainer,
  PageHeader,
  Paper,
  Switch,
  TabPanel,
  Tabs,
  Textarea,
} from '@bubbles-ui/components';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@comunica/helpers/prefixPN';
import { useStore } from '@common';
import { ConfigPageStyles } from '@comunica/pages/private/ConfigPage/index.styles';
import { Controller, useForm } from 'react-hook-form';
import { SelectCenter } from '@users/components';
import { listProgramsRequest } from '@academic-portfolio/request';
import RoomService from '@comunica/RoomService';
import useRequestErrorMessage from '@common/useRequestErrorMessage';

export default function ConfigPage() {
  const [t] = useTranslateLoader(prefixPN('config'));
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const { classes } = ConfigPageStyles();
  const [store, render] = useStore({
    programs: [],
  });

  const form = useForm();
  const values = form.watch();

  function selectCenter(center) {
    store.center = center;
    render();
  }

  async function load() {
    if (store.center) {
      const [
        config,
        {
          data: { items },
        },
      ] = await Promise.all([
        RoomService.getAdminConfig(store.center),
        listProgramsRequest({
          page: 0,
          size: 9999,
          center: store.center,
        }),
      ]);
      store.programs = items;
      form.reset(config);
    }
  }

  async function save() {
    try {
      store.saving = true;
      render();
      const data = form.getValues();
      await RoomService.saveAdminConfig(store.center, data);
      addSuccessAlert(t('saveDone'));
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
    store.saving = false;
    render();
  }

  React.useEffect(() => {
    load();
  }, [store.center]);

  return (
    <ContextContainer fullHeight>
      <PageHeader
        values={{
          title: t('title'),
          description: t('description'),
        }}
        fullWidth
      />
      <Paper color="solid" shadow="none" padding="none">
        <PageContainer noFlex>
          <Box className={classes.subTitle}>{t('permissions')}</Box>
          <Paper fullWidth padding={5}>
            <ContextContainer divided>
              <Controller
                name="enabled"
                control={form.control}
                render={({ field: { value, ...field } }) => (
                  <Switch {...field} label={t('enableChat')} checked={value} />
                )}
              />
              <ContextContainer subtitle={t('center')}>
                <Box style={{ maxWidth: '260px' }}>
                  <SelectCenter firstSelected onChange={selectCenter} value={store.center} />
                </Box>
                <Box>
                  <Controller
                    name="enableSecureWords"
                    control={form.control}
                    render={({ field: { value, ...field } }) => (
                      <Switch {...field} label={t('secureWords')} checked={value} />
                    )}
                  />
                  <Controller
                    name="secureWords"
                    control={form.control}
                    render={({ field }) => (
                      <Box style={{ maxWidth: '600px' }}>
                        <Textarea
                          {...field}
                          disabled={!values.enableSecureWords}
                          placeholder={t('wordsByCommas')}
                        />
                      </Box>
                    )}
                  />
                </Box>

                <ContextContainer subtitle={t('students')}>
                  <Box>
                    <Controller
                      name="enableStudentsChats"
                      control={form.control}
                      render={({ field: { value, ...field } }) => (
                        <Switch {...field} label={t('enableStudentsChats')} checked={value} />
                      )}
                    />

                    <Controller
                      name="enableStudentsCreateGroups"
                      control={form.control}
                      render={({ field: { value, ...field } }) => (
                        <Switch
                          {...field}
                          label={t('enableStudentsCreateGroups')}
                          checked={value}
                        />
                      )}
                    />
                    <Controller
                      name={`disableChatsBetweenStudentsAndTeachers`}
                      control={form.control}
                      render={({ field: { value, ...field } }) => (
                        <Switch
                          {...field}
                          label={t('disableChatsBetweenStudentsAndTeachers')}
                          checked={value}
                        />
                      )}
                    />
                    <Controller
                      name={`studentsCanAddTeachersToGroups`}
                      control={form.control}
                      render={({ field: { value, ...field } }) => (
                        <Switch
                          {...field}
                          label={t('studentsCanAddTeachersToGroups')}
                          checked={value}
                        />
                      )}
                    />
                  </Box>
                </ContextContainer>
              </ContextContainer>
              <ContextContainer subtitle={t('programs')}>
                <Tabs usePageLayout={false}>
                  {store.programs.map((program) => (
                    <TabPanel key={program.id} label={program.name}>
                      <ContextContainer padded divided>
                        <ContextContainer subtitle={t('general')}>
                          <Controller
                            name={`program[${program.id}].enableSubjectsRoom`}
                            control={form.control}
                            render={({ field: { value, ...field } }) => (
                              <Switch {...field} label={t('enableSubjectsRoom')} checked={value} />
                            )}
                          />
                        </ContextContainer>
                        <ContextContainer subtitle={t('teachers')}>
                          <Box>
                            <Controller
                              name={`program[${program.id}].teachersCanDisableSubjectsRooms`}
                              control={form.control}
                              render={({ field: { value, ...field } }) => (
                                <Switch
                                  {...field}
                                  label={t('teachersCanDisableSubjectsRooms')}
                                  checked={value}
                                />
                              )}
                            />
                            <Controller
                              name={`program[${program.id}].teachersCanMuteStudents`}
                              control={form.control}
                              render={({ field: { value, ...field } }) => (
                                <Switch
                                  {...field}
                                  label={t('teachersCanMuteStudents')}
                                  checked={value}
                                />
                              )}
                            />
                            <Controller
                              name={`program[${program.id}].onlyTeachersCanWriteInSubjectsRooms`}
                              control={form.control}
                              render={({ field: { value, ...field } }) => (
                                <Switch
                                  {...field}
                                  label={t('onlyTeachersCanWriteInSubjectsRooms')}
                                  checked={value}
                                />
                              )}
                            />
                          </Box>
                        </ContextContainer>
                      </ContextContainer>
                    </TabPanel>
                  ))}
                </Tabs>
              </ContextContainer>
            </ContextContainer>
            <Box className={classes.saveContainer}>
              <Button loading={store.saving} onClick={save}>
                {t('save')}
              </Button>
            </Box>
          </Paper>
        </PageContainer>
      </Paper>
    </ContextContainer>
  );
}
