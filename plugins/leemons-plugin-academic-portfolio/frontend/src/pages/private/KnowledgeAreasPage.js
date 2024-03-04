import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import {
  Select,
  TableInput,
  TextInput,
  TotalLayoutContainer,
  TotalLayoutHeader,
  TotalLayoutStepContainer,
  LoadingOverlay,
  Stack,
  Box,
} from '@bubbles-ui/components';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useUserCenters } from '@users/hooks';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import SubjectTypesEmptyState from '@academic-portfolio/components/SubjectTypesEmptyState';
import useKnowledgeAreas from '@academic-portfolio/hooks/useKnowledgeAreas';
import {
  useCreateKnowledgeArea,
  useDeleteKnowledgeArea,
  useUpdateKnowledgeArea,
} from '@academic-portfolio/hooks/mutations/useMutateKnowledgeArea';

const KnowledgeAreasPage = () => {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('knowledgeAreas_page'));
  const [knowledgeAreas, setKnowledgeAreas] = useState([]);
  const [centerValue, setCenterValue] = useState('');
  const [showEmptyState, setShowEmptyState] = useState(false);
  const history = useHistory();
  const queryClient = useQueryClient();
  const { data: userCenters, isLoading: areCentersLoading } = useUserCenters();
  const { mutate: createKnowledgeArea, isLoading: isCreateLoading } = useCreateKnowledgeArea();
  const { mutate: updateKnowledgeArea, isLoading: isUpdateLoading } = useUpdateKnowledgeArea();
  const { mutate: deleteKnowledgeArea, isLoading: isDeleteLoading } = useDeleteKnowledgeArea();
  const scrollRef = useRef();

  // INIT & EFFECTS ------------------------------------------------------------------------------------------------ ||

  const centersData = useMemo(
    () => userCenters?.map((center) => ({ value: center?.id, label: center?.name })),
    [userCenters]
  );
  const { data: knowledgeAreasQuery, isLoading: knowledgeAreasLoading } = useKnowledgeAreas({
    center: centerValue,
    options: { enabled: centerValue?.length > 0 },
  });

  useEffect(() => {
    if (knowledgeAreasQuery?.length) {
      setKnowledgeAreas([...knowledgeAreasQuery]);
      if (showEmptyState) setShowEmptyState(false);
    } else {
      setKnowledgeAreas([]);
      if (!showEmptyState) setShowEmptyState(true);
    }
  }, [knowledgeAreasQuery]);

  // **Activated for the center Select to automatically pick a center when first loaded
  useEffect(() => {
    if (centersData?.length) {
      setCenterValue(centersData[0].value);
    }
  }, [centersData]);

  const isLoading = useMemo(() => {
    const waitForSubjectTypesList = centerValue?.length > 0 && knowledgeAreasLoading;
    return (
      tLoading ||
      areCentersLoading ||
      waitForSubjectTypesList ||
      isCreateLoading ||
      isUpdateLoading ||
      isDeleteLoading
    );
  }, [
    centerValue,
    knowledgeAreasLoading,
    areCentersLoading,
    isCreateLoading,
    isUpdateLoading,
    isDeleteLoading,
    tLoading,
  ]);

  // TABLE SETUP  ------------------------------------------------------------------------------------------ ||

  const tableInputForm = useForm();

  const tableInputColumns = useMemo(
    () => [
      {
        Header: t('table.headers.name'),
        accessor: 'name',
        input: {
          node: <TextInput required />,
          rules: { required: t('errors.requiredField') },
        },
      },
      {
        Header: t('table.headers.alias'),
        accessor: 'abbreviation',
        input: {
          node: <TextInput required />,
          rules: { required: t('errors.requiredField') },
        },
      },
    ],
    [t]
  );

  // HANDLERS ---------------------------------------------------------------------------------------------- ||

  const handleOnBeforeAdd = async () => {
    if (showEmptyState) setShowEmptyState(false);
  };

  const handleAdd = async () => {
    const name = tableInputForm.getValues('name');
    const abbreviation = tableInputForm.getValues('abbreviation');
    const center = centerValue;

    createKnowledgeArea(
      {
        name,
        abbreviation,
        center,
      },
      {
        onSuccess: () => {
          addSuccessAlert(t('alerts.success.add'));
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
      { center: centerValue, knowledgeAreaId: itemToRemove?.id, soft: false },
      {
        onSuccess: () => {
          addSuccessAlert(t('alerts.success.delete'));
          queryClient.invalidateQueries(centerValue);
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
            {' '}
            <Select
              data={centersData}
              placeholder={t('header.centerSelectPlaceholder')}
              onChange={(value) => {
                setCenterValue(value);
              }}
              value={centerValue}
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
          {centerValue?.length > 0 && (
            <TotalLayoutStepContainer>
              <TableInput
                columns={tableInputColumns}
                onAdd={handleAdd}
                labels={{
                  add: t('table.labels.add'),
                  remove: t('table.labels.remove'),
                  edit: t('table.labels.edit'),
                  accept: t('table.labels.accept'),
                  cancel: t('table.labels.cancel'),
                }}
                resetOnAdd
                editable
                removable
                unique
                sortable={false}
                data={knowledgeAreas}
                form={tableInputForm}
                onUpdate={handleOnUpdate}
                onRemove={handleOnRemove}
                onBeforeAdd={handleOnBeforeAdd}
              />
              {showEmptyState && (
                <Box sx={{ justifySelf: 'center' }}>
                  <SubjectTypesEmptyState
                    labels={{ text: t('emptyState.text'), altText: t('emptyState.altText') }}
                  />
                </Box>
              )}
            </TotalLayoutStepContainer>
          )}
        </Stack>
      </TotalLayoutContainer>
    </>
  );
};

export default KnowledgeAreasPage;
