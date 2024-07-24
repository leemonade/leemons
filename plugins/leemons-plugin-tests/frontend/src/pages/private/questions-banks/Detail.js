/* eslint-disable camelcase */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { isEmpty, omit } from 'lodash';

import {
  LoadingOverlay,
  TotalLayoutContainer,
  TotalLayoutHeader,
  VerticalStepperContainer,
} from '@bubbles-ui/components';

import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@tests/helpers/prefixPN';
import { useLayout } from '@layout/context';
import { QuestionBankIcon } from '@tests/components/Icons/QuestionBankIcon';
import { getQuestionBankRequest, saveQuestionBankRequest } from '../../../request';
import DetailBasic from './components/DetailBasic';
import DetailQuestions from './components/DetailQuestions';

export default function Detail(p) {
  const [t] = useTranslateLoader(prefixPN('questionsBanksDetail'));
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [savingAs, setSavingAs] = useState(null);

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

  // FUNCTIONS ········································································ |

  const getRequestBody = () => {
    const formValues = form.getValues();
    return omit(formValues, 'subjectsRaw');
  };

  async function saveAsDraft() {
    setSavingAs('draft');
    const body = getRequestBody();
    try {
      const { questionBank } = await saveQuestionBankRequest({ ...body, published: false });
      console.log('questionBank', questionBank);
    } catch (error) {
      addErrorAlert(error);
    } finally {
      setSavingAs(null);
    }
  }

  async function saveAsPublished() {
    setSavingAs('published');
    const body = getRequestBody();
    console.log('saveAsPublished body =>', body);
    try {
      await saveQuestionBankRequest({ ...body, published: true });
      addSuccessAlert(t('published'));
      history.push('/private/tests/questions-banks');
    } catch (error) {
      addErrorAlert(error);
    } finally {
      setSavingAs(null);
    }
  }

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
  }, [params, form]);

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
          <DetailQuestions
            t={t}
            form={form}
            savingAs={savingAs}
            scrollRef={scrollRef}
            stepName={t('questions')}
            onPrev={() => setCurrentStep(0)}
            onPublish={saveAsPublished}
            onSaveDraft={saveAsDraft}
          />
        ) : null}
      </VerticalStepperContainer>
    </TotalLayoutContainer>
  );
}
