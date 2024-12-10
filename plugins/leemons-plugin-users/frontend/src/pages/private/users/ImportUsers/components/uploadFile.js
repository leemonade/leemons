import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Box,
  Stack,
  Button,
  Checkbox,
  FileUpload,
  NumberInput,
  InputWrapper,
  ContextContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { ChevLeftIcon, DownloadIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import { useLocale } from '@common/LocaleDate';
import { useDatasetSchema } from '@dataset/hooks/queries';
import _ from 'lodash';
import PropTypes from 'prop-types';

import {
  downloadTemplate,
  getTemplateIndexs,
  getTemplateIndexsLabels,
} from '../helpers/downloadTemplate';
import { readExcel } from '../helpers/readExcel';

import { XlsxTable } from './xlsxTable';

import { useUserList } from '@users/hooks/queries/useUserList';

export function UploadFile({ t, center, profile, scrollRef }) {
  const [store, render] = useStore();
  const [includeData, setIncludeData] = useState(false);
  const history = useHistory();
  const locale = useLocale();

  const { data: userDatasetSchema } = useDatasetSchema({
    locationName: 'user-data',
    pluginName: 'users',
    locale,
  });

  const { data: profileDataset } = useDatasetSchema({
    locationName: `profile.${profile}`,
    pluginName: 'users',
    locale,
    options: { enabled: !!profile },
  });

  const enabledUserList = !!profile && includeData;

  const { data: userList, isLoading: isLoadingUserList } = useUserList({
    params: {
      page: 0,
      size: 1000000,
      sort: { surnames: 1, name: 1 },
      collation: { locale },
      query: { profiles: profile, includeUserDataset: true },
    },
    options: { enabled: enabledUserList },
  });

  function prepareDataset() {
    const { compileJsonSchema, jsonUI } = userDatasetSchema ?? {};

    store.generalDataset = userDatasetSchema;
    store.generalDatasetEdit = [];
    _.forIn(compileJsonSchema?.properties ?? {}, (value, key) => {
      const ui = jsonUI[key];
      if (!ui?.['ui:readonly']) {
        store.generalDatasetEdit.push({
          value: `dataset-common.${key}`,
          label: value.title,
        });
      }
    });

    render();
  }

  async function onSelectFile(e) {
    store.loading = true;
    render();
    if (e instanceof File) {
      const { users, dataset } = await readExcel(e);
      store.file = users;
      store.dataset = dataset;

      store.fileIsTemplate = false;
      store.initRow = 1;
      store.templateIndexs = getTemplateIndexs({ extraFields: store.generalDatasetEdit });
      store.templateIndexsLabels = getTemplateIndexsLabels(t, {
        extraFields: store.generalDatasetEdit,
      });
      store.headerSelects = [];
      _.forEach(store.templateIndexs, (value, key) => {
        store.headerSelects.push({
          label: store.templateIndexsLabels[key],
          value,
        });
      });
      if (JSON.stringify(store.file[0]) === JSON.stringify(store.templateIndexs)) {
        store.fileIsTemplate = true;
        store.initRow = 3;
      }
      store.loading = false;
      render();
    }
  }

  async function removeFile() {
    store.file = null;
    store.rawFile = null;
    render();
  }

  function goToUsersList() {
    history.push('/private/users/list');
  }

  async function onSave() {
    goToUsersList();
  }

  async function onCancel() {
    removeFile();
  }

  React.useEffect(() => {
    prepareDataset();
  }, [userDatasetSchema]);

  return (
    <ContextContainer title={t('uploadLabel')}>
      {!store.file && (
        <Stack direction="column" spacing={2}>
          <Checkbox
            label={t('updateExistingUsers')}
            checked={includeData}
            onChange={(value) => setIncludeData(value)}
          />
          <Box>
            <Button
              variant="outline"
              onClick={() =>
                downloadTemplate({
                  t,
                  extraFields: store.generalDatasetEdit,
                  profileDataset,
                  skipProfileDataset: true, // TODO: Remove this when the import phase of datasets is implemented
                  userList: enabledUserList ? userList?.items : null,
                })
              }
              leftIcon={<DownloadIcon />}
              disabled={enabledUserList && isLoadingUserList}
              loading={enabledUserList && isLoadingUserList}
            >
              {t('downloadTemplate')}
            </Button>
          </Box>
        </Stack>
      )}
      {!store.file ? (
        <>
          <InputWrapper label={t('uploadFile')}>
            <FileUpload
              icon={<DownloadIcon height={32} width={32} />}
              title={t('browseFile')}
              subtitle={t('dropFile')}
              hideUploadButton
              single
              accept={['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
              onChange={onSelectFile}
              loading={store.loading}
              disabled={store.loading}
            />
          </InputWrapper>
          <TotalLayoutFooterContainer
            fixed
            fullWidth
            leftZone={
              <Button variant="link" onClick={goToUsersList} leftIcon={<ChevLeftIcon />}>
                {t('backToUsers')}
              </Button>
            }
          />
        </>
      ) : (
        <ContextContainer>
          {!store.fileIsTemplate ? (
            <NumberInput
              style={{ width: 100 }}
              min={1}
              value={store.initRow}
              onChange={(e) => {
                store.initRow = e;
                render();
              }}
              label={t('rowStart')}
            />
          ) : null}

          <XlsxTable
            t={t}
            onSave={onSave}
            onCancel={onCancel}
            generalDataset={store.generalDataset}
            center={center}
            profile={profile}
            file={store.file}
            initRow={store.initRow}
            headerSelects={store.headerSelects}
            fileIsTemplate={store.fileIsTemplate}
            scrollRef={scrollRef}
          />
        </ContextContainer>
      )}
    </ContextContainer>
  );
}

UploadFile.propTypes = {
  t: PropTypes.func,
  center: PropTypes.string,
  profile: PropTypes.string,
  scrollRef: PropTypes.object,
};

export default UploadFile;
