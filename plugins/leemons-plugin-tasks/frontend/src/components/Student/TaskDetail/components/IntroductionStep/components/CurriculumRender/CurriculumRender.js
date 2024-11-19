import React, { useEffect, useMemo } from 'react';

import { useClassesSubjects } from '@academic-portfolio/hooks';
import assignablesPrefixPN from '@assignables/helpers/prefixPN';
import { Box, ContextContainer, Select, List, HtmlText, Text, Stack } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import useCurriculumRenderStyles from './CurriculumRender.styles';

import { prefixPN } from '@tasks/helpers/prefixPN';

function CurriculumRender({ instance, showCurriculum, withoutTitle }) {
  const [t] = useTranslateLoader(prefixPN('task_realization.statement_step.curriculum'));
  const [multiSubjectT] = useTranslateLoader(assignablesPrefixPN('userNavigator'));

  const subjects = useClassesSubjects(instance?.classes);
  const subjectsData = useMemo(
    () => subjects.map((subject) => ({ label: subject.name, value: subject.id })),
    [subjects, multiSubjectT]
  );

  const [selectedSubject, setSelectedSubject] = React.useState(null);
  useEffect(() => {
    if (!selectedSubject && subjects?.length) {
      setSelectedSubject(subjects[0]?.id);
    }
  }, [subjects]);

  const selectedSubjectsCurriculum = useMemo(
    () =>
      [
        instance?.assignable?.subjects?.find((subject) => subject.subject === selectedSubject)
          ?.curriculum,
      ].filter(Boolean),
    [instance?.assignable?.subjects, selectedSubject]
  );

  const { classes } = useCurriculumRenderStyles();

  if (isEmpty(showCurriculum) || !selectedSubjectsCurriculum?.length) {
    return null;
  }

  const body = (
    <Stack direction="column" spacing={'xl'}>
      {subjectsData?.length > 1 && (
        <Box sx={{ maxWidth: 250 }}>
          <Select data={subjectsData} onChange={setSelectedSubject} value={selectedSubject} />
        </Box>
      )}

      {!!selectedSubject &&
        !!showCurriculum?.custom &&
        !!selectedSubjectsCurriculum?.some((curriculum) => curriculum?.objectives?.length) && (
          <Box className={classes.section}>
            <Text className={classes.sectionTitle} color="primary">
              {t('objectives')}
            </Text>
            <List type="ordered" sx={{ listStyleType: 'initial', paddingLeft: 8 }}>
              {selectedSubjectsCurriculum
                ?.filter((curriculum) => curriculum.objectives)
                ?.flatMap((curriculum) =>
                  curriculum.objectives.map((objective) => (
                    <List.Item key={objective}>
                      <HtmlText>{objective}</HtmlText>
                    </List.Item>
                  ))
                )}
            </List>
          </Box>
        )}
    </Stack>
  );

  if (withoutTitle) {
    return body;
  }
  return <ContextContainer title={t('title')}>{body}</ContextContainer>;
}

export default CurriculumRender;

CurriculumRender.propTypes = {
  instance: PropTypes.object,
  showCurriculum: PropTypes.object,
  withoutTitle: PropTypes.bool,
};
