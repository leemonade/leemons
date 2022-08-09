import React, { useEffect, useMemo, useState, useContext, useCallback } from 'react';
import { isEmpty, find } from 'lodash';
import { Route, Switch, useRouteMatch, useHistory, Redirect } from 'react-router-dom';
import { Box, Stack, LoadingOverlay } from '@bubbles-ui/components';
import { LibraryNavbar } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten } from '@common';
import loadable from '@loadable/component';
import prefixPN from '../../../helpers/prefixPN';
import { listCategoriesRequest, hasPinsRequest } from '../../../request';
import LibraryContext, { LibraryProvider } from '../../../context/LibraryContext';
import { VIEWS } from './Library.constants';

const NewAssetPage = loadable(() => import('../assets/NewAssetPage'));
const EditAssetPage = loadable(() => import('../assets/EditAssetPage'));
const ListAssetPage = loadable(() => import('../assets/ListAssetPage'));

function cleanPath(path) {
  return path.replace('//', '/');
}

const LibraryPageContent = () => {
  const { path } = useRouteMatch();
  const { newAsset, category, loading, setAsset, setCategories, categories } =
    useContext(LibraryContext);
  const [, translations] = useTranslateLoader(prefixPN('home'));
  const history = useHistory();
  const [settings, setSettings] = useState({ hasPins: false, loadingPins: true });

  const getCategories = async () => {
    const [result, settingsResult] = await Promise.all([listCategoriesRequest(), hasPinsRequest()]);
    setCategories(
      result.map((data) => ({
        ...data,
        icon: data.menuItem.iconSvg,
        name: data.menuItem.label,
        creatable: [1, '1', true, 'true'].includes(data.creatable),
      }))
    );

    setSettings({ hasPins: settingsResult.hasPins, loadingPins: false });
  };

  useEffect(() => {
    getCategories();
  }, []);

  const navbarLabels = useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      const data = items.plugins.leebrary.home.navbar;
      return data;
    }
    return {};
  }, [translations]);

  const handleOnNav = (data) => {
    setAsset(null);
    if (data) {
      history.push(cleanPath(`${path}/${data.key}/list`));
    } else {
      history.push(cleanPath(`${path}/pins/list`));
    }
  };

  const handleOnNew = (item) => {
    if (!isEmpty(item?.createUrl)) {
      const newURL = new URL(item.createUrl, window?.location);
      newURL.searchParams.set('from', 'leebrary');
      history.push(newURL.href.substring(newURL.origin.length));
    } else {
      newAsset(null, item);
    }
  };

  const handleOnFile = (data) => {
    newAsset(data, find(categories, { key: 'media-files' }));
  };

  if (settings.loadingPins) {
    return <LoadingOverlay visible />;
  }

  return (
    <Stack style={{ height: '100vh' }} fullWidth>
      <Box style={{ width: 240, height: '100%' }} skipFlex>
        {!isEmpty(categories) && (
          <LibraryNavbar
            labels={navbarLabels}
            categories={categories}
            selectedCategory={category?.id}
            onNav={handleOnNav}
            onFile={handleOnFile}
            onNew={handleOnNew}
            loading={loading}
          />
        )}
      </Box>
      <Box style={{ overflowY: 'scroll' }}>
        <Switch>
          {/* NEW ASSET ·························································· */}
          <Route path={cleanPath(`${path}/:category/new`)}>
            <NewAssetPage />
          </Route>

          {/* EDIT ASSET ·························································· */}
          <Route path={cleanPath(`${path}/edit/:id`)}>
            <EditAssetPage />
          </Route>

          {/* LIST ASSETS ························································ */}
          <Route path={cleanPath(`${path}/:category/list`)}>
            <ListAssetPage />
          </Route>

          {/* DEFAULT exact path={path} */}
          <Route>
            <Redirect to={cleanPath(`${path}/${settings.hasPins ? 'pins' : 'media-files'}/list`)} />
          </Route>
        </Switch>
      </Box>
    </Stack>
  );
};

const LibraryPage = () => {
  const [file, setFile] = useState(null);
  const [asset, setAsset] = useState(null);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState(VIEWS.LIST);
  const { path } = useRouteMatch();
  const history = useHistory();

  const editAsset = (data) => {
    setAsset(data);
    setView(VIEWS.EDIT);
    history.push(`${path}/edit/${data?.id}`.replace('//', '/'));
  };

  const newAsset = (data, categoryItem) => {
    setFile(data);
    setCategory(categoryItem);
    setView(VIEWS.NEW);
    history.push(`${path}/${categoryItem.key}/new`.replace('//', '/'));
  };

  const selectCategory = useCallback(
    (key) => {
      if (key === 'pins' && category?.key !== 'pins') {
        setCategory({ key: 'pins', id: null });
      } else {
        const item = find(categories, { key });
        if (!isEmpty(item) && item.key !== category?.key) {
          setCategory(item);
        }
      }
    },
    [category, categories]
  );

  const values = useMemo(
    () => ({
      asset,
      setAsset,
      file,
      setFile,
      category,
      setCategory,
      categories,
      setCategories,
      view,
      setView,
      newAsset,
      editAsset,
      selectCategory,
      loading,
      setLoading,
    }),
    [file, category, categories, view, asset, loading]
  );
  return (
    <LibraryProvider value={values}>
      <LibraryPageContent />
    </LibraryProvider>
  );
};

export default LibraryPage;
