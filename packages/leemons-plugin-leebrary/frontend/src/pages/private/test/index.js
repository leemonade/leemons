import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Button, Box, ContextContainer, Stack } from '@bubbles-ui/components';
import selectFile from '../../../helpers/selectFile';
import { listAllMyFilesRequest, uploadFilesRequest, removeFileRequest } from '../../../request';
import IconByMimeType from '../../../components/IconByMimeType';

export default function TestPage() {
  const [items, setItems] = useState([]);

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
    listMyFiles();
  }, []);

  return (
    <Box>
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
    </Box>
  );
}

TestPage.propTypes = {
  session: PropTypes.object,
};
