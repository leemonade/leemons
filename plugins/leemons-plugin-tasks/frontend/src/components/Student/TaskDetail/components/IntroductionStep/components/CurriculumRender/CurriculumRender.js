import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useClassesSubjects } from '@academic-portfolio/hooks';
import { Box, ContextContainer, Select, List, HtmlText, Text, Stack } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@tasks/helpers/prefixPN';
import assignablesPrefixPN from '@assignables/helpers/prefixPN';
import { isEmpty } from 'lodash';
import useCurriculumRenderStyles from './CurriculumRender.styles';

function CurriculumRender({ instance, showCurriculum }) {
  const [t] = useTranslateLoader(prefixPN('task_realization.statement_step.curriculum'));
  const [multiSubjectT] = useTranslateLoader(assignablesPrefixPN('userNavigator'));

  const subjects = useClassesSubjects(instance.classes);
  const subjectsData = useMemo(
    () => subjects.map((subject) => ({ label: subject.name, value: subject.id })),
    [subjects, multiSubjectT]
  );

  const [selectedSubject, setSelectedSubject] = React.useState(subjectsData[0]?.value);

  const selectedSubjectsCurriculum = useMemo(() => {
    if (selectedSubject === 'multisubject') {
      return instance?.assignable?.subjects?.flatMap((subject) => subject.curriculum);
    }
    return [
      instance?.assignable?.subjects?.find((subject) => subject.subject === selectedSubject)
        ?.curriculum,
    ];
  }, [instance?.assignable?.subjects, selectedSubject]);

  const { classes } = useCurriculumRenderStyles();

  if (isEmpty(showCurriculum)) {
    return null;
  }

  return (
    <ContextContainer title={t('title')}>
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
    </ContextContainer>
  );
}

export default CurriculumRender;

CurriculumRender.propTypes = {
  instance: PropTypes.object,
  showCurriculum: PropTypes.object,
};
