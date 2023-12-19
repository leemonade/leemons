import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHistory, useParams } from 'react-router-dom';
import {
  LoadingOverlay,
  Button,
  Stack,
  TotalLayoutContainer,
  TotalLayoutHeader,
  TotalLayoutFooterContainer,
  DropdownButton
} from '@bubbles-ui/components';
import prefixPN from '@content-creator/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { BasicData } from '@leebrary/components';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useDocument from '@content-creator/request/hooks/queries/useDocument';
import useMutateDocument from '@content-creator/request/hooks/mutations/useMutateDocument';
import ContentEditorInput from '@common/components/ContentEditorInput/ContentEditorInput';

export default function Index({ isNew, readOnly }) {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('contentCreatorDetail'));
  const [publishing, setPublishing] = useState(false);
  const [staticTitle, setStaticTitle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const scrollRef = React.useRef(null);
  const history = useHistory();
  const params = useParams();
  const query = useDocument({ id: params.id, isNew });
  const form = useForm();
  const mutation = useMutateDocument();
  const formValues = form.watch();
  const toolbarRef = React.useRef();

  // ··································································
  // HANDLERS

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    window.scrollTo(0, 0, { behavior: 'smooth' });
  };

  const handlePrev = () => {
    setActiveStep(activeStep - 1);
    window.scrollTo(0, 0, { behavior: 'smooth' });
  };

  const handleOnCancel = () => {
    const formHasBeenTouched = Object.keys(form.formState.touchedFields).length > 0;
    const formIsNotEmpty = !_.isEmpty(formValues);
    if (formHasBeenTouched || formIsNotEmpty) {
      openConfirmationModal({
        title: '¿Cancelar formulario?',
        description: '¿Deseas cancelar el formulario?',
        labels: { confim: 'Cancelar', cancel: 'Cancelar' },
        onConfirm: () => history.goBack(),
      })();
    } else {
      history.goBack();
    }
  };

  const handleMutations = async (assign = '') => {
    const documentToSave = { ...formValues, published: publishing };
    if (!isNew) documentToSave.id = params.id;
    mutation.mutate(
      { ...documentToSave },
      {
        onSuccess: (data) => {
          addSuccessAlert(t(`${publishing ? 'published' : 'savedAsDraft'}`));
          if (!assign) history.push(`/private/content-creator${publishing ? '' : '/?fromDraft=1'}`);
          else history.push(`/private/content-creator/${data.document.assignable}/assign`);
        },
        onError: (e) => addErrorAlert(e),
      }
    );
  };

  const onContentChangeHandler = (value) => {
    form.setValue('content', value);
    if (!query.data?.name && !staticTitle) {
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
    if (activeStep === 1) setPublishing(true);
    else setPublishing(false);
  }, [activeStep]);

  // #region * FOOTER ACTIONS ------------------------------------------------
  const footerActionsLabels = {
    dropdownLabel: 'Finalizar',
  };

  const footerFinalActionsAndLabels = [
    { label: 'Publicar', action: handleMutations },
    { label: 'Publicar y asignar', action: () => handleMutations(true) },
  ];
  // #endregion

  return (
    <FormProvider {...form}>
      <LoadingOverlay visible={tLoading || query?.isLoading} />
      <TotalLayoutContainer
        scrollRef={scrollRef}
        Header={
          <TotalLayoutHeader
            title={'Nuevo Documento'}
            icon={<div>CC</div>}
            formTitlePlaceholder={form.watch('name')}
            onCancel={handleOnCancel}
          >
            <div ref={toolbarRef}></div>
          </TotalLayoutHeader>
        }>
        {
          [
            <>
              <Controller
                control={form.control}
                name="content"
                render={({ field }) => (
                  <ContentEditorInput
                    key="s1"
                    useSchema
                    schemaLabel={t('schemaLabel')}
                    labels={{
                      format: t('formatLabel'),
                    }}
                    onChange={onContentChangeHandler}
                    value={field.value}
                    openLibraryModal={false}
                    readOnly={readOnly}
                    toolbarPortal={toolbarRef.current}
                    scrollRef={scrollRef}
                    Footer={
                      <TotalLayoutFooterContainer
                        fixed
                        scrollRef={scrollRef}
                        rightZone={
                          <>
                            <Button variant="link" onClick={handleMutations}>
                              Guardar Borrador
                            </Button>
                            <Button onClick={handleNext}>Siguiente</Button>
                          </>
                        }
                      />
                    }
                  />)} />
            </>,
            <Stack justifyContent="center">
              <BasicData
                key={t('basicData')}
                advancedConfig={{
                  alwaysOpen: false,
                  program: { show: true, required: false },
                  subjects: { show: true, required: false, showLevel: true, maxOne: false },
                }}
                onSave={handleMutations}
                editing={!isNew}
                categoryType={'document'}
                Footer={
                  <TotalLayoutFooterContainer
                    fixed
                    scrollRef={scrollRef}
                    rightZone={
                      <>
                        <Button variant="link" onClick={handleMutations}>
                          Guardar Borrador
                        </Button>
                        <DropdownButton data={footerFinalActionsAndLabels} loading={isLoading} disabled={isLoading}>
                          {footerActionsLabels.dropdownLabel || 'Finalizar'}
                        </DropdownButton>
                      </>
                    }
                    leftZone={<Button variant="outline" onClick={handlePrev}>Anterior</Button>}
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
