import React, { useState, useEffect } from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLayout } from '@layout/context';
import {
  Box,
  PageHeader,
  LoadingOverlay,
  Stack,
  TotalLayout,
  TotalLayoutHeader,
  useTotalLayout,
  AssetDocumentIcon,
} from '@bubbles-ui/components';
import prefixPN from '@content-creator/helpers/prefixPN';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useHistory, useParams } from 'react-router-dom';
import { SetupContent } from '@content-creator/components';
import { BasicData, AssetFormInput } from '@leebrary/components';
import useDocument from '@content-creator/request/hooks/queries/useDocument';
import useMutateDocument from '@content-creator/request/hooks/mutations/useMutateDocument';
import ContentEditorInput from '@common/components/ContentEditorInput/ContentEditorInput';
import PropTypes from 'prop-types';
import { PageContent } from './components/PageContent/PageContent';

const advancedConfigForAssetFormInput = {
  alwaysOpen: true,
  fileToRight: true,
  colorToRight: true,
  program: { show: true, required: false },
  subjects: { show: true, required: true, showLevel: true, maxOne: false },
};

const validators = [
  z.object({
    content: z.string().min(1),
  }),
  z.object({
    name: z
      .string({ required_error: 'Title is required HARDCODED WITH NO MERCY' })
      .min(1, 'Title is required HARDCODED WITH NO MERCY'),
  }),
];

export default function Index({ isNew, readOnly }) {
  const totalLayoutProps = useTotalLayout();
  const [t, , , tLoading] = useTranslateLoader(prefixPN('contentCreatorDetail'));
  const [publishing, setPublishing] = useState(false);
  const [staticTitle, setStaticTitle] = useState(false);
  const { openConfirmationModal } = useLayout();
  const history = useHistory();
  const params = useParams();
  const query = !isNew ? useDocument({ id: params.id }) : { data: null, isLoading: false };
  const form = useForm({
    resolver: zodResolver(validators[totalLayoutProps.activeStep]),
  });
  const mutation = useMutateDocument();
  const formValues = form.watch();

  const setDynamicTitle = (value) => {
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

  const handleMutations = async (assign) => {
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

  const getEditorComponent = () => {
    return (
      <Controller
        control={form.control}
        name="content"
        render={({ field }) => (
          <ContentEditorInput
            {...field}
            key={'content-creator-editor'}
            useSchema
            schemaLabel={t('schemaLabel')}
            labels={{
              format: t('formatLabel'),
            }}
            onChange={setDynamicTitle}
            value={form.watch('content')}
            openLibraryModal={false}
            readOnly={readOnly}
            error={form.formState.errors.content}
          />
        )}
      />
    );
  };

  const getBasicDataComponent = () => (
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
      Footer={ }
    />
  );

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

  const initialStepsInfo = React.useMemo(
    () => [
      {
        label: '',
        badge: null,
        status: null,
        showStep: true,
        stepComponent: getEditorComponent(),
      },
      {
        label: '',
        badge: null,
        status: null,
        showStep: true,
        stepComponent: getBasicDataComponent(),
      },
    ],
    [query.data, formValues.content, publishing]
  );

  useEffect(() => {
    console.log('publishing', publishing);
  }, [publishing]);

  useEffect(() => {
    if (totalLayoutProps.activeStep === 1) setPublishing(true);
    else setPublishing(false);
  }, [totalLayoutProps.activeStep]);

  const buildHeader = () => (
    <TotalLayoutHeader
      title={'NUEVO DOCUMENTO HARDCODED WITH NO MERCY'}
      icon={<AssetDocumentIcon width={24} height={24} color={'#878D96'} />}
      formTitlePlaceholder={formValues.name || 'TITULO DEL DOCUMENTO'}
      onCancel={handleOnCancel}
    />
  );

  // #region * FOOTER ACTIONS ------------------------------------------------
  const footerActionsLabels = {
    back: 'Anterior',
    save: 'Guardar borrador',
    next: 'Siguiente',
    dropdownLabel: 'Finalizar',
  };

  const footerFinalActionsAndLabels = [
    { label: 'Publicar', action: handleMutations },
    { label: 'Publicar y asignar', action: () => handleMutations(true) },
  ];
  // #endregion

  return (
    <>
      <LoadingOverlay visible={tLoading || query?.isLoading} />
      {/* <Box>
        <Stack direction="column" fullHeight>
          <PageHeader
            placeholders={{ title: t('titlePlaceholder') }}
            values={{
              title: form.watch('name'),
            }}
            buttons={
              !readOnly && {
                duplicate: t('saveDraft'),
                edit: !publishing && t('publish'),
                dropdown: publishing && t('publishOptions'),
              }
            }
            buttonsIcons={{
              edit: <SetupContent size={16} />,
            }}
            isEditMode={!publishing && !readOnly}
            onChange={(value) => {
              form.setValue('name', value);
              if (formValues.name.length > 0) setStaticTitle(true);
            }}
            onEdit={() => setPublishing(true)}
            onDuplicate={() => handleMutations()}
            onDropdown={[
              { label: t('onlyPublish'), onClick: () => handleMutations() },
              { label: t('publishAndAssign'), onClick: () => handleMutations('assign') },
            ]}
            fullWidth
            loding={query?.isLoading}
          />
          {!publishing ? (
            <ContentEditorInput
              useSchema
              schemaLabel={t('schemaLabel')}
              labels={{
                format: t('formatLabel'),
              }}
              onChange={setDynamicTitle}
              value={formValues.content}
              openLibraryModal={false}
              readOnly={readOnly}
            />
          ) : (
            <PageContent title={t('config')}>
              <Box style={{ padding: '48px 32px' }}>
                <AssetFormInput
                  preview
                  form={form}
                  category="assignables.content-creator"
                  previewVariant="document"
                  advancedConfig={{ advancedConfigForAssetFormInput }}
                  tagsPluginName="content-creator"
                />
              </Box>
            </PageContent>
          )}
        </Stack>
      </Box> */}
      <FormProvider {...form}>
        <TotalLayout
          {...totalLayoutProps}
          Header={buildHeader}
          footerActionsLabels={footerActionsLabels}
          footerFinalActions={footerFinalActionsAndLabels}
          initialStepsInfo={initialStepsInfo}
          onCancel={handleOnCancel}
          minStepNumberForDraftSave={0}
          onSave={() => handleMutations()}
        />
      </FormProvider>
    </>
  );
}

Index.propTypes = {
  isNew: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
};
