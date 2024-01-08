import React, { useState, useEffect } from 'react';
import { FormProvider, useForm, Controller, useWatch } from 'react-hook-form';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHistory, useParams } from 'react-router-dom';
import { useLayout } from '@layout/context';
import {
  LoadingOverlay,
  Button,
  Stack,
  TotalLayoutContainer,
  TotalLayoutHeader,
  TotalLayoutFooterContainer,
  DropdownButton,
  AssetDocumentIcon,
} from '@bubbles-ui/components';
import prefixPN from '@content-creator/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { BasicData } from '@leebrary/components';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useDocument from '@content-creator/request/hooks/queries/useDocument';
import useMutateDocument from '@content-creator/request/hooks/mutations/useMutateDocument';
import ContentEditorInput from '@common/components/ContentEditorInput/ContentEditorInput';

const validators = [
  z.object({
    content: z.string().min(1),
  }),
  z.object({
    name: z.string({ required_error: 'Title is required' }).min(1, 'Title is required'),
  }),
];

export default function Index({ isNew, readOnly }) {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('detailPage'));
  const [isLoading, setIsLoading] = useState(false);
  const [disableNext, setDisableNext] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const { openConfirmationModal } = useLayout();
  const scrollRef = React.useRef(null);
  const history = useHistory();
  const params = useParams();
  const query = useDocument({ id: params.id, isNew });
  const mutation = useMutateDocument();
  const toolbarRef = React.useRef();
  const form = useForm({
    resolver: zodResolver(validators[activeStep]),
  });
  const formValues = useWatch({ control: form.control });

  // ··································································
  // HANDLERS

  const handleNext = async () => {
    const isValidStep = await form.trigger();
    if (!isValidStep) return;
    setActiveStep((current) => current + 1);
    window.scrollTo(0, 0, { behavior: 'smooth' });
  };

  const handlePrev = () => {
    setActiveStep((current) => current - 1);
    window.scrollTo(0, 0, { behavior: 'smooth' });
  };

  const handleOnCancel = () => {
    const formHasBeenTouched = Object.keys(form.formState.touchedFields).length > 0;
    const formIsNotEmpty = !isEmpty(formValues);
    if ((formHasBeenTouched || formIsNotEmpty) && !readOnly) {
      openConfirmationModal({
        title: t('cancelModalTitle'),
        description: t('cancelModalDescription'),
        labels: { confim: t('cancelModalConfirm'), cancel: t('cancelModalCancel') },
        onConfirm: () => history.goBack(),
      })();
    } else {
      history.goBack();
    }
  };

  const handleMutations = async ({ publishing, assigning }) => {
    const isValidStep = await form.trigger();
    if (!isValidStep) return;
    setIsLoading(true);
    const documentToSave = { ...formValues, published: publishing };
    console.log('publishing', publishing);
    if (!isNew) documentToSave.id = params.id;
    mutation.mutate(
      { ...documentToSave },
      {
        onSuccess: (data) => {
          addSuccessAlert(t(`${publishing ? 'published' : 'savedAsDraft'}`));
          setIsLoading(false);
          if (!assigning)
            history.push(`/private/content-creator${publishing ? '' : '/?fromDraft=1'}`);
          else history.push(`/private/content-creator/${data.document.assignable}/assign`);
        },
        onError: (e) => {
          addErrorAlert(e);
          setIsLoading(false);
        },
      }
    );
  };

  const handleDynamicTitle = (value) => {
    form.setValue('content', value);
    if (!query.data?.name) {
      const parser = new DOMParser();
      const htmlContent = Array.from(
        parser.parseFromString(value, 'text/html').body.getElementsByTagName('*')
      );
      const firstElementWithText = htmlContent.find((element) => element.textContent)?.textContent;
      form.setValue('name', firstElementWithText);
    }
  };

  // ··································································
  // INITIAL DATA HANDLER

  useEffect(() => {
    if (isNew) form.reset();
    else {
      form.setValue('name', query.data?.name);
      form.setValue('content', query.data?.content);
      form.setValue('description', query.data?.description);
      form.setValue('color', query.data?.color || null);
      form.setValue('cover', query.data?.cover || null);
      form.setValue('program', query.data?.program || null);
      form.setValue('subjects', query.data?.subjects || null);
    }
  }, [query.data]);

  useEffect(() => {
    if (formValues.content) {
      setDisableNext(false);
    } else {
      setDisableNext(true);
    }
  }, [formValues.content]);

  // #region * FOOTER ACTIONS ------------------------------------------------
  const footerActionsLabels = {
    dropdownLabel: 'Finalizar',
  };

  const footerFinalActionsAndLabels = [
    { label: t('publish'), onClick: () => handleMutations({ publishing: true, assigning: false }) },
    {
      label: t('publishAndAssign'),
      onClick: () => handleMutations({ publishing: true, assigning: true }),
    },
  ];
  // #endregion

  return (
    <FormProvider {...form}>
      <LoadingOverlay visible={tLoading || query?.isLoading} />
      <TotalLayoutContainer
        scrollRef={scrollRef}
        Header={
          <TotalLayoutHeader
            title={isNew ? t('titleNew') : t('titleEdit')}
            icon={
              <Stack justifyContent="center" alignItems="center">
                <AssetDocumentIcon width={24} height={24} color={'#878D96'} />
              </Stack>
            }
            formTitlePlaceholder={formValues.name || t('detailPage.documentTitlePlaceholder')}
            onCancel={handleOnCancel}
            compact
            mainActionLabel={readOnly ? t('back') : t('cancel')}
          >
            <div id="toolbar-div" style={{ width: '100%' }} ref={toolbarRef}></div>
          </TotalLayoutHeader>
        }
      >
        {
          [
            <Controller
              key="step-1"
              control={form.control}
              name="content"
              render={({ field }) => (
                <ContentEditorInput
                  useSchema
                  schemaLabel={t('schemaLabel')}
                  labels={{
                    format: t('formatLabel'),
                  }}
                  onChange={handleDynamicTitle}
                  value={field.value}
                  openLibraryModal={false}
                  readOnly={readOnly}
                  toolbarPortal={toolbarRef.current}
                  scrollRef={scrollRef}
                  Footer={
                    !readOnly && (
                      <TotalLayoutFooterContainer
                        fixed
                        scrollRef={scrollRef}
                        rightZone={
                          <>
                            <Button
                              variant="link"
                              onClick={() =>
                                handleMutations({ publishing: false, assigning: false })
                              }
                            >
                              {t('saveDraft')}
                            </Button>
                            <Button onClick={handleNext} disabled={disableNext}>
                              {t('next')}
                            </Button>
                          </>
                        }
                      />
                    )
                  }
                />
              )}
            />,
            <Stack key="step-2" justifyContent="center">
              <BasicData
                advancedConfig={{
                  alwaysOpen: false,
                  program: { show: true, required: false },
                  subjects: { show: true, required: false, showLevel: true, maxOne: false },
                }}
                editing={!isNew}
                categoryKey={'assignables.content-creator'}
                isLoading={isLoading}
                Footer={
                  <TotalLayoutFooterContainer
                    fixed
                    scrollRef={scrollRef}
                    rightZone={
                      <>
                        <Button
                          variant="link"
                          onClick={() => handleMutations({ publishing: false, assigning: false })}
                        >
                          {t('saveDraft')}
                        </Button>
                        <DropdownButton
                          data={footerFinalActionsAndLabels}
                          loading={isLoading}
                          disabled={isLoading}
                        >
                          {footerActionsLabels.dropdownLabel}
                        </DropdownButton>
                      </>
                    }
                    leftZone={
                      <Button variant="outline" onClick={handlePrev}>
                        {t('previous')}
                      </Button>
                    }
                  />
                }
              />
            </Stack>,
          ][activeStep]
        }
      </TotalLayoutContainer>
    </FormProvider>
  );
}

Index.propTypes = {
  isNew: PropTypes.bool,
  readOnly: PropTypes.bool,
};
