import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import prefixPN from '@academic-portfolio/helpers/prefixPN';
import { useSubjectDetails } from '@academic-portfolio/hooks';
import {
  useCreateBlock,
  useUpdateBlock,
  useDeleteBlock,
} from '@academic-portfolio/hooks/mutations/useMutateBlock';
import { useUpdateSubject } from '@academic-portfolio/hooks/mutations/useMutateSubject';
import useSubjectBlocks from '@academic-portfolio/hooks/queries/useSubjectBlocks';
import {
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
  Switch,
  Title,
  Text,
  Box,
} from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useQueryClient } from '@tanstack/react-query';

import { useBlockPageStyles } from './Blocks.styles';
import { Filters } from './Filters';

const Blocks = () => {
  const { classes } = useBlockPageStyles();
  const [t, , , tLoading] = useTranslateLoader(prefixPN('blocksPage'));
  const queryClient = useQueryClient();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showEmptyState, setShowEmptyState] = useState(false);

  const scrollRef = useRef();

  const form = useForm();

  const { mutateAsync: updateSubjectAsync, isLoading: isUpdateSubjectLoading } = useUpdateSubject();
  const { mutate: createBlock, isLoading: isCreateBlockLoading } = useCreateBlock({
    successMessage: t('alerts.success.add'),
    successFollowUp: () => form.reset(),
  });
  const { mutate: updateBlock, isLoading: isUpdateBlockLoading } = useUpdateBlock({
    successMessage: t('alerts.success.update'),
  });
  const { mutate: deleteBlock, isLoading: isDeleteBlockLoading } = useDeleteBlock({
    successMessage: t('alerts.success.delete'),
  });

  // INIT & EFFECTS ------------------------------------------------------------------------------------------------ ||

  const { data: subjectData, isLoading: subjectDataLoading } = useSubjectDetails(selectedSubject, {
    enabled: selectedSubject?.length > 0,
    refetchOnWindowFocus: false,
  });

  const { data: blocksDataFetched, isLoading: blocksDataLoading } = useSubjectBlocks({
    subjectId: selectedSubject,
    page: 0,
    size: 9999,
    options: {
      enabled: selectedSubject?.length > 0,
      refetchOnWindowFocus: false,
    },
  });

  const blocksData = useMemo(() => {
    return blocksDataFetched?.items
      ?.map((block) => ({
        ...block,
      }))
      .sort((a, b) => a.index - b.index);
  }, [blocksDataFetched]);

  const isLoading = useMemo(() => {
    if (!selectedSubject) return false;
    const blockMutationLoading =
      isCreateBlockLoading || isUpdateBlockLoading || isDeleteBlockLoading;
    return (
      tLoading ||
      subjectDataLoading ||
      isUpdateSubjectLoading ||
      blocksDataLoading ||
      blockMutationLoading
    );
  }, [
    selectedSubject,
    tLoading,
    subjectDataLoading,
    isCreateBlockLoading,
    isUpdateBlockLoading,
    isDeleteBlockLoading,
    isUpdateSubjectLoading,
    blocksDataLoading,
  ]);

  const useBlocks = useMemo(() => {
    if (!subjectData) return false;
    return !!subjectData.useBlocks;
  }, [subjectData?.useBlocks]);

  // EFFECTS ----------------------------------------------------------------------------------------------- ||

  useEffect(() => {
    if (blocksData?.length === 0 && useBlocks) {
      setShowEmptyState(true);
    } else {
      setShowEmptyState(false);
    }
  }, [blocksData, useBlocks]);

  // TABLE SETUP  ------------------------------------------------------------------------------------------ ||

  const tableInputColumns = useMemo(
    () => [
      {
        Header: t('labels.abbreviation'),
        accessor: 'abbreviation',
        input: {
          node: <TextInput required />,
          rules: { required: t('errors.requiredField') },
        },
        className: classes.abbreviationInput,
      },
      {
        Header: t('labels.name'),
        accessor: 'name',
        input: {
          node: <TextInput />,
        },
        className: classes.nameInput,
      },
    ],
    [t, classes]
  );

  // HANDLERS ---------------------------------------------------------------------------------------------- ||

  const handleOnAdd = (data) => {
    if (showEmptyState) setShowEmptyState(false);
    const { name, abbreviation } = data;

    createBlock({
      name,
      abbreviation,
      subject: selectedSubject,
      index: blocksData.length + 1,
    });
  };

  const handleOnUpdate = ({ oldItem, newItem }) => {
    const mutationObject = {
      id: oldItem.id,
      name: newItem.name,
      abbreviation: newItem.abbreviation,
    };
    updateBlock(mutationObject);
  };

  const handleOnSort = ({ from, to }) => {
    const updatedBlocks = [...blocksData];
    const [movedBlock] = updatedBlocks.splice(from, 1);
    updatedBlocks.splice(to, 0, movedBlock);

    const startIndex = Math.min(from, to);
    const endIndex = Math.max(from, to);

    for (let i = startIndex; i <= endIndex; i++) {
      updateBlock({
        id: updatedBlocks[i].id,
        index: i + 1,
      });
    }
  };
  const handleOnRemove = (index) => {
    const itemToRemove = blocksData[index];
    deleteBlock({ id: itemToRemove.id, subjectId: selectedSubject });
  };

  const handleOnActivateSubjectBlocks = async (value) => {
    await updateSubjectAsync({
      id: selectedSubject,
      useBlocks: !!value,
    });

    queryClient.invalidateQueries([
      'subjectDetail',
      { subject: selectedSubject, withClasses: false, showArchived: false },
    ]);
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <TotalLayoutContainer
        scrollRef={scrollRef}
        Header={
          <TotalLayoutHeader title={t('header.title')} cancelable={false}>
            <Filters onChange={(payload) => setSelectedSubject(payload.subjectId)} />
          </TotalLayoutHeader>
        }
      >
        <Stack
          ref={scrollRef}
          justifyContent="center"
          fullwidth
          sx={{ overflowY: 'auto', backgroundColor: '#f8f9fb' }}
        >
          {selectedSubject?.length > 0 ? (
            <TotalLayoutStepContainer>
              <ContextContainer noFlex spacing={2}>
                <Switch
                  label={t('labels.activateBlocks')}
                  checked={useBlocks}
                  onChange={(value) => handleOnActivateSubjectBlocks(value)}
                  disabled={isLoading}
                />
                {useBlocks && (
                  <>
                    <form onSubmit={form.handleSubmit(handleOnAdd)}>
                      <ContextContainer direction="row" alignItems="start">
                        <Box className={classes.abbreviationInput}>
                          <Controller
                            control={form.control}
                            name="abbreviation"
                            rules={{ required: t('errors.requiredField') }}
                            render={({ field }) => (
                              <TextInput
                                {...field}
                                onBlur={() => {
                                  form.clearErrors('abbreviation');
                                }}
                                required
                                label={t('labels.abbreviation')}
                                error={form.formState.errors.abbreviation}
                                placeholder={t('placeholders.abbreviation')}
                              />
                            )}
                          />
                        </Box>
                        <Box className={classes.nameInput}>
                          <Controller
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <TextInput
                                {...field}
                                label={t('labels.name')}
                                placeholder={t('placeholders.name')}
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

                    {showEmptyState ? (
                      <Stack justifyContent="center" alignItems="center" fullHeight>
                        <Text order={1}>{t('emptyState.text') ?? 'foo foo foo foo bar'}</Text>
                      </Stack>
                    ) : (
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
                          sortable
                          data={blocksData}
                          onUpdate={handleOnUpdate}
                          onRemove={handleOnRemove}
                          onSort={(value) => handleOnSort(value)}
                          fullWidth
                        />
                      </Box>
                    )}
                  </>
                )}
              </ContextContainer>
            </TotalLayoutStepContainer>
          ) : (
            <TotalLayoutStepContainer>
              <Stack justifyContent="center" alignItems="center">
                <Title order={3}>{t('emptyFilters')} ☝️</Title>
              </Stack>
            </TotalLayoutStepContainer>
          )}
        </Stack>
      </TotalLayoutContainer>
    </>
  );
};

export default Blocks;
