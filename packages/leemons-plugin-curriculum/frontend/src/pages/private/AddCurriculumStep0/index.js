import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { filter, forIn, map } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';

import { listProgramsRequest } from '@academic-portfolio/request';
import { Box, createStyles, Title } from '@bubbles-ui/components';
import {
  ADD_CURRICULUM_FORM_ERROR_MESSAGES,
  ADD_CURRICULUM_FORM_MESSAGES,
  AddCurriculumForm,
} from '@bubbles-ui/leemons';
import { useStore } from '@common';
import prefixPN from '@curriculum/helpers/prefixPN';
import { getPlatformLocalesRequest, listCentersRequest } from '@users/request';
import { getCentersWithToken } from '@users/session';
import countryList from 'country-region-data';
import { addCurriculumRequest, listCurriculumRequest } from '../../../request';

const useStyle = createStyles((theme) => ({
  title: {
    paddingBottom: theme.spacing[4],
  },
}));

function AddCurriculumStep0({ onNext }) {
  const { classes } = useStyle();
  const [t] = useTranslateLoader(prefixPN('addCurriculum'));
  const [store, render] = useStore({
    saving: false,
    selectData: {},
  });

  const messages = useMemo(() => {
    const result = {};
    forIn(ADD_CURRICULUM_FORM_MESSAGES, (value, key) => {
      result[key] = t(key);
    });
    return result;
  }, [t]);

  const errorMessages = useMemo(() => {
    const result = {};
    forIn(ADD_CURRICULUM_FORM_ERROR_MESSAGES, (value, key) => {
      result[key] = t(key);
    });
    return result;
  }, [t]);

  async function load() {
    try {
      const [{ locales }] = await Promise.all([
        getPlatformLocalesRequest(),
        listCentersRequest({ page: 0, size: 999999 }),
      ]);

      store.selectData = {
        country: map(countryList, (item) => ({
          value: item.countryShortCode,
          label: item.countryName,
        })),
        language: map(locales, (item) => ({ value: item.code, label: item.name })),
        center: map(getCentersWithToken(), (item) => ({ value: item.id, label: item.name })),
      };
      render();
    } catch (e) {
      console.error('e', e);
    }
  }

  async function getProgramsListForCenter(center) {
    const {
      data: { items: programs },
    } = await listProgramsRequest({ page: 0, size: 999999, center });
    return map(programs, (p) => ({ value: p.id, label: p.name }));
  }

  async function onFormChange({ value, name }) {
    if (name === 'center') {
      const [
        program,
        {
          data: { items: curriculums },
        },
      ] = await Promise.all([
        getProgramsListForCenter(value.center),
        listCurriculumRequest({ page: 0, size: 999999 }),
      ]);
      const usedProgramIds = map(curriculums, 'program');

      store.selectData = {
        ...store.selectData,
        program: filter(program, (prog) => !usedProgramIds.includes(prog.value)),
      };
      render();
    }
  }

  async function onSubmit({ language, ...data }) {
    try {
      store.saving = true;
      render();
      const { curriculum } = await addCurriculumRequest({ ...data, locale: language });
      onNext({ curriculum });
    } catch (e) {
      // Nothing
    }
    store.saving = false;
    render();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Box>
      <Title order={3} className={classes.title}>
        {t('basicData')}
      </Title>
      <AddCurriculumForm
        messages={messages}
        errorMessages={errorMessages}
        selectData={store.selectData}
        isLoading={store.saving}
        onSubmit={onSubmit}
        onFormChange={onFormChange}
      />
    </Box>
  );
}

AddCurriculumStep0.propTypes = {
  onNext: PropTypes.func,
};

export default AddCurriculumStep0;
