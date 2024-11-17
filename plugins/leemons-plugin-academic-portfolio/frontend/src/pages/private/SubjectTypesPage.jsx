import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import SubjectTypesEmptyState from '@academic-portfolio/components/SubjectTypesEmptyState';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import {
  useCreateSubjectType,
  useDeleteSubjectType,
  useUpdateSubjectType,
} from '@academic-portfolio/hooks/mutations/useMutateSubjectType';
import useSubjectTypes from '@academic-portfolio/hooks/useSubjectTypes';
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
  InputWrapper,
  Stack,
  Box,
} from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useQueryClient } from '@tanstack/react-query';
import { useUserCenters } from '@users/hooks';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const SubjectTypesPage = () => {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('subjectTypes_page'));
  const [subjectTypes, setSubjectTypes] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [showEmptyState, setShowEmptyState] = useState(false);
  const history = useHistory();
  const queryClient = useQueryClient();
  const { data: userCenters, isLoading: centersLoading } = useUserCenters();
  const { mutate: createSubjectType, isLoading: isCreateLoading } = useCreateSubjectType();
  const { mutate: updateSubjectType, isLoading: isUpdateLoading } = useUpdateSubjectType();
  const { mutate: deleteSubjectType, isLoading: isDeleteLoading } = useDeleteSubjectType();
  const scrollRef = useRef();
  const [dataFetched, setDataFetched] = useState(false); // Flag to be sure when we should show the empty state

  // INIT & EFFECTS ------------------------------------------------------------------------------------------------ ||

  const centersData = useMemo(
    () => userCenters?.map((center) => ({ value: center?.id, label: center?.name })),
    [userCenters]
  );
  const { data: subjectTypesQuery, isLoading: subjectTypesLoading } = useSubjectTypes({
    center: selectedCenter,
    options: { enabled: selectedCenter?.length > 0 },
  });

  const isLoading = useMemo(() => {
    const waitForSubjectTypesList = selectedCenter?.length > 0 && subjectTypesLoading;
    return (
      tLoading ||
      centersLoading ||
      waitForSubjectTypesList ||
      isCreateLoading ||
      isUpdateLoading ||
      isDeleteLoading
    );
  }, [
    selectedCenter,
    subjectTypesLoading,
    centersLoading,
    isCreateLoading,
    isUpdateLoading,
    isDeleteLoading,
    tLoading,
  ]);

  useEffect(() => {
    if (subjectTypesQuery?.length) {
      setSubjectTypes([...subjectTypesQuery]);
      setShowEmptyState(false);
    } else if (!subjectTypesQuery?.length && dataFetched) {
      setShowEmptyState(true);
    }
  }, [subjectTypesQuery, dataFetched]);

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
        Header: t('labels.type'),
        accessor: 'name',
        input: {
          node: <TextInput required />,
          rules: { required: t('errors.requiredField') },
        },
        style: { paddingLeft: 10, width: 232 },
      },
      {
        Header: t('labels.description'),
        accessor: 'description',
        input: {
          node: <TextInput />,
        },
        style: { paddingLeft: 10 },
      },
    ],
    [t]
  );

  // HANDLERS ---------------------------------------------------------------------------------------------- ||

  const onSubmit = async (data) => {
    if (showEmptyState) setShowEmptyState(false);
    const { name, description } = data;
    const center = selectedCenter;

    createSubjectType(
      {
        name,
        description: description?.length ? description : null,
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
      description: newItem.description?.length ? newItem.description : null,
    };
    updateSubjectType(mutationObject, {
      onSuccess: () => {
        addSuccessAlert(t('alerts.success.update'));
      },
      onError: (e) => {
        addErrorAlert(e);
      },
    });
  };

  const handleOnRemove = async (index) => {
    const itemToRemove = subjectTypes[index];
    deleteSubjectType(
      { center: selectedCenter, subjectTypeId: itemToRemove?.id, soft: false },
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
              sx={{ width: 262 }}
              data={centersData}
              placeholder={t('header.centerSelectPlaceholder')}
              onChange={(value) => {
                setSelectedCenter(value);
              }}
              value={selectedCenter}
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
                    <Box sx={{ width: 216, minHeight: 88 }}>
                      <Controller
                        control={form.control}
                        name="name"
                        rules={{ required: t('errors.requiredField') }}
                        render={({ field }) => (
                          <TextInput
                            {...field}
                            onBlur={() => {
                              form.clearErrors('name');
                            }}
                            required
                            label={t('labels.name')}
                            error={form.formState.errors.name}
                            placeholder={t('placeholders.name')}
                          />
                        )}
                      />
                    </Box>
                    <Box sx={{ width: 216, minHeight: 88 }}>
                      <Controller
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <TextInput
                            {...field}
                            label={t('labels.description')}
                            placeholder={t('placeholders.description')}
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
                      data={subjectTypes}
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

export default SubjectTypesPage;
