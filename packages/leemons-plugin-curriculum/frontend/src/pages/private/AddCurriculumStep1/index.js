import React from 'react';
import { withLayout } from '@layout/hoc';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@curriculum/helpers/prefixPN';

function AddCurriculumStep1() {
  const [t] = useTranslateLoader(prefixPN('detail_page'));

  return <div>Holaaaaa</div>;
}

export default withLayout(AddCurriculumStep1);
