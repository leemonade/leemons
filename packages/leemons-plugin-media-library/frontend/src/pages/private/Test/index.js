import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { withLayout } from '@layout/hoc';
import { Button } from 'leemons-ui';
import selectFile from '../../../helpers/selectFile';

function Test() {
  return (
    <div className="bg-primary-content h-full">
      <Button color="primary" onClick={() => selectFile({ multiple: true })}>
        Añadir archivo
      </Button>
    </div>
  );
}

Test.propTypes = {
  session: PropTypes.object,
};

export default withLayout(Test);
