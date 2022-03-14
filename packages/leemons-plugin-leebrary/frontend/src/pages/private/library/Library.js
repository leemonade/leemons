import React, { useEffect, useMemo, useState, useContext } from 'react';
import { isEmpty } from 'lodash';
import { Route, Switch, useRouteMatch, useHistory } from 'react-router-dom';
import { Box, Paper, Stack, Text, SearchInput } from '@bubbles-ui/components';
import { LibraryNavbar } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten, useStore } from '@common';
import prefixPN from '../../../helpers/prefixPN';
import { listCategoriesRequest } from '../../../request';
import LibraryContext, { LibraryProvider } from '../../../context/LibraryContext';
import { VIEWS } from './Library.constants';
import loadable from '@loadable/component';

const NewAssetPage = loadable(() => import('../assets/NewAsset'));

const LibraryPageContent = () => {
  const { path } = useRouteMatch();
  const { newAsset } = useContext(LibraryContext);
  const [, translations] = useTranslateLoader(prefixPN('home'));
  const [store, render] = useStore({ category: null, categories: [] });

  const getCategories = async () => {
    const categories = await listCategoriesRequest();
    store.categories = categories.map((category) => ({
      ...category,
      icon: category.menuItem.iconSvg,
      name: category.menuItem.label,
      creatable: true,
    }));
    render();
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
    store.category = data;
    render();
  };

  const handleOnFile = (data) => {
    newAsset(data);
  };

  return (
    <Stack style={{ height: '100vh' }} fullWidth>
      <Box style={{ width: 240, height: '100%' }} skipFlex>
        {!isEmpty(store.categories) && (
          <LibraryNavbar
            labels={navbarLabels}
            categories={store.categories}
            selectedCategory={store.category?.id}
            onNav={handleOnNav}
            onFile={handleOnFile}
          />
        )}
      </Box>
      <Box style={{ overflowY: 'scroll' }}>
        <Switch>
          <Route exact path={path}>
            <Stack direction="column" fullHeight>
              <Paper shadow="none" skipFlex>
                <SearchInput variant="filled" />
              </Paper>
              <Box>
                <Stack fullWidth>
                  <Paper shadow="none">
                    <Text>Hola</Text>
                  </Paper>
                </Stack>
              </Box>
            </Stack>
          </Route>
          <Route path={`${path}/new`.replace('//', '/')}>
            <NewAssetPage />
          </Route>
          <Route path={`${path}/edit/:id`.replace('//', '/')}>
            <Box>
              <Paper shadow="none">
                <Text>Editando el asset</Text>
              </Paper>
            </Box>
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
  const [view, setView] = useState(VIEWS.LIST);
  const { path } = useRouteMatch();
  const history = useHistory();

  const editAsset = (data) => {
    setAsset(data);
    setView(VIEWS.EDIT);
    history.push(`${path}/edit/${data?.id}`.replace('//', '/'));
  };

  const newAsset = (data) => {
    setFile(data);
    setView(VIEWS.NEW);
    history.push(`${path}/new`.replace('//', '/'));
  };

  const values = useMemo(
    () => ({
      asset,
      setAsset,
      file,
      setFile,
      category,
      setCategory,
      view,
      setView,
      newAsset,
      editAsset,
    }),
    [file, category]
  );
  return (
    <LibraryProvider value={values}>
      <LibraryPageContent />
    </LibraryProvider>
  );
};

export default LibraryPage;
