import React, { useState, useMemo, useEffect } from 'react';
import { FormProvider, useForm, Controller, useWatch } from 'react-hook-form';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHistory, useParams, useLocation } from 'react-router-dom';
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
import { useProcessTextEditor } from '@common';
import { useIsStudent } from '@academic-portfolio/hooks';

const validators = [
  z.object({
    content: z.string().min(1),
  }),
  z.object({
    name: z.string({ required_error: 'Title is required' }).min(1, 'Title is required'),
  }),
];

function useUrlQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Index({ isNew, readOnly }) {
  const isStudent = useIsStudent();
  const [t, , , tLoading] = useTranslateLoader(prefixPN('detailPage'));
  const urlQuery = useUrlQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [disableNext, setDisableNext] = useState(true);
  const [activeStep, setActiveStep] = useState(Number(urlQuery.get('step')) || 0);
  const { openConfirmationModal } = useLayout();
  const scrollRef = React.useRef(null);
  const history = useHistory();
  const params = useParams();
  const processTextEditor = useProcessTextEditor();
  const { data: documentData, isLoading: documentIsLoading } = useDocument({
    id: params.id,
    isNew,
  });
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

    const processedContent = await processTextEditor(formValues.content, documentData?.content, {
      force: documentData?.published,
    });

    const documentToSave = { ...formValues, content: processedContent, published: publishing };

    if (!isNew) documentToSave.id = params.id;
    mutation.mutate(
      { ...documentToSave },
      {
        onSuccess: (data) => {
          addSuccessAlert(t(`${publishing ? 'published' : 'savedAsDraft'}`));
          setIsLoading(false);
          if (!publishing) {
            history.replace(
              `/private/content-creator/${data.document.assignable}/edit?step=${activeStep}`
            );
          }

          if (assigning) {
            history.push(`/private/content-creator/${data.document.assignable}/assign`);
          } else if (publishing && !assigning) {
            history.push('/private/leebrary/assignables.content-creator/list');
          }
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
    if (!documentData?.name) {
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
    // Temporary fix. It won't be needed to solved the program if the Suject Picker limits the options to one program
    let solvedProgram;
    if (documentData?.subjects?.length) {
      solvedProgram = documentData?.subjects[0].program;
    }
    if (isNew) form.reset();
    else {
      form.setValue('name', documentData?.name);
      form.setValue('content', documentData?.content);
      form.setValue('description', documentData?.description);
      form.setValue('color', documentData?.color || null);
      form.setValue('cover', documentData?.cover || null);
      form.setValue('program', documentData?.program || solvedProgram || null);
      form.setValue('subjects', documentData?.subjects?.map((subject) => subject.subject) || null);
      form.setValue('tags', documentData?.tags);
    }
  }, [documentData]);

  useEffect(() => {
    if (formValues.content) {
      setDisableNext(false);
    } else {
      setDisableNext(true);
    }
  }, [formValues.content]);

  // #region * FOOTER ACTIONS ------------------------------------------------
  const footerActionsLabels = {
    dropdownLabel: t('finish'),
  };

  const footerFinalActionsAndLabels = [
    { label: t('publish'), onClick: () => handleMutations({ publishing: true, assigning: false }) },
    {
      label: t('publishAndAssign'),
      onClick: () => handleMutations({ publishing: true, assigning: true }),
    },
  ];
  const footerFinalActionsAndLabelsFiltered = isStudent
    ? [footerFinalActionsAndLabels[0]]
    : footerFinalActionsAndLabels;

  // #endregion

  function getTitle() {
    if (readOnly) return null;
    if (isNew) return t('titleNew');
    return t('titleEdit');
  }
  return (
    <FormProvider {...form}>
      <LoadingOverlay visible={tLoading || documentIsLoading} />
      <TotalLayoutContainer
        scrollRef={scrollRef}
        Header={
          <TotalLayoutHeader
            title={getTitle()}
            icon={
              <Stack justifyContent="center" alignItems="center">
                <AssetDocumentIcon width={24} height={24} />
              </Stack>
            }
            formTitlePlaceholder={formValues.name ? formValues.name : t('documentTitlePlaceHolder')}
            onCancel={handleOnCancel}
            compact
            mainActionLabel={t('cancel')}
            cancelable={!readOnly}
          >
            {!readOnly && <div id="toolbar-div" style={{ width: '100%' }} ref={toolbarRef}></div>}
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
                        width={928}
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
            <Stack
              key="step-2"
              justifyContent="center"
              sx={{ backgroundColor: '#f8f9fb', overflow: 'auto' }}
              ref={scrollRef}
            >
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
                          chevronUp
                          width="auto"
                          data={footerFinalActionsAndLabelsFiltered}
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
