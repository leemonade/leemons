import React, { useMemo, useEffect, useState } from 'react';
import { forIn, map } from 'lodash';
import { withLayout } from '@layout/hoc';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getPlatformLocalesRequest, listCentersRequest } from '@users/request';
import prefixPN from '@curriculum/helpers/prefixPN';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Title,
  Text,
  AddCurriculumForm,
  ADD_CURRICULUM_FORM_MESSAGES,
  ADD_CURRICULUM_FORM_ERROR_MESSAGES,
} from '@bubbles-ui/components';
import { listProgramsRequest } from '@academic-portfolio/request';
import countryList from 'country-region-data';
import { addCurriculumRequest } from '../../../request';

function AddCurriculum() {
  const [saving, setSaving] = useState(false);
  const [selectData, setSelectData] = useState({});
  const [t] = useTranslateLoader(prefixPN('addCurriculum'));

  const history = useHistory();

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

  const load = async () => {
    try {
      const [
        { locales },
        {
          data: { items: centers },
        },
      ] = await Promise.all([
        getPlatformLocalesRequest(),
        listCentersRequest({ page: 0, size: 999999 }),
      ]);

      setSelectData({
        country: map(countryList, (item) => ({
          value: item.countryShortCode,
          label: item.countryName,
        })),
        language: map(locales, (item) => ({ value: item.code, label: item.name })),
        center: map(centers, (item) => ({ value: item.id, label: item.name })),
      });
    } catch (e) {
      console.error('e', e);
    }
  };

  const getProgramsListForCenter = async (center) => {
    const {
      data: { items: programs },
    } = await listProgramsRequest({ page: 0, size: 999999, center });
    return map(programs, (p) => ({ value: p.id, label: p.name }));
  };

  useEffect(() => {
    load();
  }, []);

  const onFormChange = async ({ value, name }) => {
    if (name === 'center') {
      const program = await getProgramsListForCenter(value.center);
      setSelectData({ ...selectData, program });
    }
  };

  const onSubmit = async ({ language, ...data }) => {
    try {
      setSaving(true);
      const { curriculum } = await addCurriculumRequest({ ...data, locale: language });
      await history.push(`/private/curriculum/${curriculum.id}/step/1`);
      setSaving(false);
    } catch (e) {
      setSaving(false);
    }
  };

  return (
    <Box m={32}>
      <Box mb={12}>
        <Title>{t('newCurriculum')}</Title>
      </Box>
      <Box mb={12}>
        <Text role={'productive'}>{t('description1')}</Text>
      </Box>
      <Box mb={16}>
        <Text role={'productive'}>{t('description2')}</Text>
      </Box>
      <AddCurriculumForm
        messages={messages}
        errorMessages={errorMessages}
        selectData={selectData}
        isLoading={saving}
        onSubmit={onSubmit}
        onFormChange={onFormChange}
      />
    </Box>
  );
}

export default withLayout(AddCurriculum);
