import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { isNil } from 'lodash';

export default function InfoCard(props) {
  const { styles, number, label, icon, cx } = props;

  let root = styles.resumeBox;
  let labelClass = styles.resumeLabel;

  if (icon) {
    root = cx(root, styles.resumeBoxBig);
    labelClass = cx(labelClass, styles.resumeLabelBig);
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
          }}
        />
      ) : null}
      {!isNil(number) ? <Box className={styles.resumeNumber}>{number}</Box> : null}
      <Box className={labelClass} dangerouslySetInnerHTML={{ __html: label }} />
    </Box>
  );
}

InfoCard.propTypes = {
  styles: PropTypes.any,
  number: PropTypes.any,
  label: PropTypes.string,
  icon: PropTypes.string,
  cx: PropTypes.any,
};
