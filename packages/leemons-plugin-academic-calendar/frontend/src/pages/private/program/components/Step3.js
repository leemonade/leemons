import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { BigCalendar } from '@bubbles-ui/calendars';
import { ChevLeftIcon, DownloadIcon } from '@bubbles-ui/icons/outline';
import {
  Box,
  Button,
  ContextContainer,
  Stack,
  TabPanel,
  Tabs,
  IconButton,
  Title,
} from '@bubbles-ui/components';
import { useLocale, useStore } from '@common';
import { useProcessCalendarConfigForBigCalendar } from '@academic-calendar/helpers/useProcessCalendarConfigForBigCalendar';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { saveConfig } from '@academic-calendar/request/config';
import CalendarKey from '@academic-calendar/components/CalendarKey';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function Step3({ regionalConfigs, program, config, onPrev, onSave, t }) {
  const locale = useLocale();
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [processCalendarConfigForBigCalendar] = useProcessCalendarConfigForBigCalendar();
  const [store, render] = useStore({
    saving: false,
  });
  const [isPrinting, setIsPrinting] = useState(false);

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

  useEffect(() => {
    if (!isPrinting) return;
    const input = document.getElementById('calendarToPrint');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      // eslint-disable-next-line new-cap
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'JPEG', 0, 0);
      pdf.save('download.pdf');
    });
    setIsPrinting(false);
  }, [isPrinting]);

  return (
    <ContextContainer divided>
      <ContextContainer>
        <Stack justifyContent="space-between" alignItems="center" style={{ marginInline: 8 }}>
          <Title order={1}>{program.name}</Title>
          <IconButton
            icon={<DownloadIcon height={16} width={16} />}
            color="primary"
            rounded
            label={t('downloadCalendar')}
            onClick={() => {
              setIsPrinting(true);
            }}
            loading={isPrinting}
          />
        </Stack>
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
                  <CalendarKey />
                </Box>
                <Stack
                  direction="column"
                  justifyContent="space-between"
                  alignItems="center"
                  height="100%"
                  id="calendarToPrint"
                  style={{
                    position: 'absolute',
                    left: -9999,
                    top: -9999,
                    width: '210mm',
                    minHeight: '297mm',
                    padding: 16,
                  }}
                >
                  <Box style={{ marginLeft: 89 }}>
                    <BigCalendar {...bigCalendarConf} />
                  </Box>
                  <Box style={{ width: '100%' }}>
                    <CalendarKey />
                  </Box>
                </Stack>
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
