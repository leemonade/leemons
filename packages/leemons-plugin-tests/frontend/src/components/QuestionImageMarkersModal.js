import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  colord,
  ColorInput,
  COLORS,
  ContextContainer,
  createStyles,
  Menu,
  Modal,
  Select,
  Stack,
  Title,
} from '@bubbles-ui/components';
import { numberToEncodedLetter, useStore } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { LeebraryImage } from '@leebrary/components';

export const QuestionImageMarkersModalStyles = createStyles((theme, { isLight }) => ({
  root: {},
  title: {},
  options: {},
  marker: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    position: 'absolute',
    textAlign: 'center',
    lineHeight: '26px',
    color: isLight ? theme.colors.text01 : theme.colors.text07,
  },
  image: {
    maxWidth: '100%',
    maxHeight: '65vh',
    objectFit: 'contain',
  },
  imageContainer: {
    position: 'relative',
    display: 'table',
    margin: '0 auto',
  },
}));

// eslint-disable-next-line import/prefer-default-export
export function QuestionImageMarkersModal({ src = '', value = {}, onChange, onClose, opened }) {
  const [t] = useTranslateLoader(prefixPN('questionImageModal'));
  const [store, render] = useStore({
    list: value.list || [],
    type: value.type || 'numbering',
    backgroundColor: value.backgroundColor || COLORS.interactive01,
  });
  const { classes } = QuestionImageMarkersModalStyles({
    isLight: colord(store.backgroundColor).isLight(),
  });

  function backgroundColorChange(e) {
    store.backgroundColor = e;
    render();
  }

  function typeChange(e) {
    store.type = e;
    render();
  }

  function getImage(el) {
    if (el) {
      if (el.nodeName === 'IMG') {
        return el;
      }
      if (el.firstChild && el.firstChild.nodeName === 'IMG') {
        return el.firstChild;
      }
      return getImage(el.parentNode);
    }
    return null;
  }

  function getClick(event) {
    const image = getImage(event.target);
    if (image) {
      const rect = image.getClientRects();
      const markerSize = 26 / 2;
      return {
        left: `${((event.clientX - rect[0].left - markerSize) / rect[0].width) * 100}%`,
        top: `${((event.clientY - rect[0].top - markerSize) / rect[0].height) * 100}%`,
      };
    }
    return null;
  }

  function addMarker(event) {
    if (store.moveIndex >= 0 && store.moveIndex !== null) {
      store.list[store.moveIndex] = getClick(event);
      store.moveIndex = null;
      render();
    } else {
      store.list.push(getClick(event));
      render();
    }
  }

  function removeMarker(index) {
    store.list.splice(index, 1);
    render();
  }

  function getPosition(event) {
    const click = getClick(event);
    if (click) {
      store.position = getClick(event);
      if (store.moveIndex >= 0) {
        render();
      }
    }
  }

  function moveMarker(index, event) {
    store.moveIndex = index;
    event.stopPropagation();
    event.preventDefault();
  }

  return (
    <Modal trapFocus={false} size={1100} withCloseButton={false} opened={opened} onClose={onClose}>
      <ContextContainer>
        <Title className={classes.title} order={2}>
          {t('createNumbering')}
        </Title>

        <ContextContainer direction="row" className={classes.options}>
          <Select
            label={t('type')}
            required
            value={store.type}
            onChange={typeChange}
            data={[
              {
                label: t('numberingStyle1'),
                value: 'numbering',
              },
              {
                label: t('numberingStyle2'),
                value: 'letter',
              },
            ]}
          />

          <ColorInput
            label={t('color')}
            useHsl
            compact={false}
            manual={false}
            value={store.backgroundColor}
            onChange={backgroundColorChange}
          />
        </ContextContainer>

        <Box className={classes.imageContainer}>
          <Box className={classes.imageContainer} onClick={addMarker} onMouseMove={getPosition}>
            <LeebraryImage className={classes.image} src={src} />
          </Box>

          {store.list.map((marker, index) => {
            if (store.moveIndex === index) {
              return (
                <Box
                  key={index}
                  style={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    top: store.position.top,
                    left: store.position.left,
                    backgroundColor: store.backgroundColor,
                  }}
                  className={classes.marker}
                >
                  {store.type === 'letter' ? numberToEncodedLetter(index + 1) : index + 1}
                </Box>
              );
            }
            return (
              <Menu
                key={index}
                style={{
                  position: 'absolute',
                  top: marker.top,
                  left: marker.left,
                }}
                items={[
                  {
                    children: t('delete'),
                    onClick: () => removeMarker(index),
                  },
                  {
                    children: t('move'),
                    onClick: (e) => moveMarker(index, e),
                  },
                ]}
                control={
                  <Box>
                    <Box
                      className={classes.marker}
                      style={{ backgroundColor: store.backgroundColor }}
                    >
                      {store.type === 'letter' ? numberToEncodedLetter(index + 1) : index + 1}
                    </Box>
                  </Box>
                }
              />
            );
          })}
        </Box>
        <Stack justifyContent="space-between">
          <Button variant="link" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button
            onClick={() => {
              onChange(store);
              onClose();
            }}
          >
            {t('save')}
          </Button>
        </Stack>
      </ContextContainer>
    </Modal>
  );
}

QuestionImageMarkersModal.propTypes = {
  src: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      index: PropTypes.number.isRequired,
      top: PropTypes.number.isRequired,
      left: PropTypes.number.isRequired,
    })
  ),
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  opened: PropTypes.bool,
};
