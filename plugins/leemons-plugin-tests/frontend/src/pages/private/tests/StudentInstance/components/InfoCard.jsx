import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { isNil } from 'lodash';

export default function InfoCard(props) {
  const { styles, number, label, icon, cx, reverse, withRedColor } = props;

  let root = styles.resumeBox;
  let labelClass = styles.resumeLabel;

  if (icon) {
    root = cx(root, styles.resumeBoxBig, styles.resumeBoxWithBorder);
    labelClass = cx(
      labelClass,
      styles.resumeLabelBig,
      styles.resumeLabelWithBorder,
      withRedColor ? styles.weightColorRed : styles.weightColorGreen
    );
  }
  if (reverse) {
    root = cx(root, styles.reverseResumeBoxBig);
  }

  return (
    <Box className={root}>
      {icon ? (
        <Box
          style={{
            width: '49px',
            height: ' 49px',
            backgroundImage: `url(${icon})`,
            backgroundSize: 'cover',
            paddingBlock: 24,
          }}
        />
      ) : null}
      {!isNil(number) ? <Box className={styles.resumeNumber}>{number}</Box> : null}
      <Box className={labelClass} style={{}} dangerouslySetInnerHTML={{ __html: label }} />
    </Box>
  );
}

InfoCard.propTypes = {
  styles: PropTypes.any,
  number: PropTypes.any,
  label: PropTypes.string,
  icon: PropTypes.string,
  cx: PropTypes.any,
  reverse: PropTypes.bool,
  withRedColor: PropTypes.bool,
};
