import React, { useEffect, useMemo, useState, useContext, useCallback } from 'react';
import { isEmpty, find } from 'lodash';
import { Route, Switch, useRouteMatch, useHistory, Redirect, useParams } from 'react-router-dom';
import { Box, Paper, Stack, Text, SearchInput } from '@bubbles-ui/components';
import { LibraryNavbar } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten, useStore } from '@common';
import loadable from '@loadable/component';
import prefixPN from '../../../helpers/prefixPN';
import { listCategoriesRequest } from '../../../request';
import LibraryContext, { LibraryProvider } from '../../../context/LibraryContext';
import { VIEWS } from './Library.constants';

const NewAssetPage = loadable(() => import('../assets/NewAssetPage'));
const ListAssetPage = loadable(() => import('../assets/ListAssetPage'));

function cleanPath(path) {
  return path.replace('//', '/');
}

const LibraryPageContent = () => {
  const { path } = useRouteMatch();
  const { newAsset, category, setAsset, setCategories, categories } = useContext(LibraryContext);
  const [, translations] = useTranslateLoader(prefixPN('home'));
  const history = useHistory();

  const getCategories = async () => {
    const result = await listCategoriesRequest();
    setCategories(
      result.map((data) => ({
        ...data,
        icon: data.menuItem.iconSvg,
        name: data.menuItem.label,
      }))
    );
  };

  useEffect(() => getCategories(), []);

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
    history.push(cleanPath(`${path}/${data.key}/list`));
  };

  const handleOnNew = (data) => {
    // setCategory(data);
    // history.push(cleanPath(`${path}/${data.key}/new`));
    // console.log(data);
    newAsset(null, data);
  };

  const handleOnFile = (data) => {
    newAsset(data, find(categories, { key: 'media-files' }));
  };

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
            <Box>
              <Paper shadow="none">
                <Text>Editando el asset</Text>
              </Paper>
            </Box>
          </Route>

          {/* LIST ASSETS ························································ */}
          <Route path={cleanPath(`${path}/:category/list`)}>
            <ListAssetPage />
          </Route>

          {/* DEFAULT exact path={path} */}
          <Route>
            <Redirect to={cleanPath(`${path}/media-files/list`)} />
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
      const item = find(categories, { key });
      if (!isEmpty(item) && item.key !== category?.key) {
        setCategory(item);
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
    }),
    [file, category, categories, view, asset]
  );
  return (
    <LibraryProvider value={values}>
      <LibraryPageContent />
    </LibraryProvider>
  );
};

export default LibraryPage;
