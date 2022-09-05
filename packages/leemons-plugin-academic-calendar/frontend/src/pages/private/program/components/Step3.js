import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { BigCalendar } from '@bubbles-ui/calendars';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { Box, Button, ContextContainer, Stack, TabPanel, Tabs } from '@bubbles-ui/components';
import { useLocale, useStore } from '@common';
import { useProcessCalendarConfigForBigCalendar } from '@academic-calendar/helpers/useProcessCalendarConfigForBigCalendar';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { saveConfig } from '@academic-calendar/request/config';

export default function Step3({ regionalConfigs, program, config, onPrev, onSave, t }) {
  const locale = useLocale();
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [processCalendarConfigForBigCalendar] = useProcessCalendarConfigForBigCalendar();
  const [store, render] = useStore({
    saving: false,
  });

  const coursesForDates = config.allCoursesHaveSameDates ? [program?.courses[0]] : program?.courses;

  async function submit() {
    try {
      store.saving = true;
      render();
      await saveConfig({
        ...config,
        program: program.id,
      });
      addSuccessAlert(t('saved'));
      onSave();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
    store.saving = false;
    render();
  }

  if (!program) return null;

  return (
    <ContextContainer divided>
      <ContextContainer>
        <Tabs forceRender>
          {coursesForDates.map((course) => {
            const bigCalendarConf = processCalendarConfigForBigCalendar(
              {
                ...config,
                program,
                regionalConfig: config.regionalConfig
                  ? _.find(regionalConfigs, { id: config.regionalConfig })
                  : undefined,
              },
              {
                course: course.id,
                locale,
              }
            );
            return (
              <TabPanel
                key={course.id}
                label={
                  config.allCoursesHaveSameDates
                    ? t('allCourses')
                    : `${t('course')} ${course.index}`
                }
              >
                <Box sx={(theme) => ({ marginTop: theme.spacing[4] })}>
                  <BigCalendar {...bigCalendarConf} />
                </Box>
              </TabPanel>
            );
          })}
        </Tabs>
      </ContextContainer>
      <Stack justifyContent="space-between">
        <Button
          disabled={store.saving}
          onClick={() => {
            onPrev({});
          }}
          compact
          variant="light"
          leftIcon={<ChevLeftIcon height={20} width={20} />}
        >
          {t('previous')}
        </Button>
        <Button loading={store.saving} onClick={submit}>
          {t('saveButton')}
        </Button>
      </Stack>
    </ContextContainer>
  );
}

Step3.propTypes = {
  regionalConfigs: PropTypes.any,
  program: PropTypes.any,
  config: PropTypes.any,
  onPrev: PropTypes.func,
  onSave: PropTypes.func,
  t: PropTypes.func,
};
