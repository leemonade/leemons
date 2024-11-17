import React from 'react';
import { find, isEmpty } from 'lodash';
import { Box, Stack, ContextContainer } from '@bubbles-ui/components';
import PropTypes from 'prop-types';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useSession } from '@users/session';
import prefixPN from '../helpers/prefixPN';
import { listCategoriesRequest } from '../request';
import { CardWrapper } from './CardWrapper';
import { AssetForm } from './AssetForm/AssetForm';

function getLocale(session) {
  return session ? session.locale : navigator?.language || 'en';
}

const AssetFormInput = ({
  form,
  children,
  asset,
  file,
  tagsPluginName,
  category: categoryKey,
  preview,
  previewVariant,
  advancedConfig,
  labels,
  placeholders,
  errorMessages,
  ...props
}) => {
  const [category, setCategory] = React.useState(null);
  const [, translations] = useTranslateLoader(prefixPN('assetSetup'));
  const session = useSession();
  const locale = getLocale(session);
  const formValues = form?.watch();

  // ························································
  // LABELS & STATICS

  const formLabels = React.useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const data = items.leebrary.assetSetup.basicData;
      data.labels.title = data.header.presentation;
      return {
        ...data,
        labels: { ...data.labels, ...labels },
        placeholders: { ...data.placeholders, ...placeholders },
        errorMessages: { ...data.errorMessages, ...errorMessages },
      };
    }
    return { labels };
  }, [translations, labels]);

  // ························································
  // DATA PROCESS

  async function loadCategory() {
    const result = await listCategoriesRequest();
    const items = result.map((data) => ({
      ...data,
      icon: data.menuItem.iconSvg,
      name: data.menuItem.label,
    }));
    setCategory(find(items, { key: categoryKey }));
  }

  React.useEffect(() => {
    if (categoryKey) loadCategory();
  }, [categoryKey]);

  // ························································
  // RENDER

  const formComponent = (
    <AssetForm
      {...formLabels}
      {...props}
      asset={{ ...asset, file }}
      type={categoryKey}
      form={form}
      pluginName="leebrary"
      advancedConfig={advancedConfig}
      tagsType={prefixPN('')}
      useTags={!!tagsPluginName}
      hideSubmit
    >
      {children}
    </AssetForm>
  );

  if (preview) {
    return (
      <Box style={{ marginBottom: 16 }}>
        <Stack fullWidth>
          <Box sx={(theme) => ({ width: '100%', paddingRight: theme.spacing[5] })}>
            {formComponent}
          </Box>

          <Box sx={() => ({ minWidth: 264, maxWidth: 264 })} noFlex>
            <ContextContainer title={formLabels?.labels?.preview}>
              <CardWrapper
                isCreationPreview
                item={{ original: formValues }}
                category={category}
                variant={previewVariant}
                locale={locale}
                single
                assetsLoading={!formValues?.name}
              />
            </ContextContainer>
          </Box>
        </Stack>
      </Box>
    );
  }

  return formComponent;
};

AssetFormInput.defaultProps = {
  labels: {},
  previewVariant: 'media',
};
AssetFormInput.propTypes = {
  editing: PropTypes.bool,
  file: PropTypes.instanceOf(Object),
  asset: PropTypes.instanceOf(Object),
  form: PropTypes.any,
  children: PropTypes.node,
  onSubmit: PropTypes.func,
  tagsPluginName: PropTypes.string,
  tagsType: PropTypes.string,
  category: PropTypes.string,
  preview: PropTypes.bool,
  labels: PropTypes.object,
  placeholders: PropTypes.object,
  errorMessages: PropTypes.object,
  previewVariant: PropTypes.string,
  advancedConfig: PropTypes.object,
};

export { AssetFormInput };
export default AssetFormInput;
