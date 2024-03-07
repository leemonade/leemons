import { getUserProgramsRequest, listSessionClassesRequest } from '@academic-portfolio/request';
import {
  Button,
  ContextContainer,
  ListInput,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { useStore } from '@common';
import { groupBy, map, uniqBy } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';

export default function DetailConfig({
  form,
  t,
  store,
  scrollRef,
  onNext,
  onPrev,
  onSave,
  stepName,
}) {
  const [isDirty, setIsDirty] = React.useState(false);
  const [cStore, cRender] = useStore({
    subjectsByProgram: {},
  });
  const formValues = form.watch();
  const program = form.watch('program');

  const validate = async () => form.trigger([]);

  const handleOnNext = async () => {
    setIsDirty(true);
    if (await validate()) {
      onNext();
    }
  };

  const handleOnSave = async () => {
    setIsDirty(true);
    if (await validate()) {
      onSave();
    }
  };

  async function load() {
    const [{ programs }, { classes }] = await Promise.all([
      getUserProgramsRequest(),
      listSessionClassesRequest(),
    ]);
    cStore.subjects = uniqBy(map(classes, 'subject'), 'id');
    cStore.subjectsByProgram = groupBy(
      map(cStore.subjects, (item) => ({
        value: item.id,
        label: item.name,
        program: item.program,
      })),
      'program'
    );
    cStore.programs = programs;
    cStore.programsData = map(programs, ({ id, name }) => ({ value: id, label: name }));
    cRender();
  }

  React.useEffect(() => {
    load();
  }, []);

  return (
    <TotalLayoutStepContainer
      stepName={stepName}
      Footer={
        <TotalLayoutFooterContainer
          fixed
          scrollRef={scrollRef}
          leftZone={
            <Button
              variant="outline"
              leftIcon={<ChevLeftIcon height={20} width={20} />}
              onClick={onPrev}
            >
              {t('previous')}
            </Button>
          }
          rightZone={
            <>
              {!formValues.published ? (
                <Button
                  variant="link"
                  onClick={handleOnSave}
                  disabled={store.saving}
                  loading={store.saving === 'draft'}
                >
                  {t('saveDraft')}
                </Button>
              ) : null}

              <Button
                rightIcon={<ChevRightIcon height={20} width={20} />}
                onClick={handleOnNext}
                disabled={store.saving}
                loading={store.saving === 'publish'}
              >
                {t('continue')}
              </Button>
            </>
          }
        />
      }
    >
      <ContextContainer>
        <Controller
          control={form.control}
          name="categories"
          render={({ field }) => (
            <ListInput
              {...field}
              label={t('categoriesLabel')}
              addButtonLabel={t('addCategory')}
              canAdd
            />
          )}
        />
      </ContextContainer>
    </TotalLayoutStepContainer>
  );
}

DetailConfig.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  onSave: PropTypes.func,
  store: PropTypes.object,
  scrollRef: PropTypes.object,
  stepName: PropTypes.string,
};
