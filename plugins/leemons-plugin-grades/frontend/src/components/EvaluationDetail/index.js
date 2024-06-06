import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, ContextContainer, Title, Stack } from '@bubbles-ui/components';
import { find } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@grades/helpers/prefixPN';
import { EvaluationDetailStyles } from './styles';
import { Name } from './components/Name';
import { Type } from './components/Type';
import { IsPercentage } from './components/IsPercentage';
import { Scales } from './components/Scales';
import { MinScaleToPromote } from './components/MinScaleToPromote';
import { OtherTags } from './components/OtherTags';

const EvaluationDetail = ({
  selectData,
  defaultValues,
  onSubmit,
  onBeforeRemoveScale,
  onBeforeRemoveTag,
  form,
}) => {
  const { classes, cx } = EvaluationDetailStyles({});
  const [t] = useTranslateLoader(prefixPN('evaluationsPage'));
  const {
    reset,
    watch,
    unregister,
    resetField,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    reset({ ...defaultValues });
  }, [defaultValues]);
  const isInUse = defaultValues?.inUse;
  useEffect(() => {
    const subscription = watch(({ type }, { name }) => {
      if (name === 'type') {
        resetField('scales');
        if (type !== 'numeric') {
          unregister('isPercentage');
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const type = find(selectData.type, { value: watch('type') });

  const typeNumeric = type?.value === 'numeric';

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <ContextContainer>
        <Title order={3}>{t('basicData')}</Title>
        <Stack spacing={5} fullWidth>
          <Name form={form} inUse={isInUse} />
          <Type selectData={selectData} form={form} inUse={isInUse} />
        </Stack>

        {type ? (
          <>
            <Box>
              <Title order={4}>{typeNumeric ? t('numbersTitle') : t('lettersTitle')}</Title>
            </Box>
            {typeNumeric ? (
              <Box>
                <IsPercentage form={form} inUse={isInUse} />
              </Box>
            ) : null}
            <Scales
              selectData={selectData}
              onBeforeRemove={onBeforeRemoveScale}
              form={form}
              inUse={isInUse}
            />
          </>
        ) : null}

        {type && (
          <>
            <Box className={classes.containerFiftyPercent}>
              <MinScaleToPromote form={form} inUse={isInUse} />
            </Box>
            <Box>
              <Title order={4}>{t('othersTitle')}</Title>
            </Box>
            <Box>
              <OtherTags form={form} onBeforeRemove={onBeforeRemoveTag} inUse={isInUse} />
            </Box>
          </>
        )}
      </ContextContainer>
    </form>
  );
};

EvaluationDetail.defaultProps = {
  onSubmit: () => {},
  selectData: {
    type: [
      { label: 'Numeric', value: 'numeric' },
      { label: 'Letter', value: 'letter' },
    ],
  },
};

EvaluationDetail.propTypes = {
  loading: PropTypes.bool,
  onSubmit: PropTypes.func,
  defaultValues: PropTypes.object,
  selectData: PropTypes.object,
  onBeforeRemoveScale: PropTypes.func,
  onBeforeRemoveTag: PropTypes.func,
  isSaving: PropTypes.bool,
  form: PropTypes.object,
};

export { EvaluationDetail };
