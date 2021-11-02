import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { withLayout } from '@layout/hoc';
import { Button } from 'leemons-ui';
import selectFile from '../../../helpers/selectFile';
import { listAllMyFilesRequest, uploadFilesRequest } from '../../../request';
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

  return (
    <div className="bg-primary-content h-full">
      <Button color="primary" onClick={uploadFile}>
        Añadir archivo
      </Button>

      <div>Archivos:</div>
      <div className="flex">
        {items.map((item) => {
          console.log(item);
          if (item.type.indexOf('image') >= 0) {
            return <img style={{ width: '20%' }} key={item.id} src={item.localUrl} alt="" />;
          }
          return (
            <div key={item.id}>
              <IconByMimeType mimeType={item.type} />
              <div>
                <a href={item.localUrl}>
                  {item.name}.{item.extension}
                </a>
              </div>
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
