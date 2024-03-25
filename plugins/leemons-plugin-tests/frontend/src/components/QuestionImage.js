import React from 'react';
import PropTypes from 'prop-types';
import { Box, colord, COLORS, createStyles } from '@bubbles-ui/components';
import { numberToEncodedLetter } from '@common';
import { LeebraryImage } from '@leebrary/components';

export const QuestionImageStyles = createStyles((theme, { isLight }) => ({
  root: {},
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
    width: '100%',
    objectFit: 'contain',
  },
  imageContainer: {
    position: 'relative',
  },
}));

// eslint-disable-next-line import/prefer-default-export
export function QuestionImage({ src, markers, values, clue }) {
  const { classes } = QuestionImageStyles({
    isLight: markers ? colord(markers.backgroundColor).isLight() : false,
  });
  return (
    <Box className={classes.imageContainer}>
      <LeebraryImage className={classes.image} src={src} />
      {markers && markers.list
        ? markers.list.map((marker, index) => {
            let { backgroundColor } = markers;
            if (values) {
              backgroundColor = index === values[index] ? COLORS.fatic02 : COLORS.fatic01;
            }
            const opacity = markers.canShowHintMarker && marker.hideOnHelp ? 0.5 : 1;

            return (
              <Box
                key={index}
                className={classes.marker}
                style={{
                  top: marker.top,
                  left: marker.left,
                  backgroundColor,
                  opacity,
                }}
              >
                {markers.type === 'letter' ? numberToEncodedLetter(index + 1) : index + 1}
              </Box>
            );
          })
        : null}
    </Box>
  );
}

QuestionImage.propTypes = {
  src: PropTypes.any.isRequired,
  markers: PropTypes.shape({
    type: PropTypes.string,
    backgroundColor: PropTypes.string,
    list: PropTypes.any,
    canShowHintMarker: PropTypes.bool,
    hideOnHelp: PropTypes.bool,
  }).isRequired,
  values: PropTypes.any,
  clue: PropTypes.any,
};
