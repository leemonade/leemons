import React, { useState, useEffect } from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useForm } from 'react-hook-form';
import {
  Box,
  PageHeader,
  LoadingOverlay,
  Stack,
  Button,
  TotalLayoutContainer,
  TotalLayoutHeader,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import prefixPN from '@content-creator/helpers/prefixPN';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useHistory, useParams } from 'react-router-dom';
import { SetupContent } from '@content-creator/components';
import { AssetFormInput } from '@leebrary/components';
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

export default function Index({ isNew, readOnly }) {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('contentCreatorDetail'));
  const [publishing, setPublishing] = useState(false);
  const [staticTitle, setStaticTitle] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const scrollRef = React.useRef(null);
  const history = useHistory();
  const params = useParams();
  const query = useDocument({ id: params.id, isNew });
  const form = useForm();
  const mutation = useMutateDocument();
  const formValues = form.watch();
  const toolbarRef = React.useRef();

  const handleOnCancel = () => {
    console.log('Redirecting after cancel');
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    window.scrollTo(0, 0, { behavior: 'smooth' });
  };

  const handlePrev = () => {
    setActiveStep(activeStep - 1);
    window.scrollTo(0, 0, { behavior: 'smooth' });
  };

  const buildHeader = () => (
    <TotalLayoutHeader
      title={'Nuevo Documento'}
      icon={<div>CC</div>}
      formTitlePlaceholder={form.watch('name')}
      onCancel={handleOnCancel}
    >
      <div ref={toolbarRef}>Soy el toolbarRef</div>
    </TotalLayoutHeader>
  );

  useEffect(() => console.log('toolbarRef:', toolbarRef), [toolbarRef.current]);

  useEffect(() => {
    if (isNew) form.reset();
    else {
      form.setValue('name', query.data?.name);
      form.setValue('content', query.data?.content);
    }
  }, [query.data]);

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

  return (
    <>
      <LoadingOverlay visible={tLoading || query?.isLoading} />
      <TotalLayoutContainer scrollRef={scrollRef} Header={buildHeader}>
        {/*
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
        */}
        {
          [
            <>
              <ContentEditorInput
                key="s1"
                useSchema
                schemaLabel={t('schemaLabel')}
                labels={{
                  format: t('formatLabel'),
                }}
                onChange={onContentChangeHandler}
                value={formValues.content}
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
                    leftZone={<Button variant="outline">Anterior</Button>}
                  />
                }
              />
            </>,
            <PageContent title={t('config')} key="s2">
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
            </PageContent>,
          ][activeStep]
        }
      </TotalLayoutContainer>
    </>
  );
}

Index.propTypes = {
  isNew: PropTypes.bool,
  readOnly: PropTypes.bool,
};
