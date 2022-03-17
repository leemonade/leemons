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

const LibraryPageContent = () => {
  const { path } = useRouteMatch();
  const { newAsset, category, setCategory, setCategories, categories } = useContext(LibraryContext);
  const [, translations] = useTranslateLoader(prefixPN('home'));

  const getCategories = async () => {
    const result = await listCategoriesRequest();
    setCategories(
      result.map((data) => ({
        ...data,
        icon: data.menuItem.iconSvg,
        name: data.menuItem.label,
        creatable: true,
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
    setCategory(data);
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
          <Route path={`${path}/:category/new`.replace('//', '/')}>
            <NewAssetPage />
          </Route>
          <Route path={`${path}/edit/:id`.replace('//', '/')}>
            <Box>
              <Paper shadow="none">
                <Text>Editando el asset</Text>
              </Paper>
            </Box>
          </Route>
          <Route>
            <Redirect to={path} />
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
