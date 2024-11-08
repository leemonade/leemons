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
      <Drawer.Header title="Edición en bloque" />
      <Drawer.Content>
        <Alert closeable={false}>
          <Text>
            Ten en cuenta que
            <Text strong> se editarán todos los recursos seleccionados en la tabla.</Text>
          </Text>
        </Alert>
        <ContextContainer title={'Presentación'}>
          {!areAllImagesSelected && (
            <>
              <Alert closeable={false}>
                <Text>
                  No se cambiará la imagen destacada
                  <Text strong> a los recursos de tipo imagen.</Text>
                </Text>
              </Alert>
              <Controller
                control={control}
                name="cover"
                render={({ field }) => (
                  <ImagePicker
                    labels={labels}
                    value={initialFormValues.cover?.id || initialFormValues.cover}
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
                label={'Color'}
                value={initialFormValues.color}
                placeholder={'Selecciona un color'}
                manual={false}
                disabled={subjects?.length}
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
                  title: 'Programa y asignaturas',
                  program: 'Programa',
                  subject: 'Asignatura',
                  add: 'Añadir asignatura',
                  course: 'Curso',
                  placeholder: 'Selecciona una asignatura',
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
                label={labels.tags}
                labels={{ addButton: labels.addTag }}
                placeholder={placeholders.tags}
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
            Cancelar
          </Button>
          <Button onClick={onSave}>Guardar</Button>
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
};

export { BulkEditDrawer };
