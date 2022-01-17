import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { withLayout } from '@layout/hoc';
import { Button } from 'leemons-ui';
import selectFile from '../../../helpers/selectFile';
import { listAllMyFilesRequest, uploadFilesRequest, removeFileRequest } from '../../../request';
import IconByMimeType from '../../../components/IconByMimeType';

function Test() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    listMyFiles();
  }, []);

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

  return (
    <div className="bg-primary-content h-full">
      <Button color="primary" onClick={uploadFile}>
        Añadir archivo
      </Button>

      <div>Archivos:</div>
      <div className="flex">
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
      </div>
    </div>
  );
}

Test.propTypes = {
  session: PropTypes.object,
};

export default withLayout(Test);
