import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Button, Box, Paper, ContextContainer, Stack } from '@bubbles-ui/components';
import { useLayout } from '@layout/context';
import SelectUserAgent from '@users/components/SelectUserAgent';
import selectFile from '../../../helpers/selectFile';
import { listAllMyFilesRequest, uploadFilesRequest, removeFileRequest } from '../../../request';
import IconByMimeType from '../../../components/IconByMimeType';

export default function TestPage() {
  const [items, setItems] = useState([]);
  const { openConfirmationModal, openDeleteConfirmationModal } = useLayout();
  const [users, setUsers] = useState([]);

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
    <Paper shadow="none">
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
                console.log(data);
                setUsers(data);
              }}
              returnItem
            />
          </ContextContainer>
        </ContextContainer>
      </ContextContainer>
    </Paper>
  );
}

TestPage.propTypes = {
  session: PropTypes.object,
};
