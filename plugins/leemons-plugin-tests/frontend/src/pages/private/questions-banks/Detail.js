/* eslint-disable camelcase */
import { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';

import {
  LoadingOverlay,
  TotalLayoutContainer,
  TotalLayoutHeader,
  VerticalStepperContainer,
} from '@bubbles-ui/components';
import { useSearchParams } from '@common/useSearchParams';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useLayout } from '@layout/context';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { omit } from 'lodash';

import { getQuestionBankRequest, saveQuestionBankRequest } from '../../../request';

import DetailBasic from './components/DetailBasic';
import { DetailQuestionsRouter } from './components/DetailQuestionsRouter';

import { QuestionBankIcon } from '@tests/components/Icons/QuestionBankIcon';
import prefixPN from '@tests/helpers/prefixPN';

export default function Detail() {
  const [t] = useTranslateLoader(prefixPN('questionsBanksDetail'));
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get('step') ?? 0);
  const [savingAs, setSavingAs] = useState(null);

  const { layoutState, setLayoutState } = useLayout();

  const scrollRef = useRef();
  const history = useHistory();
  const params = useParams();
  const isNew = useMemo(() => !params.id, [params.id]);

  const form = useForm();
  const qBankName = form.watch('name');

  form.register('questions', {
    required: t('questionRequired'),
    validate: (value) => {
      if (value.length === 0) {
        return t('questionRequired');
      }
      return undefined;
    },
  });

  useEffect(() => {
    setLayoutState({
      ...layoutState,
      hasFooter: true,
    });
  }, []);

  // FUNCTIONS ········································································ |

  const getRequestBody = (type) => {
    const formValues = form.getValues();
    if (type === 'draft') {
      formValues.questions = formValues.questions ?? [];
    }
    return omit(formValues, 'subjectsRaw');
  };

  async function saveAsDraft() {
    setSavingAs('draft');
    const body = getRequestBody('draft');
    try {
      const { questionBank } = await saveQuestionBankRequest({ ...body, published: false });
      addSuccessAlert(t('savedAsDraft'));
      if (isNew) {
        history.replace(`/private/tests/questions-banks/${questionBank.id}`);
      }
      history.push('/private/tests/questions-banks');
    } catch (error) {
      addErrorAlert(error);
    } finally {
      setSavingAs(null);
    }
  }

  async function saveAsPublished() {
    setSavingAs('published');
    const body = getRequestBody();

    try {
      await saveQuestionBankRequest({ ...body, published: true });
      addSuccessAlert(t('published'));
      history.push('/private/tests/questions-banks');
    } catch (error) {
      addErrorAlert(t('errors.save'), error.message);
    } finally {
      setSavingAs(null);
    }
  }

  const setCurrentStep = useCallback(
    (step) => {
      searchParams.set('step', step);
      history.push(`${window.location.pathname}?${searchParams.toString()}`);
    },
    [searchParams, history]
  );

  // EFFECTS ········································································ |

  useEffect(() => {
    setIsLoading(true);

    if (params.id !== 'new') {
      getQuestionBankRequest(params.id)
        .then(
          ({
            // eslint-disable-next-line camelcase
            questionBank: {
              deleted,
              deleted_at,
              created_at,
              updated_at,
              deletedAt,
              createdAt,
              updatedAt,
              ...qBank
            },
          }) => {
            if (qBank.questions?.length > 0) {
              setCurrentStep(1);
            }

            form.reset(qBank);
            setIsLoading(false);
          }
        )
        .catch((error) => {
          addErrorAlert(error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [params.id]);

  if (isLoading) return <LoadingOverlay visible />;

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <TotalLayoutHeader
          icon={<QuestionBankIcon width={23} height={23} />}
          title={isNew ? t('pageTitleNew') : t('pageTitle')}
          formTitlePlaceholder={qBankName || t('headerTitlePlaceholder')}
          onCancel={() => history.goBack()}
          mainActionLabel={t('cancel')}
        />
      }
    >
      <FormProvider {...form}>
        <VerticalStepperContainer
          scrollRef={scrollRef}
          currentStep={currentStep}
          data={[
            { label: t('basic'), status: 'OK' },
            { label: t('questions'), status: 'OK' },
          ]}
          onChangeActiveIndex={setCurrentStep}
        >
          {currentStep === 0 && (
            <DetailBasic
              t={t}
              form={form}
              savingAs={savingAs}
              stepName={t('basic')}
              scrollRef={scrollRef}
              advancedConfig={{
                alwaysOpen: true,
                program: { show: true, required: false },
                subjects: { show: true, required: true, showLevel: false, maxOne: true },
              }}
              onNext={() => setCurrentStep(1)}
              onSaveDraft={saveAsDraft}
            />
          )}
          {currentStep === 1 || currentStep === 2 ? (
            <DetailQuestionsRouter
              t={t}
              form={form}
              savingAs={savingAs}
              scrollRef={scrollRef}
              onPrev={() => setCurrentStep(0)}
              onPublish={saveAsPublished}
              onSaveDraft={saveAsDraft}
            />
          ) : null}
        </VerticalStepperContainer>
      </FormProvider>
    </TotalLayoutContainer>
  );
}
