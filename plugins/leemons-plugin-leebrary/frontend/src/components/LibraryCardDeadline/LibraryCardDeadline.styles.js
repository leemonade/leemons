import { createStyles, pxToRem, getFontProductive } from '@bubbles-ui/components';

const inRange = (value, min, max) => {
  return value > min && value <= max;
};

const getSeverityColor = (theme, severity) => {
  switch (severity) {
    case 'low':
      return theme.colors.fatic02;
    case 'medium':
      return theme.colors.fatic03;
    case 'high':
      return theme.colors.fatic01;
    default:
      return theme.colors.fatic02;
  }
};

const getTitleColor = (theme, remainingDays, isNew, severity, role) => {
  const isTeacher = role === 'teacher';
  const isStudent = role === 'student';
  if (isNew) return theme.colors.fatic02;
  if (isTeacher) return getTeacherColor(theme, remainingDays, severity);
  else if (isStudent) return getStudentColor(theme, remainingDays, severity);
};

const getTeacherColor = (theme, remainingDays, severity) => {
  if (severity) return getSeverityColor(theme, severity);
  if (inRange(remainingDays, 5, 7)) return theme.colors.fatic03;
  if (remainingDays > 7) return theme.colors.fatic01;
  return theme.colors.fatic02;
};

const getStudentColor = (theme, remainingDays, severity) => {
  if (severity) return getSeverityColor(theme, severity);
  if (remainingDays <= 2 || remainingDays == 1) return theme.colors.fatic01;
  if (remainingDays < 5) return theme.colors.fatic03;
  return theme.colors.fatic02;
};

export const LibraryCardDeadlineStyles = createStyles(
  (theme, { isNew, parentHovered, remainingDays, severity, role }) => {
    const titleColor = getTitleColor(theme, remainingDays, isNew, severity, role);

    return {
      root: {
        ...getFontProductive(theme.fontSizes['2'], 400),
        display: 'flex',
        padding: pxToRem(8),
        backgroundColor: 'white',
      },
      icon: {
        color: theme.colors.text04,
        marginRight: 8,
        marginTop: 2,
      },
      title: {
        fontWeight: 600,
        fontSize: pxToRem(12),
        lineHeight: pxToRem(20),
        color: titleColor,
      },
      deadline: {
        color: theme.colors.text02,
        fontSize: pxToRem(12),
        lineHeight: pxToRem(14),
        height: parentHovered ? 14 : 0,
        transition: 'height 0.2s ease-in, opacity 0.3s ease-in, max-width 0.3s ease-in',
        overflow: 'hidden',
      },
      info: {},
    };
  }
);
