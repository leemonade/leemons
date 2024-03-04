import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import {
  Select,
  TableInput,
  TextInput,
  Checkbox,
  TotalLayoutContainer,
  TotalLayoutHeader,
  TotalLayoutStepContainer,
  LoadingOverlay,
  Stack,
  Box,
} from '@bubbles-ui/components';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { useUserCenters } from '@users/hooks';
import {
  useCreateSubjectType,
  useDeleteSubjectType,
  useUpdateSubjectType,
} from '@academic-portfolio/hooks/mutations/useMutateSubjectType';
import useSubjectTypes from '@academic-portfolio/hooks/useSubjectTypes';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-portfolio/helpers/prefixPN';
import SubjectTypesEmptyState from '@academic-portfolio/components/SubjectTypesEmptyState';

const SubjectTypesPage = () => {
  const [t, , , tLoading] = useTranslateLoader(prefixPN('subjectTypes_page'));
  const [subjectTypes, setSubjectTypes] = useState([]);
  const [centerValue, setCenterValue] = useState('');
  const [showEmptyState, setShowEmptyState] = useState(false);
  const history = useHistory();
  const queryClient = useQueryClient();
  const [canLinkToReferenceGroup, setCanLinkToReferenceGroup] = useState(true);
  const { data: userCenters, isLoading: centersLoading } = useUserCenters();
  const { mutate: createSubjectType, isLoading: isCreateLoading } = useCreateSubjectType();
  const { mutate: updateSubjectType, isLoading: isUpdateLoading } = useUpdateSubjectType();
  const { mutate: deleteSubjectType, isLoading: isDeleteLoading } = useDeleteSubjectType();

  const referenceGroupRef = useRef();
  const scrollRef = useRef();

  // INIT & EFFECTS ------------------------------------------------------------------------------------------------ ||

  const centersData = useMemo(
    () => userCenters?.map((center) => ({ value: center?.id, label: center?.name })),
    [userCenters]
  );
  const { data: subjectTypesQuery, isLoading: subjectTypesLoading } = useSubjectTypes({
    center: centerValue,
    options: { enabled: centerValue?.length > 0 },
  });

  useEffect(() => {
    if (subjectTypesQuery?.length) {
      const referenceGroupLink = subjectTypesQuery.filter((item) => item.createsReferenceGroup)[0];
      if (referenceGroupLink) {
        referenceGroupRef.current = { enablerValue: referenceGroupLink.id };
      }
      setSubjectTypes([...subjectTypesQuery]);
      if (showEmptyState) setShowEmptyState(false);
    } else {
      setSubjectTypes([]);
      if (!showEmptyState) setShowEmptyState(true);
      if (!canLinkToReferenceGroup) setCanLinkToReferenceGroup(true);
    }
  }, [subjectTypesQuery]);

  useEffect(() => {
    if (subjectTypes?.length) {
      const roleIsTakenAlready = subjectTypes.some(
        (subjectType) => subjectType.createsReferenceGroup
      );
      setCanLinkToReferenceGroup(!roleIsTakenAlready);
    }
  }, [subjectTypes]);

  // **Activated for the center Select to automatically pick a center when first loaded
  useEffect(() => {
    if (centersData?.length) {
      setCenterValue(centersData[0].value);
    }
  }, [centersData]);

  const isLoading = useMemo(() => {
    const waitForSubjectTypesList = centerValue?.length > 0 && subjectTypesLoading;
    return (
      tLoading ||
      centersLoading ||
      waitForSubjectTypesList ||
      isCreateLoading ||
      isUpdateLoading ||
      isDeleteLoading
    );
  }, [
    centerValue,
    subjectTypesLoading,
    centersLoading,
    isCreateLoading,
    isUpdateLoading,
    isDeleteLoading,
    tLoading,
  ]);

  // TABLE SETUP  ------------------------------------------------------------------------------------------ ||

  const tableInputForm = useForm();
  const checkboxObserver = tableInputForm.watch('createsReferenceGroup');

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
        accessor: 'createsReferenceGroup',
        input: {
          node: (
            <Checkbox
              ref={referenceGroupRef}
              label={t('table.labels.linkToReferenceGroup')}
              checked={!!checkboxObserver}
            />
          ),
          disabled: !canLinkToReferenceGroup,
          useDynamicEnabling: !canLinkToReferenceGroup,
          enablerProperty: 'id',
        },
        valueRender: (value) => {
          if (value) return t('table.labels.linkedToReferenceGroup');
          return t('table.labels.notLinkedToReferenceGroup');
        },
      },
    ],
    [checkboxObserver, canLinkToReferenceGroup, t]
  );

  // HANDLERS ---------------------------------------------------------------------------------------------- ||

  const handleOnBeforeAdd = async () => {
    if (showEmptyState) setShowEmptyState(false);
  };

  const handleAdd = async () => {
    const name = tableInputForm.getValues('name');
    const createsReferenceGroup = !!tableInputForm.getValues('createsReferenceGroup');
    const center = centerValue;

    createSubjectType(
      {
        name,
        createsReferenceGroup,
        center,
        groupVisibility: createsReferenceGroup,
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
      createsReferenceGroup: !!newItem.createsReferenceGroup,
      groupVisibility: !!newItem.createsReferenceGroup,
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
      { center: centerValue, subjectTypeId: itemToRemove?.id, soft: false },
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
                data={subjectTypes}
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

export default SubjectTypesPage;
