import React, { useEffect, useState } from 'react';
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
  Text,
  TextClamp,
} from '@bubbles-ui/components';
import { numberToEncodedLetter } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { LeebraryImage } from '@leebrary/components';

const DROPDOWN_WIDTH = 90;

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
    cursor: 'pointer',
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
  const [list, setList] = useState([]);
  const [type, setType] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [moveIndex, setMoveIndex] = useState(null);
  const [position, setPosition] = useState({ top: null, left: null });

  const { classes } = QuestionImageMarkersModalStyles({
    isLight: colord(backgroundColor).isLight(),
  });

  useEffect(() => {
    if (value) {
      setList(value.list ? value.list.map((item) => ({ ...item })) : []);
      setType(value.type || 'numbering');
      setBackgroundColor(value.backgroundColor || COLORS.interactive01);
    }
  }, [value]);

  function backgroundColorChange(e) {
    setBackgroundColor(e);
  }

  function typeChange(e) {
    setType(e);
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
    if (moveIndex >= 0 && moveIndex !== null) {
      setList(list.map((item, index) => (index === moveIndex ? getClick(event) : item)));
      setMoveIndex(null);
    } else {
      setList([...list, getClick(event)]);
    }
  }

  function removeMarker(index) {
    setList(list.filter((item, i) => i !== index));
  }

  function getPosition(event) {
    const click = getClick(event);
    if (click) {
      setPosition(getClick(event));
    }
  }

  function moveMarker(index, event) {
    setMoveIndex(index);
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
            value={type}
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
            compact={false}
            manual={false}
            value={backgroundColor}
            onChange={backgroundColorChange}
          />
        </ContextContainer>

        <Box className={classes.imageContainer}>
          <Box className={classes.imageContainer} onClick={addMarker} onMouseMove={getPosition}>
            <LeebraryImage className={classes.image} src={src} />
          </Box>

          {list.map((marker, index) => {
            if (moveIndex === index) {
              return (
                <Box
                  key={index}
                  style={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    top: position.top,
                    left: position.left,
                    backgroundColor,
                  }}
                  className={classes.marker}
                >
                  {type === 'letter' ? numberToEncodedLetter(index + 1) : index + 1}
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
                dropdownWidth={DROPDOWN_WIDTH}
                items={[
                  {
                    children: (
                      <TextClamp lines={1} withTooltip>
                        <Text strong>{t('delete')}</Text>
                      </TextClamp>
                    ),
                    onClick: () => removeMarker(index),
                  },
                  {
                    children: (
                      <TextClamp lines={1} withTooltip>
                        <Text strong>{t('move')}</Text>
                      </TextClamp>
                    ),
                    onClick: (e) => moveMarker(index, e),
                  },
                ]}
                control={
                  <Box>
                    <Box className={classes.marker} style={{ backgroundColor }}>
                      {type === 'letter' ? numberToEncodedLetter(index + 1) : index + 1}
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
              onChange({
                list,
                type,
                backgroundColor,
                position,
              });
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
