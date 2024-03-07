import React from 'react';
import PropTypes from 'prop-types';
import {
  LibraryGlobalContext,
  LibraryGlobalProvider,
} from '@leebrary/context/LibraryGlobalContext';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export function Provider({ children }) {
  return <LibraryGlobalProvider value={{}}>{children}</LibraryGlobalProvider>;
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default LibraryGlobalContext;
