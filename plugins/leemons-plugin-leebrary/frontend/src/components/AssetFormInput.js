import React from 'react';
import { find, isEmpty } from 'lodash';
import { Box, InputWrapper } from '@bubbles-ui/components';
import PropTypes from 'prop-types';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useSession } from '@users/session';
import { LibraryForm } from './LibraryForm/LibraryForm';
import prefixPN from '../helpers/prefixPN';
import { prepareAsset } from '../helpers/prepareAsset';
import { listCategoriesRequest } from '../request';
import { CardWrapper } from './CardWrapper';

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
}) => {
  const [category, setCategory] = React.useState(null);
  const [, translations] = useTranslateLoader(prefixPN('assetSetup'));
  const session = useSession();
  const locale = getLocale(session);

  // ························································
  // LABELS & STATICS

  const formLabels = React.useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const data = items.plugins.leebrary.assetSetup.basicData;
      data.labels.title = data.header.titleNew;
      return {
        ...data,
        labels: { ...data.labels, ...labels },
        placeholders: { ...data.placeholders, ...placeholders },
        errorMessages: { ...data.errorMessages, ...errorMessages },
      };
    }
    return { labels };
  }, [translations, labels]);

  const preparedAsset = React.useMemo(() => {
    if (asset) {
      return prepareAsset(asset);
    }
    return {};
  }, [asset]);

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
    <LibraryForm
      {...formLabels}
      asset={{ ...asset, file, cover: preparedAsset.cover }}
      type={null}
      form={form}
      pluginName="leebrary"
      advancedConfig={advancedConfig}
      tagsType={prefixPN('')}
      useTags={!!tagsPluginName}
      hideTitle
      hideSubmit
    >
      {children}
    </LibraryForm>
  );

  if (preview) {
    return (
      <Box sx={() => ({ display: 'flex', width: '100%' })}>
        <Box sx={(theme) => ({ width: '100%', paddingRight: theme.spacing[10] })}>
          {formComponent}
        </Box>
        <Box sx={() => ({ minWidth: 288, maxWidth: 288 })}>
          <InputWrapper label={formLabels?.labels?.preview}>
            <CardWrapper
              item={{ original: form?.watch() }}
              category={category}
              variant={previewVariant}
              locale={locale}
              single
            />
            {advancedConfig?.colorToRight || advancedConfig?.fileToRight ? (
              <LibraryForm
                {...formLabels}
                asset={{ ...asset, file, cover: preparedAsset.cover }}
                type={null}
                form={form}
                pluginName="leebrary"
                advancedConfigMode
                advancedConfig={advancedConfig}
                tagsType={prefixPN('')}
                useTags={!!tagsPluginName}
                hideTitle
                hideSubmit
              />
            ) : null}
          </InputWrapper>
        </Box>
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
