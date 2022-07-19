import React from 'react';
import PropTypes from 'prop-types';
import { Box, createStyles } from '@bubbles-ui/components';
import { RemoveIcon, ZoomInIcon, ZoomOutIcon } from '@bubbles-ui/icons/outline';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useStore } from '@common/useStore';

const Styles = createStyles((theme, { open }) => ({
  modalWrapper: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 999,
    opacity: open ? 1 : 0,
    pointerEvents: open ? 'all' : 'none',
    transition: 'opacity 0.3s ease-in-out',
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50px',
    height: '50px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: theme.colors.text07,
    zIndex: 2,
    borderRadius: '0 0 0 4px',
    fontSize: theme.fontSizes[5],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    svg: {
      transition: '300ms',
    },
    '&:hover': {
      svg: {
        transform: 'rotate(90deg)',
      },
    },
  },
  content: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tools: {
    position: 'absolute',
    zIndex: 2,
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    height: '50px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: theme.colors.text07,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '4px 4px 0 0',
    fontSize: theme.fontSizes[5],
    div: {
      height: '50px',
      width: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: '100ms',
      '&:hover': {
        transform: 'scale(1.1)',
      },
    },
  },
}));

function ModalZoom({ children }) {
  const [store, render] = useStore({
    open: false,
  });

  const { classes } = Styles(store);

  return (
    <>
      <Box
        style={{ cursor: 'pointer' }}
        onClick={() => {
          store.open = true;
          render();
        }}
      >
        {children}
      </Box>
      <Box className={classes.modalWrapper}>
        <Box
          className={classes.close}
          onClick={() => {
            store.open = false;
            render();
          }}
        >
          <RemoveIcon />
        </Box>
        <TransformWrapper minScale={0.1} maxScale={50} centerOnInit={true} initialScale={1}>
          {({ zoomIn, zoomOut, resetTransform, centerView }) => (
            <React.Fragment>
              <Box className={classes.tools}>
                <Box onClick={() => zoomIn()}>
                  <ZoomInIcon />
                </Box>
                <Box onClick={() => zoomOut()}>
                  <ZoomOutIcon />
                </Box>
              </Box>

              <TransformComponent
                wrapperStyle={{
                  width: '100vw',
                  height: '100vh',
                  maxWidth: '100vw',
                  maxHeight: '100vh',
                }}
              >
                {children}
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>
      </Box>
    </>
  );
}

ModalZoom.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ModalZoom };
