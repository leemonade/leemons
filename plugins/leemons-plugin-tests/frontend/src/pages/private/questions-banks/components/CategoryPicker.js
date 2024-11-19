import { useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';

import {
  InputWrapper,
  ContextContainer,
  Text,
  Drawer,
  Box,
  Stack,
  Select,
  Button,
  TableInput,
  TextInput,
} from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import CommaSeparatedInput from '@tests/components/CommaSeparatedInput';

export function CategoryDrawer({ isOpen, onClose, t, categoriesData, onCategoriesChange }) {
  const { t: tCommon } = useCommonTranslate('formWithTheme');
  const [categories, setCategories] = useState(categoriesData || []);
  const [isAdding, setIsAdding] = useState(false);

  const tableConfig = useMemo(
    () => ({
      columns: [
        {
          accessor: 'value',
          editable: true,
          removable: true,
          input: {
            node: <TextInput />,
          },
        },
      ],
      labels: {
        add: tCommon('add'),
        remove: tCommon('remove'),
        edit: tCommon('edit'),
        accept: tCommon('accept'),
        cancel: tCommon('cancel'),
      },
    }),
    [tCommon]
  );

  const disableSaveButton = useMemo(() => {
    if (!categoriesData?.length) {
      return categories.length === 0;
    }
    return false;
  }, [categoriesData, categories]);

  // HANDLERS ·····························································································|

  const handleOnCancel = () => {
    setCategories([]);
    onClose();
  };

  const handleOnSave = (initialCats) => {
    if (!categoriesData?.length) {
      if (!categories.length) {
        setCategories(initialCats.map((category) => ({ value: category, id: uuidv4() })));
      } else {
        onCategoriesChange(categories);
        handleOnCancel();
      }
      return;
    }

    onCategoriesChange(categories);
    handleOnCancel();
  };

  const addNewCategoriesToList = (newCategories) => {
    setCategories((prev) => {
      const uniqueNewCategories = newCategories.filter(
        (newCat) => !prev.some((existingCat) => existingCat.value === newCat)
      );
      return [
        ...prev,
        ...uniqueNewCategories.map((category) => ({ value: category, id: uuidv4() })),
      ];
    });
    setIsAdding(false);
  };

  const handleOnChange = (updatedCategories, event) => {
    if (event.type === 'edit') {
      setCategories((prev) => {
        const usedValue = prev.find(({ value }) => value === event.newItem.value);
        if (usedValue) return [...prev];

        return updatedCategories;
      });
      return;
    }

    setCategories(updatedCategories);
  };

  return (
    <Drawer size="md" opened={isOpen} onClose={onClose}>
      <Drawer.Header title={t('questionCategories.categoriesLabel')} />
      <Drawer.Content>
        {categories?.length > 0 ? (
          <Stack direction="column">
            {isAdding ? (
              <CommaSeparatedInput
                label={t('questionCategories.newCategory')}
                onAdd={addNewCategoriesToList}
                unique
              />
            ) : (
              <Box>
                <Button
                  variant="link"
                  onClick={() => setIsAdding(true)}
                  leftIcon={<AddCircleIcon width={24} height={24} />}
                >
                  {t('questionCategories.addCategory')}
                </Button>
              </Box>
            )}
            <TableInput
              data={categories}
              {...tableConfig}
              sortable={false}
              removable={true}
              editable
              onChange={handleOnChange}
              showHeaders={false}
            />
          </Stack>
        ) : (
          <CommaSeparatedInput
            label={t('questionCategories.addCategoriesSeperatedByComma')}
            onAdd={handleOnSave}
            useTextArea
            unique
          />
        )}
      </Drawer.Content>
      <Drawer.Footer>
        <Stack fullWidth justifyContent="space-between">
          <Button type="button" variant="link" onClick={handleOnCancel}>
            {tCommon('cancel')}
          </Button>
          <Button onClick={handleOnSave} disabled={disableSaveButton}>
            {tCommon('save')}
          </Button>
        </Stack>
      </Drawer.Footer>
    </Drawer>
  );
}

CategoryDrawer.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  t: PropTypes.func,
  categoriesData: PropTypes.array,
  onCategoriesChange: PropTypes.func,
  form: PropTypes.any,
};

export default function CategoryPicker({ t, categoriesData, control, form, onCategoriesChange }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const noCategories = useMemo(() => !categoriesData?.length, [categoriesData]);

  const categoriesForSelect = useMemo(
    () =>
      categoriesData?.map((category) => ({
        value: category.id,
        label: category.value,
      })),
    [categoriesData]
  );

  // HANDLERS ·····························································································|

  return (
    <>
      <ContextContainer fullWidth direction="row">
        <InputWrapper label={t('questionCategories.categoryLabel')}>
          <Stack
            direction={noCategories ? 'column' : 'row'}
            justifyContent="start"
            alignItems={!noCategories && 'center'}
            spacing={2}
          >
            <Controller
              control={control}
              name="category"
              render={({ field }) =>
                noCategories ? (
                  <Text>{t('questionCategories.noCategories')}</Text>
                ) : (
                  <Select
                    {...field}
                    data={[
                      { value: '$none$', label: t('questionCategories.none') },
                      ...categoriesForSelect,
                    ]}
                    cleanOnMissingValue
                    onChange={(e) => {
                      if (e === '$none$') {
                        field.onChange(null);
                        return;
                      }
                      field.onChange(e);
                    }}
                    error={form.formState.errors.category}
                    placeholder={t('questionCategories.selectPlaceholder')}
                  />
                )
              }
            />
            <Box>
              <Button variant="linkInline" onClick={() => setIsDrawerOpen(true)}>
                {t('questionCategories.manageCategories')}
              </Button>
            </Box>
          </Stack>
        </InputWrapper>
      </ContextContainer>

      <CategoryDrawer
        key={renderKey}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setRenderKey((prev) => prev + 1); // Force component remount
        }}
        t={t}
        categoriesData={categoriesData}
        onCategoriesChange={onCategoriesChange}
        form={form}
      />
    </>
  );
}

CategoryPicker.propTypes = {
  t: PropTypes.func.isRequired,
  categoriesData: PropTypes.array,
  control: PropTypes.any,
  form: PropTypes.any,
  onCategoriesChange: PropTypes.func,
};
