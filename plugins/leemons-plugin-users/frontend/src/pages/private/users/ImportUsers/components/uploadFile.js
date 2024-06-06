import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Box,
  Button,
  FileUpload,
  NumberInput,
  InputWrapper,
  ContextContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { ChevLeftIcon, DownloadIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import { useHistory } from 'react-router-dom';
import { getDataForUserAgentDatasetsRequest } from '@users/request';
import {
  downloadTemplate,
  getTemplateIndexs,
  getTemplateIndexsLabels,
} from '../helpers/downloadTemplate';
import { readExcel } from '../helpers/readExcel';
import { XlsxTable } from './xlsxTable';

export function UploadFile({ t, center, profile, scrollRef }) {
  const [store, render] = useStore();
  const history = useHistory();

  async function load() {
    try {
      const { data } = await getDataForUserAgentDatasetsRequest();

      if (data?.length) {
        const schema = data[0].data.jsonSchema;
        const ui = data[0].data.jsonUI;
        store.generalDataset = data[0].data;
        store.generalDatasetEdit = [];
        _.forIn(schema.properties, (value, key) => {
          let add = true;
          if (ui[key]?.['ui:readonly']) {
            add = false;
          }
          if (add) {
            store.generalDatasetEdit.push({
              value: `dataset-common.${key}`,
              label: value.title,
            });
          }
        });
        render();
      }
    } catch (e) {
      // Nothing
    }
  }

  async function onSelectFile(e) {
    store.loading = true;
    render();
    if (e instanceof File) {
      store.file = await readExcel(e);
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
    load();
  }, []);

  return (
    <ContextContainer title={t('uploadLabel')}>
      {!store.file && (
        <Box>
          <Button
            variant="outline"
            onClick={() => downloadTemplate({ t, extraFields: store.generalDatasetEdit })}
            leftIcon={<DownloadIcon />}
          >
            {t('downloadTemplate')}
          </Button>
        </Box>
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
