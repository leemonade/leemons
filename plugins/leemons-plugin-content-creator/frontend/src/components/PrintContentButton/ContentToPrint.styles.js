import { createStyles } from '@bubbles-ui/components';

const ContentToPrintStyles = createStyles((theme) => ({
  printEditor: {
    width: '210mm',
    minHeight: '297mm',
    padding: '20mm',
    margin: '0 auto',
    backgroundColor: 'white',

    '@media print': {
      width: '100%',
      height: 'auto',
      margin: 0,
      padding: 0,

      '@page': {
        size: 'A4',
        margin: '20mm',
      },

      '& > div': {
        width: '100%',
        height: 'auto',
        columnFill: 'auto',
      },

      'img, library': {
        maxWidth: '100%',
        height: 'auto !important',
        objectFit: 'contain',
        display: 'block',
        verticalAlign: 'middle',
        marginBottom: '0.5rem',
      },

      '[data-type="image-container"]': {
        overflow: 'hidden',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
        margin: '0.5rem 0',
        display: 'block',
        width: '100%',
        position: 'relative',
      },

      h1: {
        fontSize: '24px',
        marginTop: '16px',
        marginBottom: '12px',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
      },

      h3: {
        fontSize: '18px',
        marginTop: '12px',
        marginBottom: '8px',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
      },

      p: {
        margin: '0 0 8px 0',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
        lineHeight: 1.5,
      },

      '*': {
        color: '#0d0d0d',
        boxSizing: 'border-box',
      },

      '.content-section': {
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
        margin: '0.5rem 0',
      },

      'library[display="embed"]': {
        display: 'block',
        width: '100%',
        height: 'auto !important',
        maxHeight: '100vh !important',
        pageBreakInside: 'avoid',
        margin: '1rem 0',
        position: 'relative',
        '& img': {
          maxWidth: '100%',
          width: 'auto',
          height: 'auto !important',
          maxHeight: '80vh !important',
          objectFit: 'contain',
          display: 'block',
          margin: '0 auto',
        },
        '& > div': {
          width: '100%',
          height: 'auto !important',
          position: 'relative',
          overflow: 'hidden',
        },
      },

      'library:not([display="embed"])': {
        display: 'block',
        width: '100%',
        height: 'auto !important',
        pageBreakInside: 'avoid',
        margin: '1rem 0',
      },

      '.non-printable-content': {
        border: '1px solid black !important',
        borderRadius: '8px !important',
        padding: '10px !important',
        margin: '10px 0 !important',
        display: 'block !important',
        width: '100% !important',
      },

      '.buttonIcon, [class*="buttonIcon"]': {
        display: 'none !important',
      },
    },
  },
}));
export { ContentToPrintStyles };
