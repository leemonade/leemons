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
  TagsInput,
  Button,
  TableInput,
  TextInput,
} from '@bubbles-ui/components';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

export function CategoryDrawer({ isOpen, onClose, t, categoriesData, onCategoriesChange, form }) {
  const { t: tCommon } = useCommonTranslate('formWithTheme');
  const [initialCategories, setInitialCategories] = useState([]);
  const [categories, setCategories] = useState(categoriesData || []);

  const tableConfig = useMemo(
    () => ({
      columns: [
        {
          Header: t('questionCategories.addCategory'),
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
    [tCommon, t]
  );

  const disableSaveButton = useMemo(() => {
    if (!categoriesData?.length) {
      return initialCategories.length === 0;
    }
    return false;
  }, [initialCategories, categoriesData]);

  // HANDLERS ·····························································································|

  const handleOnCancel = () => {
    setCategories([]);
    setInitialCategories([]);
    onClose();
  };

  const handleOnSave = () => {
    if (!categoriesData?.length) {
      if (!categories.length) {
        setCategories(initialCategories.map((category) => ({ value: category, id: uuidv4() })));
      } else {
        onCategoriesChange(categories);
        handleOnCancel();
      }
      return;
    }

    onCategoriesChange(categories);
    handleOnCancel();
  };

  const handleOnChange = (updatedData) => {
    setCategories((prev) => {
      const newEntrance = updatedData.find((item) => !item.id && item.value);

      if (newEntrance) {
        const temporaryId = uuidv4();
        return [...prev, { ...newEntrance, id: temporaryId }];
      }

      return prev.filter((prevItem) =>
        updatedData.some((currentItem) => currentItem.id === prevItem.id)
      );
    });
  };

  return (
    <Drawer size="md" opened={isOpen} onClose={onClose}>
      <Drawer.Header title={t('questionCategories.categoriesLabel')} />
      <Drawer.Content>
        {categories?.length > 0 ? (
          <Stack direction="column">
            <TableInput
              data={categories}
              {...tableConfig}
              resetOnAdd
              sortable={false}
              removable={true}
              editable
              unique
              onChange={handleOnChange}
              canAdd={true}
            />
          </Stack>
        ) : (
          <TagsInput
            label={t('questionCategories.addInitialCategories')}
            onChange={setInitialCategories}
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
                    data={[{ value: '$none$', label: 'None' }, ...categoriesForSelect]}
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
