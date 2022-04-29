import React from 'react';
import { find, isEmpty } from 'lodash';
import { Box } from '@bubbles-ui/components';
import PropTypes from 'prop-types';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { LibraryForm } from './LibraryForm/LibraryForm';
import prefixPN from '../helpers/prefixPN';
import { prepareAsset } from '../helpers/prepareAsset';
import { listCategoriesRequest } from '../request';
import { CardWrapper } from './CardWrapper';

const AssetFormInput = ({
  form,
  children,
  asset,
  file,
  tagsPluginName,
  tagsType,
  category: categoryKey,
  preview,
}) => {
  const [category, setCategory] = React.useState(null);
  const [, translations] = useTranslateLoader(prefixPN('assetSetup'));
  const formLabels = React.useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const data = items.plugins.leebrary.assetSetup.basicData;
      data.labels.title = data.header.titleNew;
      return data;
    }
    return {};
  }, [translations]);

  const preparedAsset = React.useMemo(() => {
    if (asset) {
      return prepareAsset(asset);
    }
    return {};
  }, [asset]);

  async function loadCategory() {
    const result = await listCategoriesRequest();
    const items = result.map((data) => ({
      ...data,
      icon: data.menuItem.iconSvg,
      name: data.menuItem.label,
    }));
    setCategory(find(items, { key: categoryKey }));
  }

  function getValuesAsAsset() {
    const values = form.getValues();
    return {
      original: {
        ...values,
      },
    };
  }

  React.useEffect(() => {
    if (categoryKey) loadCategory();
  }, [categoryKey]);

  const formComponent = (
    <LibraryForm
      {...formLabels}
      asset={{ ...asset, file, cover: preparedAsset.cover }}
      type={null}
      form={form}
      pluginName={tagsPluginName}
      tagsType={tagsType}
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
        <Box sx={() => ({ minWidth: '288px', maxWidth: '288px' })}>
          <CardWrapper item={getValuesAsAsset()} category={category} />
        </Box>
      </Box>
    );
  }

  return formComponent;
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
};

export { AssetFormInput };
export default AssetFormInput;
