import React from 'react';
import PropTypes from 'prop-types';
import { evaluationTypes } from '@assignables/components/Assignment/components/EvaluationType';
import { useFormLocalizations } from '@assignables/components/Assignment/Form';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  createStyles,
  TotalLayoutFooterContainer,
  ContextContainer,
} from '@bubbles-ui/components';
import { Instructions } from '@assignables/components/Assignment/components/Instructions';
import Presentation from '@assignables/components/Assignment/components/Presentation/Presentation';
import useAsset from '@leebrary/request/hooks/queries/useAsset';

export const useAssignmentDrawerStyles = createStyles(() => ({
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'end',
  },
}));

export default function AssignmentDrawer({ assignable, value, onSave, onClose, scrollRef }) {
  const localizations = useFormLocalizations();
  const form = useForm({ defaultValues: value });

  const assetId = assignable?.metadata?.leebrary?.asset;
  const { data: asset } = useAsset({ id: assetId, showPublic: true });

  const isImage = asset?.file?.type?.startsWith('image/');

  const onSubmit = form.handleSubmit((values) => {
    onSave({
      config: {
        ...evaluationTypes.nonEvaluable,
        metadata: {
          isAsset: true,
          statement: values.instructions,
          asset: {
            title: values.title,
            color: assignable?.asset?.color,
            cover: values.thumbnail,
          },
        },
      },
      raw: values,
    });
  });

  return (
    <FormProvider {...form}>
      <Box>
        <ContextContainer padded>
          <Presentation
            assignable={assignable}
            localizations={localizations?.presentation}
            showTitle
            showThumbnail={asset && !isImage}
          />
          <Controller
            name="instructions"
            control={form.control}
            render={({ field }) => (
              <Instructions {...field} localizations={localizations?.instructions} />
            )}
          />
          <TotalLayoutFooterContainer
            fixed
            style={{ right: 0 }}
            scrollRef={scrollRef}
            width={728}
            rightZone={<Button onClick={onSubmit}>{localizations?.buttons?.save}</Button>}
            leftZone={
              <Button variant="link" onClick={onClose}>
                {localizations?.buttons?.cancel}
              </Button>
            }
          />
        </ContextContainer>
      </Box>
    </FormProvider>
  );
}

AssignmentDrawer.defaultValues = () => ({
  ...evaluationTypes.nonEvaluable,
  metadata: {
    isAsset: true,
  },
});

AssignmentDrawer.propTypes = {
  assignable: PropTypes.object,
  onSave: PropTypes.func,
  value: PropTypes.object,
  scrollRef: PropTypes.object,
  onClose: PropTypes.func,
};
