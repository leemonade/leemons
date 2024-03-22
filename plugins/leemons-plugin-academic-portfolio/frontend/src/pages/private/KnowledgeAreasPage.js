import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import {
  Select,
  TableInput,
  TextInput,
  Button,
  ContextContainer,
  TotalLayoutContainer,
  TotalLayoutHeader,
  TotalLayoutStepContainer,
  LoadingOverlay,
  Stack,
  Box,
  InputWrapper,
} from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useUserCenters } from '@users/hooks';
import {
  useCreateKnowledgeArea,
  useDeleteKnowledgeArea,
  useUpdateKnowledgeArea,
} from '@academic-portfolio/hooks/mutations/useMutateKnowledgeArea';
import useKnowledgeAreas from '@academic-portfolio/hooks/useKnowledgeAreas';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import SubjectTypesEmptyState from '@academic-portfolio/components/SubjectTypesEmptyState';

const KnowledgeAreasPage = () => {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('knowledgeAreas_page'));
  const [knowledgeAreas, setKnowledgeAreas] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [showEmptyState, setShowEmptyState] = useState(false);
  const history = useHistory();
  const queryClient = useQueryClient();
  const { data: userCenters, isLoading: areCentersLoading } = useUserCenters();
  const { mutate: createKnowledgeArea, isLoading: isCreateLoading } = useCreateKnowledgeArea();
  const { mutate: updateKnowledgeArea, isLoading: isUpdateLoading } = useUpdateKnowledgeArea();
  const { mutate: deleteKnowledgeArea, isLoading: isDeleteLoading } = useDeleteKnowledgeArea();
  const scrollRef = useRef();
  const [dataFetched, setDataFetched] = useState(false); // Flag to be sure when we should show the empty state

  // INIT & EFFECTS ------------------------------------------------------------------------------------------------ ||

  const centersData = useMemo(
    () => userCenters?.map((center) => ({ value: center?.id, label: center?.name })),
    [userCenters]
  );
  const { data: knowledgeAreasQuery, isLoading: knowledgeAreasLoading } = useKnowledgeAreas({
    center: selectedCenter,
    options: { enabled: selectedCenter?.length > 0 },
  });

  const isLoading = useMemo(() => {
    const waitForKnowledgeAreasList = selectedCenter?.length > 0 && knowledgeAreasLoading;
    return (
      tLoading ||
      areCentersLoading ||
      waitForKnowledgeAreasList ||
      isCreateLoading ||
      isUpdateLoading ||
      isDeleteLoading
    );
  }, [
    selectedCenter,
    knowledgeAreasLoading,
    areCentersLoading,
    isCreateLoading,
    isUpdateLoading,
    isDeleteLoading,
    tLoading,
  ]);

  useEffect(() => {
    if (knowledgeAreasQuery?.length) {
      setKnowledgeAreas([...knowledgeAreasQuery]);
      setShowEmptyState(false);
    } else if (!knowledgeAreasQuery?.length && dataFetched) {
      setShowEmptyState(true);
    }
  }, [knowledgeAreasQuery, dataFetched]);

  useEffect(() => {
    if (!isLoading && selectedCenter?.length > 0) {
      setDataFetched(true);
    }
  }, [isLoading, selectedCenter]);

  // **For the center Select to automatically pick a center when first loaded
  useEffect(() => {
    if (centersData?.length) {
      setSelectedCenter(centersData[0].value);
    }
  }, [centersData]);

  // TABLE SETUP  ------------------------------------------------------------------------------------------ ||

  const form = useForm();

  const tableInputColumns = useMemo(
    () => [
      {
        Header: t('labels.name'),
        accessor: 'name',
        input: {
          node: <TextInput required />,
          rules: { required: t('errors.requiredField') },
        },
        style: { paddingLeft: 10, width: 232 },
      },
      {
        Header: t('labels.abbreviation'),
        accessor: 'abbreviation',
        input: {
          node: <TextInput required />,
          rules: { required: t('errors.requiredField') },
        },
        style: { paddingLeft: 10 },
      },
    ],
    [t]
  );

  // HANDLERS ---------------------------------------------------------------------------------------------- ||

  const onSubmit = async (data) => {
    if (showEmptyState) setShowEmptyState(false);
    const { name, abbreviation } = data;
    const center = selectedCenter;

    createKnowledgeArea(
      {
        name,
        abbreviation,
        center,
      },
      {
        onSuccess: () => {
          addSuccessAlert(t('alerts.success.add'));
          form.reset();
        },
        onError: (e) => {
          addErrorAlert(e);
        },
      }
    );
  };

  const handleOnUpdate = async ({ oldItem, newItem }) => {
    const { id, center } = oldItem;
    const mutationObject = {
      id,
      center,
      name: newItem.name,
      abbreviation: newItem.abbreviation,
    };
    updateKnowledgeArea(mutationObject, {
      onSuccess: () => {
        addSuccessAlert(t('alerts.success.update'));
      },
      onError: (e) => {
        addErrorAlert(e);
      },
    });
  };

  const handleOnRemove = async (index) => {
    const itemToRemove = knowledgeAreas[index];
    deleteKnowledgeArea(
      { center: selectedCenter, knowledgeAreaId: itemToRemove?.id, soft: false },
      {
        onSuccess: () => {
          addSuccessAlert(t('alerts.success.delete'));
          queryClient.invalidateQueries(selectedCenter);
        },
        onError: (e) => {
          addErrorAlert(e);
        },
      }
    );
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <TotalLayoutContainer
        scrollRef={scrollRef}
        Header={
          <TotalLayoutHeader
            title={t('header.title')}
            onCancel={() => history.goBack()}
            mainActionLabel={t('header.cancel')}
          >
            <Select
              data={centersData}
              placeholder={t('header.centerSelectPlaceholder')}
              onChange={(value) => {
                setSelectedCenter(value);
              }}
              value={selectedCenter}
              sx={{ width: 262 }}
            />
          </TotalLayoutHeader>
        }
      >
        <Stack
          ref={scrollRef}
          justifyContent="center"
          fullwidth
          sx={{ overflowY: 'auto', backgroundColor: '#f8f9fb' }}
        >
          {selectedCenter?.length > 0 && (
            <TotalLayoutStepContainer>
              <ContextContainer noFlex spacing={2}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <ContextContainer direction="row" alignItems="start">
                    <Box noFlex sx={{ width: 216, minHeight: 88 }}>
                      <Controller
                        control={form.control}
                        name="name"
                        rules={{
                          required: t('errors.requiredField'),
                        }}
                        render={({ field }) => (
                          <TextInput
                            {...field}
                            required
                            label={t('labels.name')}
                            error={form.formState.errors.name}
                            onBlur={() => {
                              form.clearErrors('name');
                            }}
                            placeholder={t('placeholders.name')}
                          />
                        )}
                      />
                    </Box>
                    <Box noFlex sx={{ width: 216, minHeight: 88 }}>
                      <Controller
                        control={form.control}
                        name="abbreviation"
                        rules={{
                          required: t('errors.requiredField'),
                        }}
                        render={({ field }) => (
                          <TextInput
                            {...field}
                            required
                            label={t('labels.abbreviation')}
                            error={form.formState.errors.abbreviation}
                            onBlur={() => {
                              form.clearErrors('abbreviation');
                            }}
                            placeholder={t('placeholders.abbreviation')}
                          />
                        )}
                      />
                    </Box>
                    <InputWrapper showEmptyLabel>
                      <Button variant="link" leftIcon={<AddCircleIcon />} type="submit">
                        {t('labels.add')}
                      </Button>
                    </InputWrapper>
                  </ContextContainer>
                </form>

                {!showEmptyState ? (
                  <Box>
                    <TableInput
                      columns={tableInputColumns}
                      labels={{
                        add: t('labels.add'),
                        remove: t('labels.remove'),
                        edit: t('labels.edit'),
                        accept: t('labels.accept'),
                        cancel: t('labels.cancel'),
                        actionHeader: t('labels.actions'),
                      }}
                      canAdd={false}
                      editable
                      removable
                      unique
                      sortable={false}
                      data={knowledgeAreas}
                      onUpdate={handleOnUpdate}
                      onRemove={handleOnRemove}
                    />
                  </Box>
                ) : (
                  <Box sx={{ justifySelf: 'center' }}>
                    <SubjectTypesEmptyState
                      labels={{ text: t('emptyState.text'), altText: t('emptyState.altText') }}
                    />
                  </Box>
                )}
              </ContextContainer>
            </TotalLayoutStepContainer>
          )}
        </Stack>
      </TotalLayoutContainer>
    </>
  );
};

export default KnowledgeAreasPage;
