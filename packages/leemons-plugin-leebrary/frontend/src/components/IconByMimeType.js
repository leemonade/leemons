import PropTypes from 'prop-types';
import React from 'react';

export default function IconByMimeType({ mimeType }) {
  if (mimeType === 'application/pdf') {
    return <div>icono pdf</div>;
  }
  return <div>{mimeType}</div>;
}

IconByMimeType.propTypes = {
  mimeType: PropTypes.string,
};
