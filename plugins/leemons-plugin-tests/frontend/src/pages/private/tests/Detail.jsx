import React, { useRef } from 'react';
import {
  Box,
  // Badge,
  Stack,
  Button,
  Loader,
  // ImageLoader,
  AssetTestIcon,
  ContextContainer,
  TotalLayoutHeader,
  // ActivityAnswersBar,
  TotalLayoutContainer,
  // ActivityAccordionPanel,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useStore } from '@common';
import { useHistory, useParams, Link } from 'react-router-dom';
import { addErrorAlert } from '@layout/alert';
// import { ChevronRightIcon } from '@bubbles-ui/icons/outline';
import { forEach, keyBy } from 'lodash';
import { getProgramEvaluationSystemRequest } from '@academic-portfolio/request';
import useLevelsOfDifficulty from '@assignables/components/LevelsOfDifficulty/hooks/useLevelsOfDifficulty';
import useAssets from '@leebrary/request/hooks/queries/useAssets';
import useAssignables from '@assignables/requests/hooks/queries/useAssignables';
import { useIsOwner } from '@leebrary/hooks/useIsOwner';
import { getTestRequest } from '../../../request';
// import QuestionsTable from './components/QuestionsTable';
import { questionTypeT } from '../questions-banks/components/QuestionForm';
import ViewModeQuestions from '../../../components/ViewModeQuestions';
// import { ResultStyles } from './Result.style';
import { calculeInfoValues } from './StudentInstance/helpers/calculeInfoValues';
import { getConfigByInstance } from './StudentInstance/helpers/getConfigByInstance';

export default function Detail() {
  const [t, t1V] = useTranslateLoader(prefixPN('testsDetail'));
  const [t2, t2V] = useTranslateLoader(prefixPN('questionsBanksDetail'));
  // const { classes: styles } = ResultStyles({}, { name: 'Detail' });
  const levels = useLevelsOfDifficulty(true);
  const scrollRef = useRef();
  const isModulePreview = window?.location?.href?.includes('moduleId');
  const moduleId = window?.location?.href?.split('moduleId=')[1];

  const [store, render] = useStore({
    loading: true,
    isNew: false,
    currentStep: 0,
  });

  // const [accordionState, setAccordionState] = React.useState([]);

  const history = useHistory();
  const params = useParams();

  const { data: assignableDetail, isLoading: assignableLoading } = useAssignables({
    id: store.test?.id,
    enabled: !!store.test?.id,
  });
  const { data: assetsDetails, isLoading: assetsLoading } = useAssets({
    ids: [assignableDetail?.asset?.id],
    enabled: !!assignableDetail?.asset?.id,
  });

  const [asset] = assetsDetails ?? [];
  const canEdit = useIsOwner(asset);

  function getStats() {
    const selectables = [];
    const data = [];

    if (store.test?.questions) {
      let category = false;
      let level = false;
      let type = false;
      const levelsByValue = keyBy(levels, 'value');
      const categoriesById = keyBy(store.test.questionBank.categories, 'id');
      forEach(store.test.questions, (question) => {
        const d = {
          id: question.id,
          status: null,
        };
        if (question.level) {
          level = true;
          d.level = levelsByValue[question.level].label;
        } else {
          d.level = t('undefined');
        }
        if (question.category) {
          category = true;
          d.category = categoriesById[question.category].value;
        } else {
          d.category = t('undefined');
        }
        if (question.type) {
          type = true;
          d.type = t2(questionTypeT[question.type]);
        } else {
          d.type = t('undefined');
        }
        data.push(d);
      });
      if (category) {
        selectables.push({
          value: 'category',
          label: t('categories'),
        });
      }
      if (type) {
        selectables.push({
          value: 'type',
          label: t('questionTypes'),
        });
      }
      if (level) {
        selectables.push({
          value: 'level',
          label: t('levels'),
        });
      }
    }
    return { selectables, data, labels: { OK: t('ok'), KO: t('ko'), null: t('nsnc') } };
  }

  async function init() {
    try {
      store.currentId = params.id;
      const { test } = await getTestRequest(params.id, { withQuestionBank: true });

      store.test = test;
      store.test.questionResponses = {};
      forEach(store.test.questions, ({ id }) => {
        store.test.questionResponses[id] = {
          clues: 0,
          points: 0,
          status: null,
        };
      });
      store.test.config = getConfigByInstance();

      store.stats = getStats();
      render();
    } catch (error) {
      console.error(error);
      addErrorAlert(error);
    }
  }

  async function setupEvaluationSystem() {
    let evaluationSystem = null;
    if (store.test?.program) {
      const { evaluationSystem: evalSystem } = await getProgramEvaluationSystemRequest(
        store.test.program
      );
      evaluationSystem = evalSystem;
    }
    store.test.questionsInfo = calculeInfoValues(
      store.test.questions.length,
      evaluationSystem?.maxScale.number ?? 100,
      evaluationSystem?.minScale.number ?? 0,
      evaluationSystem?.minScaleToPromote.number ?? 50
    );
    store.evaluationSystem = evaluationSystem;
  }

  React.useEffect(() => {
    if (store.test?.id) {
      setupEvaluationSystem();
    }
  }, [store.test]);

  function goAssignPage() {
    history.push(`/private/tests/assign/${store.test.id}`);
  }

  function goEditPage() {
    history.push(`/private/tests/${store.test.id}`);
  }

  function toggleQuestionMode() {
    store.useQuestionMode = !store.useQuestionMode;
    render();
  }

  React.useEffect(() => {
    if (params?.id && (!store.currentId || store.currentId !== params.id) && t1V && t2V && levels)
      init();
  }, [levels, params, t1V, t2V]);

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <TotalLayoutHeader
          title={store.test?.name}
          cancelable={false}
          icon={<AssetTestIcon />}
          direction="row"
        >
          {!isModulePreview && !assignableLoading && !assetsLoading && canEdit && (
            <Stack spacing={4}>
              <Button variant="outline" onClick={() => goEditPage()}>
                {t('edit')}
              </Button>
              <Button variant="primary" onClick={() => goAssignPage()}>
                {t('assign')}
              </Button>
            </Stack>
          )}
          {isModulePreview && (
            <Link to={`/private/learning-paths/modules/${moduleId}/view`}>
              <Button variant="outline">{t('goBackToDashboardPreview')}</Button>
            </Link>
          )}
          {!isModulePreview && (assignableLoading || assetsLoading) && <Loader visible />}
        </TotalLayoutHeader>
      }
    >
      <Stack
        justifyContent="center"
        ref={scrollRef}
        style={{ overflow: 'auto' }}
        fullWidth
        fullHeight
      >
        <TotalLayoutStepContainer>
          <ContextContainer
            sx={(theme) => ({
              paddingBottom: theme.spacing[12],
              overflow: 'auto',
            })}
            fullHeight
            fullWidth
          >
            <Box sx={(theme) => ({ paddingBottom: theme.spacing[12] })}>
              <ViewModeQuestions
                viewMode={false}
                store={store.test}
                onReturn={toggleQuestionMode}
              />
            </Box>
          </ContextContainer>
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
  );
}
