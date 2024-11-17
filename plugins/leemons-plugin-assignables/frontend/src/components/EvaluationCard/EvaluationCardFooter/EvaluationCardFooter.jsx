/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { Box, FileIcon, Text } from '@bubbles-ui/components';
import { RoomItemDisplay } from '@comunica/components';
import { EvaluationCardFooterStyles } from './EvaluationCardFooter.styles';
import { EVALUATIONCARD_FOOTER_PROP_TYPES } from './EvaluationCardFooter.constants';

const EvaluationCardFooter = ({
  fileType,
  fileExtension,
  className,
  style,
  variant,
  variantTitle,
  variantIcon,
  students,
}) => {
  const { classes, cx } = EvaluationCardFooterStyles(
    { size: 12, color: '#636D7D' },
    { name: 'NYACardFooter' }
  );
  const variantIconLabel =
    (variantTitle ?? fileType ?? variant)?.charAt(0)?.toUpperCase() +
    (variantTitle ?? fileType ?? variant)?.slice(1);
  const studentsChatKeys =
    Array.isArray(students) &&
    students.length > 0 &&
    students.flatMap((student) => student.chatKeys);
  return (
    <Box className={cx(classes.root, className)} style={style}>
      {variantIcon ? (
        <Box className={classes.FileIconRoot}>
          {variantIcon}
          {variantIconLabel && <Text className={classes.FileIconLabel}>{variantIconLabel}</Text>}
        </Box>
      ) : (
        <Box className={classes.fileIconContainer}>
          <FileIcon
            size={24}
            fileType={fileType || variant}
            fileExtension={fileExtension}
            color={'#878D96'}
            hideExtension
          />
          <Text className={classes.fileLabel}>{variantIconLabel}</Text>
        </Box>
      )}

      {studentsChatKeys && (
        <Box className={classes.comunica}>
          <RoomItemDisplay chatKeys={studentsChatKeys} />
        </Box>
      )}
    </Box>
  );
};

EvaluationCardFooter.propTypes = EVALUATIONCARD_FOOTER_PROP_TYPES;

export { EvaluationCardFooter };
export default EvaluationCardFooter;
