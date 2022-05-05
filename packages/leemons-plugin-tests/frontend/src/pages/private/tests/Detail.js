import React from 'react';
import {
  Box,
  ContextContainer,
  InputWrapper,
  PageContainer,
  ResponsiveBar,
  Stack,
} from '@bubbles-ui/components';
import { AdminPageHeader } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useStore } from '@common';
import { useHistory, useParams } from 'react-router-dom';
import { addErrorAlert } from '@layout/alert';
import { PluginTestIcon } from '@bubbles-ui/icons/outline';
import { forEach, keyBy } from 'lodash';
import { getTestRequest } from '../../../request';
import QuestionsTable from './components/QuestionsTable';
import { questionTypeT } from '../questions-banks/components/QuestionForm';

export default function Detail() {
  const [t, t1V] = useTranslateLoader(prefixPN('testsDetail'));
  const [t2, t2V] = useTranslateLoader(prefixPN('questionsBanksDetail'));

  // ----------------------------------------------------------------------
  // SETTINGS
  const [store, render] = useStore({
    loading: true,
    isNew: false,
    currentStep: 0,
  });

  const history = useHistory();
  const params = useParams();

  function getStats() {
    const questions = [];
    const questionsIndex = {};
    //
    const categories = [];
    const categoryIndex = {};
    const categoriesById = keyBy(store.test.questionBank.categories, 'id');

    forEach(store.test.questions, (question) => {
      if (categoryIndex[question.category] === undefined) {
        categories.push({
          key: question.category ? categoriesById[question.category].value : t('undefined'),
          value: 0,
        });
        categoryIndex[question.category] = categories.length - 1;
      }
      categories[categoryIndex[question.category]].value++;
      if (questionsIndex[question.type] === undefined) {
        questions.push({
          key: t2(questionTypeT[question.type]),
          value: 0,
        });
        questionsIndex[question.type] = questions.length - 1;
      }
      questions[questionsIndex[question.type]].value++;
    });

    return { categories, categoriesKeys: ['value'], questions, questionsKeys: ['value'] };
  }

  async function init() {
    try {
      const { test } = await getTestRequest(params.id, { withQuestionBank: true });
      store.test = test;
      store.stats = getStats();
      render();
    } catch (error) {
      console.log(error);
      addErrorAlert(error);
    }
  }

  function goAssignPage() {
    history.push(`/private/tests/assign/${store.test.id}`);
  }

  React.useEffect(() => {
    if (params?.id && t1V && t2V) init();
  }, [params, t1V, t2V]);

  return (
    <ContextContainer fullHeight>
      <AdminPageHeader
        values={{
          title: store.test?.name,
        }}
        buttons={{
          edit: t('assign'),
        }}
        icon={<PluginTestIcon />}
        variant="teacher"
        onEdit={() => goAssignPage()}
      />

      <PageContainer noFlex>
        {store.stats ? (
          <Stack fullWidth>
            <InputWrapper label={t('questionTypes')}>
              <Box sx={() => ({ height: '400px' })}>
                <ResponsiveBar
                  colors={{ scheme: 'nivo' }}
                  data={store.stats.questions}
                  keys={store.stats.questionsKeys}
                  indexBy="key"
                  colorBy="indexValue"
                  margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                  padding={0.3}
                />
              </Box>
            </InputWrapper>
            <InputWrapper label={t('categories')}>
              <Box sx={() => ({ height: '400px' })}>
                <ResponsiveBar
                  colors={{ scheme: 'nivo' }}
                  data={store.stats.categories}
                  keys={store.stats.categoriesKeys}
                  indexBy="key"
                  colorBy="indexValue"
                  layout="horizontal"
                  enableGridX={true}
                  enableGridY={false}
                  margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
                  padding={0.3}
                />
              </Box>
            </InputWrapper>
          </Stack>
        ) : null}

        {store.test ? (
          <InputWrapper label={t('questions')}>
            <QuestionsTable hideCheckbox questions={store.test?.questions} />
          </InputWrapper>
        ) : null}
      </PageContainer>
    </ContextContainer>
  );
}
