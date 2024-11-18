import { useState, useEffect } from 'react';
import { Controller, useWatch } from 'react-hook-form';

import { SubjectPicker } from '@academic-portfolio/components/SubjectPicker';
import {
  Drawer,
  Text,
  Stack,
  Button,
  Alert,
  ColorInput,
  ContextContainer,
} from '@bubbles-ui/components';
import { TagsAutocomplete } from '@common';
import { map, isString } from 'lodash';
import propTypes from 'prop-types';

import { ImagePicker } from '../../../ImagePicker';

const BulkEditDrawer = ({
  isOpen,
  onClose,
  onSave,
  control,
  labels = {},
  placeholders = {},
  t,
  setValue,
  areAllImagesSelected,
  selectedAssets = [],
}) => {
  const [program, setProgram] = useState(null);
  const [initialFormValues, setInitialFormValues] = useState({});

  const subjects = useWatch({
    control,
    name: 'subjects',
  });

  const getCommonValueFromAssets = (propertyPath) => {
    if (!selectedAssets?.length) return null;

    const firstValue = selectedAssets[0][propertyPath];

    if (firstValue === undefined) return null;

    if (Array.isArray(firstValue)) {
      const allHaveSameLength = selectedAssets.every(
        (asset) => asset[propertyPath]?.length === firstValue.length
      );

      if (!allHaveSameLength) return null;

      if (propertyPath === 'tags') {
        return selectedAssets.every(
          (asset) =>
            asset[propertyPath]?.every((tag) => firstValue.includes(tag)) &&
            firstValue.every((tag) => asset[propertyPath]?.includes(tag))
        )
          ? firstValue
          : null;
      }

      if (propertyPath === 'subjects') {
        return selectedAssets.every(
          (asset) =>
            asset[propertyPath]?.every((subject) =>
              firstValue.some((firstSubject) => firstSubject.subject === subject.subject)
            ) &&
            firstValue.every((firstSubject) =>
              asset[propertyPath]?.some((subject) => subject.subject === firstSubject.subject)
            )
        )
          ? firstValue
          : null;
      }
    }

    if (propertyPath === 'cover') {
      return selectedAssets.every(
        (asset) =>
          (typeof asset[propertyPath] === typeof firstValue &&
            (typeof firstValue === 'string'
              ? asset[propertyPath] === firstValue
              : asset[propertyPath]?.id === firstValue?.id)) ||
          (asset[propertyPath] === null && firstValue === null)
      )
        ? firstValue
        : null;
    }

    return selectedAssets.every((asset) => asset[propertyPath] === firstValue) ? firstValue : null;
  };

  useEffect(() => {
    if (isOpen) {
      const values = {
        cover: getCommonValueFromAssets('cover'),
        color: getCommonValueFromAssets('color'),
        subjects: getCommonValueFromAssets('subjects'),
        tags: getCommonValueFromAssets('tags'),
        program: getCommonValueFromAssets('program'),
      };

      Object.entries(values).forEach(([key, value]) => {
        if (value !== null) {
          setValue(key, value);
        }
      });

      setInitialFormValues(values);

      if (values.subjects?.length > 0) {
        setProgram(values.subjects[0].programId);
      }
    }
  }, [isOpen, selectedAssets, setValue]);

  const setAssetColorToSubjectColor = (subjectsFromPicker) => {
    if (!subjectsFromPicker?.length) {
      setValue('color', null);
      return;
    }
    if (subjectsFromPicker.length === 1) {
      setValue('color', subjectsFromPicker[0].color);
    }
    if (subjectsFromPicker.length > 1) {
      setValue('color', '#878D96');
    }
  };

  return (
    <Drawer size="xl" opened={isOpen} onClose={onClose}>
      <Drawer.Header title={t('bulkEditDrawer.title')} />
      <Drawer.Content>
        <Alert closeable={false}>
          <Text>
            {t('bulkEditDrawer.alertEditPartOne')}
            <Text strong>{t('bulkEditDrawer.alertEditPartTwo')}</Text>
          </Text>
        </Alert>
        <ContextContainer title={t('bulkEditDrawer.presentation')}>
          {!areAllImagesSelected && (
            <>
              <Alert closeable={false}>
                <Text>
                  {t('bulkEditDrawer.alertCoverPartOne')}
                  <Text strong>{t('bulkEditDrawer.alertCoverPartTwo')}</Text>
                </Text>
              </Alert>
              <Controller
                control={control}
                name="cover"
                render={({ field }) => (
                  <ImagePicker
                    labels={labels}
                    value={initialFormValues.cover?.id || initialFormValues.cover || field.value}
                    onChange={field.onChange}
                    isPickingACover
                  />
                )}
              />
            </>
          )}
          <Controller
            control={control}
            name="color"
            render={({ field }) => (
              <ColorInput
                {...field}
                label={t('bulkEditDrawer.colorLabel')}
                value={field.value}
                placeholder={t('bulkEditDrawer.colorPlaceholder')}
                manual={false}
                disabled={subjects?.length > 0}
                contentStyle={{ width: 190 }}
                clearable
              />
            )}
          />
        </ContextContainer>
        <ContextContainer>
          <Controller
            name="subjects"
            control={control}
            render={({ field }) => (
              <SubjectPicker
                {...field}
                value={map(field.value || [], (subject) => {
                  return isString(subject) ? subject : subject?.subject;
                })}
                assignable={{}}
                onChangeRaw={(subjectsRaw) => {
                  setAssetColorToSubjectColor(subjectsRaw);
                  if (subjectsRaw.length > 0) {
                    setValue('subjectsRaw', subjectsRaw);
                    if (subjectsRaw[0].programId !== program) {
                      setProgram(subjectsRaw[0].programId);
                      setValue('program', subjectsRaw[0].programId);
                    }
                  } else if (program) {
                    setProgram(null);
                    setValue('program', null);
                  }
                }}
                localizations={{
                  title: t('bulkEditDrawer.subjectsTitle'),
                  program: t('bulkEditDrawer.programLabel'),
                  subject: t('bulkEditDrawer.subjectLabel'),
                  add: t('bulkEditDrawer.addSubjectLabel'),
                  course: t('bulkEditDrawer.courseLabel'),
                  placeholder: t('bulkEditDrawer.subjectsPlaceholder'),
                }}
                hideSectionHeaders={false}
              />
            )}
          />
        </ContextContainer>
        <ContextContainer title={'Tags'}>
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <TagsAutocomplete
                label={t('bulkEditDrawer.tagsLabel')}
                labels={{ addButton: t('bulkEditDrawer.addTagLabel') }}
                placeholder={t('bulkEditDrawer.tagsPlaceholder')}
                pluginName="leebrary"
                {...field}
              />
            )}
          />
        </ContextContainer>
      </Drawer.Content>

      <Drawer.Footer>
        <Stack justifyContent="space-between" fullWidth>
          <Button variant="outline" onClick={onClose}>
            {t('bulkEditDrawer.cancelButton')}
          </Button>
          <Button onClick={onSave}>{t('bulkEditDrawer.saveButton')}</Button>
        </Stack>
      </Drawer.Footer>
    </Drawer>
  );
};

BulkEditDrawer.propTypes = {
  isOpen: propTypes.bool,
  onClose: propTypes.func,
  onSave: propTypes.func,
  control: propTypes.object,
  labels: propTypes.object,
  placeholders: propTypes.object,
  setValue: propTypes.func,
  areAllImagesSelected: propTypes.bool,
  selectedAssets: propTypes.array,
  t: propTypes.func,
};

export { BulkEditDrawer };
