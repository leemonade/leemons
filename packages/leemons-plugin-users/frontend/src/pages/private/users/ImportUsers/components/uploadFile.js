import { Box, Button, ContextContainer, FileUpload, NumberInput } from '@bubbles-ui/components';
import { CloudUploadIcon, DownloadIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { getDataForUserAgentDatasetsRequest } from '../../../../../request';
import {
  downloadTemplate,
  getTemplateIndexs,
  getTemplateIndexsLabels,
} from '../helpers/downloadTemplate';
import { readExcel } from '../helpers/readExcel';
import { XlsxTable } from './xlsxTable';

export function UploadFile({ t, center, profile }) {
  const [store, render] = useStore();
  const [, , , getErrorMessage] = useRequestErrorMessage();

  async function load() {
    const { data } = await getDataForUserAgentDatasetsRequest();
  }

  async function onSelectFile(e) {
    if (e instanceof File) {
      store.file = await readExcel(e);
      store.fileIsTemplate = false;
      store.initRow = 1;
      store.templateIndexs = getTemplateIndexs();
      store.templateIndexsLabels = getTemplateIndexsLabels(t);
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
      render();
    }
  }

  async function removeFile() {
    store.file = null;
    render();
  }

  async function onSave() {
    removeFile();
  }

  React.useEffect(() => {
    load();
  }, []);

  return (
    <ContextContainer
      subtitle={
        <Box
          sx={() => ({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' })}
        >
          {t('uploadFile')}
          {!store.file ? (
            <Button onClick={() => downloadTemplate({ t })} leftIcon={<DownloadIcon />}>
              {t('downloadTemplate')}
            </Button>
          ) : (
            <Button variant="link" onClick={removeFile}>
              {t('cancel')}
            </Button>
          )}
        </Box>
      }
    >
      {!store.file ? (
        <FileUpload
          icon={<CloudUploadIcon height={32} width={32} />}
          title={t('browseFile')}
          subtitle={t('dropFile')}
          hideUploadButton
          single
          accept={['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
          onChange={onSelectFile}
        />
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
            center={center}
            profile={profile}
            file={store.file}
            initRow={store.initRow}
            headerSelects={store.headerSelects}
            fileIsTemplate={store.fileIsTemplate}
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
};

export default UploadFile;
