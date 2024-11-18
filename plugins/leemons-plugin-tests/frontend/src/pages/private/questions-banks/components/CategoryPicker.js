import { useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';

import {
  InputWrapper,
  ContextContainer,
  Text,
  ActionButton,
  Drawer,
  Box,
  Stack,
  Select,
  TagsInput,
  Button,
  TableInput,
} from '@bubbles-ui/components';
import PropTypes from 'prop-types';

export function CategoryDrawer({ isOpen, onClose, t, categoriesData }) {
  const handleOnSave = () => {
    onClose();
  };

  return (
    <Drawer size="xl" isOpen={isOpen} onClose={onClose}>
      <Drawer.Header title={'🌎 Categorias'} />
      <Drawer.Content>
        {categoriesData?.length === 0 ? <TagsInput /> : <TableInput data={[]} />}
      </Drawer.Content>
      <Drawer.Footer>
        <Box>
          <Button type="button" variant="link" compact onClick={() => onClose()}>
            {t('cancel')}
          </Button>
          <Button onClick={handleOnSave}>{t('save')}</Button>
        </Box>
      </Drawer.Footer>
    </Drawer>
  );
}

CategoryDrawer.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  t: PropTypes.func,
  categoriesData: PropTypes.array,
};

export default function CategoryPicker({ t, categoriesData, control, form }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const noCategories = useMemo(() => categoriesData?.length === 0, [categoriesData]);

  const categoriesForSelect = useMemo(() => {
    return categoriesData.map((category, index) => ({
      value: category.name ?? index,
      label: category.value,
    }));
  }, [categoriesData]);

  return (
    <>
      <ContextContainer fullWidth direction="row">
        <InputWrapper label={t('categoryLabel')}>
          <Stack direction={noCategories ? 'column' : 'row'}>
            <Controller
              control={control}
              name="category"
              render={({ field }) =>
                noCategories ? (
                  <Text>🌎 Aun no hay categorías creadas</Text>
                ) : (
                  <Select
                    {...field}
                    data={categoriesForSelect}
                    onChange={(e) => {
                      const item = categoriesForSelect[e];
                      if (item) {
                        field.onChange(item.value);
                      } else {
                        field.onChange(e);
                      }
                    }}
                    error={form.formState.errors.category}
                    searchable
                    placeholder={t('categoryPlaceholder')}
                  />
                )
              }
            />
            <ActionButton onClick={() => setIsDrawerOpen(true)}>
              🌎 Gestionar categorias
            </ActionButton>
          </Stack>
        </InputWrapper>
      </ContextContainer>

      <CategoryDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} t={t} />
    </>
  );
}

CategoryPicker.propTypes = {
  t: PropTypes.func.isRequired,
  categoriesData: PropTypes.array,
  control: PropTypes.any,
  form: PropTypes.any,
};
