import React, { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Box,
  Stack,
  Table,
  Drawer,
  Button,
  ActionButton,
  LoadingOverlay,
  TotalLayoutContainer,
  TotalLayoutHeader,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';
import {
  AddCircleIcon,
  DeleteBinIcon,
  EditIcon,
  PluginScoresBasicIcon,
} from '@bubbles-ui/icons/outline';
import { useStore } from '@common/useStore';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { SelectCenter } from '@users/components/SelectCenter';
import { cloneDeep, find, groupBy, map } from 'lodash';

import { EvaluationDetail } from '../../../components/EvaluationDetail';
import { activeMenuItemPromotions } from '../../../helpers/activeMenuItemPromotions';
import {
  addGradeRequest,
  addGradeScaleRequest,
  addGradeTagRequest,
  canDeleteGradeScaleRequest,
  deleteGradeRequest,
  deleteGradeScaleRequest,
  deleteGradeTagRequest,
  listGradesRequest,
  updateGradeRequest,
  updateGradeScaleRequest,
  updateGradeTagRequest,
} from '../../../request';

import { EmptyState } from '@grades/components/EvaluationDetail/components/EmptyState';
import prefixPN from '@grades/helpers/prefixPN';

export default function EvaluationList() {
  const [t] = useTranslateLoader(prefixPN('evaluationsPage'));
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const scrollRef = useRef();
  const [store, render] = useStore();

  const form = useForm({ defaultValues: store.selectedGrade });

  const headerValues = useMemo(
    () => ({
      title: t('pageTitle'),
      description: t('pageDescription'),
    }),
    [t]
  );

  async function getGrades() {
    const {
      data: { items },
    } = await listGradesRequest({ page: 0, size: 9999, center: store.center });
    return items;
  }

  async function onSelectCenter(center) {
    store.loading = true;
    render();

    store.center = center;
    store.grades = await getGrades();
    store.loading = false;
    render();
  }

  function onAdd() {
    setIsDrawerOpened(true);
    store.selectedGrade = {
      name: null,
      type: null,
      scales: [],
      tags: [],
      minScaleToPromote: null,
      isPercentage: null,
    };
    render();
  }

  function onSelect(e) {
    store.selectedGrade = cloneDeep(find(store.grades, { id: e.id }));
    store.selectedGrade.minScaleToPromote = find(store.selectedGrade.scales, {
      id: store.selectedGrade.minScaleToPromote,
    }).number;
    store.selectedGrade.tags = map(store.selectedGrade.tags, (tag) => ({
      ...tag,
      scale: tag.scale.number,
    }));
    if (store.selectedGrade.type === 'numeric') {
      store.selectedGrade.scales = store.selectedGrade.scales.sort((a, b) => a.number - b.number);
    }
    setIsDrawerOpened(true);
    render();
  }

  async function onDelete(e) {
    try {
      await deleteGradeRequest(e.id);
      await onSelectCenter(store.center);
      addSuccessAlert(t('successDelete'));
    } catch (err) {
      addErrorAlert(err.message);
    }
  }

  async function onSubmit(e) {
    try {
      if (!store.saving) {
        store.saving = true;
        render();
        let grade = e;
        if (!e.id) {
          // Add
          const add = { name: e.name, type: e.type, scales: [] };
          if (e.type === 'numeric') add.isPercentage = !!e.isPercentage;
          const { grade: addGrade } = await addGradeRequest({ ...add, center: store.center });
          grade = addGrade;
        }

        let tagsToDelete = [];
        let tagsToUpdate = [];
        let tagsToAdd = [];
        let scalesToDelete = [];
        let scalesToUpdate = [];
        let scalesToAdd = [];

        if (!e.tags) e.tags = [];
        if (!e.scales) e.scales = [];

        const currentTagIds = map(store.selectedGrade.tags, 'id');
        const currentScaleIds = map(store.selectedGrade.scales, 'id');
        const newTagIds = map(e.tags, 'id');
        const newScaleIds = map(e.scales, 'id');

        e.scales = map(e.scales, (scale, index) => {
          const item = {
            description: scale.description,
            number: scale.number,
            order: index,
          };
          if (scale.id) item.id = scale.id;
          if (scale.letter) item.letter = scale.letter;
          return item;
        });

        // ES: Cogemos las ids actuales que no existan dentro de las nuevas para borrarlas
        tagsToDelete = currentTagIds.filter((id) => !newTagIds.includes(id));
        scalesToDelete = currentScaleIds.filter((id) => !newScaleIds.includes(id));
        scalesToAdd = e.scales.filter((scale) => !scale.id);
        scalesToUpdate = e.scales.filter((scale) => scale.id);

        const [newScales, updatedScales] = await Promise.all([
          Promise.all(
            scalesToAdd.map((scale) => addGradeScaleRequest({ ...scale, grade: grade.id }))
          ),
          Promise.all(scalesToUpdate.map((scale) => updateGradeScaleRequest(scale))),
          Promise.all(tagsToDelete.map((id) => deleteGradeTagRequest(id))),
        ]);

        const scales = map(newScales, 'gradeScale').concat(map(updatedScales, 'gradeScale'));

        // Update
        const update = {
          id: grade.id,
          name: grade.name,
          minScaleToPromote: find(
            map(scales, (s) => ({ ...s, number: s.number.toString() })),
            { number: e.minScaleToPromote.toString() }
          ).id,
        };
        const { grade: updatedGrade } = await updateGradeRequest({ ...update });

        e.tags = map(e.tags, (tag) => {
          const item = {
            letter: tag.letter,
            description: tag.description,
            scale: find(
              map(updatedGrade.scales, (s) => ({ ...s, number: s.number.toString() })),
              { number: tag.scale.toString() }
            ).id,
          };
          if (tag.id) item.id = tag.id;
          return item;
        });

        // ES: Cogemos los tags nuevos que no tengan id para crearlos
        tagsToAdd = e.tags.filter((tag) => !tag.id);

        // ES: Cogemos los tags nuevos que tengan id para actualizarlos
        tagsToUpdate = e.tags.filter((tag) => tag.id);

        await Promise.all([
          Promise.all(scalesToDelete.map((id) => deleteGradeScaleRequest(id))),
          Promise.all(
            tagsToAdd.map((tag) => addGradeTagRequest({ ...tag, grade: updatedGrade.id }))
          ),
          Promise.all(tagsToUpdate.map((tag) => updateGradeTagRequest({ ...tag }))),
        ]);

        store.selectedGrade = null;
        store.saving = false;
        await Promise.all([onSelectCenter(store.center), activeMenuItemPromotions()]);
        await addSuccessAlert(t('successSave'));
        setIsDrawerOpened(false);
      }
    } catch (error) {
      store.saving = false;
      render();
      addErrorAlert(error.message);
    }
  }

  async function onBeforeRemoveScale(e, { tags, minScaleToPromote }) {
    const tagsByScale = groupBy(tags, 'scale');

    if (tagsByScale[e.number]) {
      addErrorAlert(t(`errorCode6003`));
      return false;
    }

    if (!!minScaleToPromote && minScaleToPromote?.toString() === e.number?.toString()) {
      addErrorAlert(t(`errorCode6004`));
      return false;
    }

    if (e.id) {
      try {
        await canDeleteGradeScaleRequest(e.id);
      } catch (err) {
        if (err.code !== 6003 && err.code !== 6004) {
          await addErrorAlert(err.code ? t(`errorCode${err.code}`) : err.message);
          return false;
        }
      }
    }
    return true;
  }

  function getCenter() {
    const query = new URLSearchParams(window.location.search);
    return query.get('center');
  }

  React.useEffect(() => {
    const center = getCenter();
    if (center) onSelectCenter(center);
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: t('nameLabel'),
        accessor: 'name',
      },
      {
        Header: t('scaleLabel'),
        accessor: 'type',
      },
      {
        Header: t('minToPromoteLabel'),
        id: 'minScaleToPromote',
        accessor: (data) => {
          const scale = data.scales.find((scl) => scl.id === data.minScaleToPromote);
          return scale && data.type === 'letter' ? scale.letter : scale.number;
        },
      },
      {
        Header: '',
        accessor: 'actions',
      },
    ],
    [t]
  );

  const data = useMemo(
    () =>
      store.grades
        ? store.grades.map((grade) => ({
            ...grade,
            actions: (
              <Stack spacing={2} justifyContent="end" alignItems="center">
                <Box>
                  <ActionButton
                    icon={<EditIcon width={20} height={20} />}
                    onClick={() => onSelect(grade)}
                  />
                </Box>
                <Box>
                  <ActionButton
                    disabled={grade?.inUse}
                    icon={<DeleteBinIcon width={20} height={20} />}
                    onClick={() => onDelete(grade)}
                  />
                </Box>
              </Stack>
            ),
          }))
        : [],
    [store.grades]
  );
  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <TotalLayoutHeader
          cancelable={false}
          title={headerValues.title}
          icon={<PluginScoresBasicIcon />}
        >
          <Box>
            <SelectCenter firstSelected value={store.center} onChange={onSelectCenter} />
          </Box>
        </TotalLayoutHeader>
      }
    >
      <Stack justifyContent="center" ref={scrollRef} sx={{ overflowY: 'auto' }}>
        <TotalLayoutStepContainer>
          {store.loading ? (
            <LoadingOverlay visible />
          ) : (
            <Stack direction="column">
              {store?.grades?.length > 0 ? (
                <>
                  <Box>
                    <Button variant="link" leftIcon={<AddCircleIcon />} onClick={onAdd}>
                      {t('newEvaluationSystemButtonLabel')}
                    </Button>
                  </Box>
                  <Box style={{ marginTop: 16 }}>
                    <Table columns={columns} data={data || []} />
                  </Box>
                </>
              ) : (
                <EmptyState onAddSystem={onAdd} />
              )}
            </Stack>
          )}
        </TotalLayoutStepContainer>
      </Stack>
      <Drawer opened={isDrawerOpened} onClose={() => setIsDrawerOpened(false)} size="xl">
        <Drawer.Header title={t('newEvaluationSystemButtonLabel')} />
        <Drawer.Content>
          {store.selectedGrade && (
            <EvaluationDetail
              selectData={{
                type: [
                  { label: t('numbersTitle'), value: 'numeric' },
                  { label: t('lettersTitle'), value: 'letter' },
                ],
              }}
              defaultValues={store.selectedGrade}
              onBeforeRemoveScale={onBeforeRemoveScale}
              form={form}
            />
          )}
        </Drawer.Content>
        <Drawer.Footer>
          <Stack justifyContent="space-between" fullWidth>
            <Button variant="link" onClick={() => setIsDrawerOpened(false)}>
              {t('tableCancel')}
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              loading={store.saving}
              disabled={store?.selectedGrade?.inUse}
            >
              {t('saveButtonLabel')}
            </Button>
          </Stack>
        </Drawer.Footer>
      </Drawer>
    </TotalLayoutContainer>
  );
}
