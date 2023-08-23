import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Button, Box, Paper, ContextContainer, Stack, TagifyInput } from '@bubbles-ui/components';
import { AssetPlayer } from '@bubbles-ui/leemons';
import { useLayout } from '@layout/context';
import SelectUserAgent from '@users/components/SelectUserAgent';
import { LocaleDuration } from '@common/LocaleDate';
import { TextEditorInput } from '@common/components/TextEditorInput';
import ContentEditorInput from '@common/components/ContentEditorInput/ContentEditorInput';
import selectFile from '../../../helpers/selectFile';
import { listAllMyFilesRequest, uploadFilesRequest, removeFileRequest } from '../../../request';
import IconByMimeType from '../../../components/IconByMimeType';
import { ImagePicker } from '../../../components/ImagePicker';

export default function TestPage() {
  const [items, setItems] = useState([]);
  const { openConfirmationModal, openDeleteConfirmationModal } = useLayout();
  const [users, setUsers] = useState([]);
  const [selectedCover, setSelectedCover] = useState(null);

  const showConfirmDelete = (userID) => {
    openDeleteConfirmationModal({
      onConfirm: () => console.log('Confirmado:', userID),
    })();
  };

  const showConfirm = openConfirmationModal({
    onConfirm: () => console.log('Confirmado'),
  });

  const listMyFiles = async () => {
    const { files } = await listAllMyFilesRequest();
    setItems(files);
  };

  const uploadFile = async () => {
    const files = await selectFile({ multiple: true });
    await uploadFilesRequest(files);
    await listMyFiles();
  };

  const remove = async (id) => {
    await removeFileRequest(id);
    await listMyFiles();
  };

  useEffect(() => {
    // listMyFiles();
  }, []);

  return (
    <Paper fullWidth shadow="none">
      <ContextContainer divided>
        <Button onClick={uploadFile}>Añadir archivo</Button>
        <ContextContainer title="Archivos">
          <Box>
            <Stack>
              {items.map((item) => {
                if (item.type.indexOf('image') >= 0) {
                  return (
                    <div key={item.id}>
                      <img style={{ width: '20%' }} src={item.localUrl} alt="" />
                      <Button onClick={() => remove(item.id)}>Borrar</Button>
                    </div>
                  );
                }
                return (
                  <div key={item.id}>
                    <IconByMimeType mimeType={item.type} />
                    <div>
                      <a href={item.localUrl}>
                        {item.name}.{item.extension}
                      </a>
                    </div>
                    <Button onClick={() => remove(item.id)}>Borrar</Button>
                  </div>
                );
              })}
            </Stack>
          </Box>
        </ContextContainer>

        <ContextContainer title="Modales de confirmación">
          <Box>
            <Button onClick={showConfirm}>Confirmar</Button>
          </Box>
          <Box>
            <Button onClick={() => showConfirmDelete(1234)}>Borrar</Button>
          </Box>
        </ContextContainer>

        <ContextContainer title="Select UserAgents">
          <ContextContainer subtitle="maxSelectedValues (3)">
            <SelectUserAgent
              maxSelectedValues={3}
              value={users}
              onChange={(data) => {
                setUsers(data);
              }}
              returnItem
            />
          </ContextContainer>
        </ContextContainer>

        <TagifyInput
          label="Tagify"
          description="Probando el Tagify"
          value={''}
          settings={{
            mode: 'mix',
            pattern: /@/, // <- must define "patten" in mixed mode
            dropdown: {
              enabled: 1,
              position: 'text',
            },
            whitelist: [
              {
                id: 100,
                value: 'Subject:Numering',
                title: 'Subject:Numering',
              },
              { id: 101, value: 'Subject:Code', title: 'Subject:Code' },
              { id: 102, value: 'Block:Numering', title: 'Block:Numering' },
              { id: 103, value: 'Block:Code', title: 'Block:Code' },
              { id: 104, value: 'Stage:Numering', title: 'Stage:Numering' },
              { id: 105, value: 'Stage:Code', title: 'Stage:Code' },
              { id: 105, value: '01, 02, ..', title: '01, 02, ..' },
            ],
          }}
        />
        <ContextContainer title="ImagePicker example">
          <ImagePicker
            value={selectedCover}
            onChange={(e) => {
              console.log(e);
              setSelectedCover(e);
            }}
          />
        </ContextContainer>
        <ContextContainer title="LocaleDuration">
          <Box>
            <LocaleDuration seconds={200} />
          </Box>
        </ContextContainer>

        <ContextContainer title="TextEditorInput">
          <Box>
            <TextEditorInput onChange={(val) => console.log(val)} useJSON />
          </Box>
        </ContextContainer>
        <ContextContainer title="ContentEditorInput">
          <Box>
            <ContentEditorInput
              useSchema
              onChange={(val) => console.log(val)}
              labels={{ schema: 'Esquema' }}
            />
          </Box>
        </ContextContainer>
        <ContextContainer title="PDFPlayer">
          <Box>
            <AssetPlayer
              asset={{
                fileExtension: 'pdf',
                url: 'http://localhost:8080/api/leebrary/file/dc26b5f9-2809-4d23-b6ed-99ded4127cac?authorization=%5B%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uQ29uZmlnIjp7InByb2dyYW0iOiJkMzZkZWY3NC0zN2Y5LTQ5M2EtYmExZC0yZDJkNGFlMGQzMTAifSwidXNlckFnZW50IjoiYjA0NmU1MDktNzM0ZS00NGZlLWE5OWYtZDIwMDFkYmQ0MDA1IiwiaWF0IjoxNjc0NzIyMDE1LCJleHAiOjE2NzQ4MDg0MTV9.EzALBmUzOtjKG8pttc4GYiBPvomIEXQC8-trtoqtaqI%22%5D',
              }}
              useThumbnails
            />
          </Box>
        </ContextContainer>
      </ContextContainer>
    </Paper>
  );
}

TestPage.propTypes = {
  session: PropTypes.object,
};
