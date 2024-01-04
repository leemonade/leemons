import React, { useMemo } from 'react';
import { Box, Button, Text, createStyles } from '@bubbles-ui/components';
import { DownloadIcon } from '@bubbles-ui/icons/outline';
import { addAction, fireEvent, removeAction } from 'leemons-hooks';

import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import useSubjectClasses from '@academic-portfolio/hooks/useSubjectClasses';
import { addErrorAlert } from '@layout/alert';
import { useTitle } from './useTitle';

export default function Header({ filters = {}, variant, isStudent }) {
  /*
  --- Data fetching ---
  */
  const { data: subjectData } = useSubjectClasses(filters.subject, { enabled: !!filters.subject });

  const title = useTitle({ subject: subjectData, filters, variant, isStudent });

  return <Text>{title}</Text>;
}
