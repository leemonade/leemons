import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import _, { find, isEmpty } from 'lodash';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { Box, LoadingOverlay, Stack } from '@bubbles-ui/components';
import { LibraryNavbar } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { unflatten, useStore } from '@common';
import loadable from '@loadable/component';
import { useIsStudent } from '@academic-portfolio/hooks';
import { listSessionClasses } from '@academic-portfolio/request/classes';
import { getClassImage } from '@academic-portfolio/helpers/getClassImage';
import prefixPN from '../../../helpers/prefixPN';
import { hasPinsRequest, listCategoriesRequest } from '../../../request';
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
  const [store, render] = useStore();
  const { newAsset, category, loading, setAsset, setCategories, categories } =
    useContext(LibraryContext);
  const [, translations] = useTranslateLoader(prefixPN('home'));
  const history = useHistory();
  const isStudent = useIsStudent();
  const [settings, setSettings] = useState({ hasPins: false, loadingPins: true });

  const getCategories = async () => {
    store.subjects = null;
    const promises = [listCategoriesRequest(), hasPinsRequest()];
    if (isStudent) {
      promises.push(listSessionClasses());
    }
    const [result, settingsResult, classes] = await Promise.all(promises);
    if (classes) {
      store.subjects = _.uniqBy(_.map(classes.classes, 'subject'), 'id');
      store.subjects = _.map(store.subjects, (subject) => ({
        ...subject,
        image: typeof subject?.image === 'string' ? subject.image : getClassImage({ subject }),
      }));
    }

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
    if (isStudent !== null) getCategories();
  }, [isStudent]);

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

  function onNavShared() {
    history.push(cleanPath(`${path}/leebrary-shared/list/`));
  }

  function onNavSubject(subject) {
    history.push(cleanPath(`${path}/leebrary-subject/${subject.id}/list/`));
  }

  if (settings.loadingPins) {
    return <LoadingOverlay visible />;
  }

  return (
    <Stack style={{ height: '100vh' }} fullWidth>
      <Box style={{ width: 240, height: '100%' }} skipFlex>
        {!isEmpty(categories) && (
          <LibraryNavbar
            showSharedsWithMe
            labels={navbarLabels}
            categories={categories}
            selectedCategory={category?.id}
            subjects={store.subjects}
            onNavSubject={onNavSubject}
            onNavShared={onNavShared}
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

          <Route path={cleanPath(`${path}/:category/:id/list`)}>
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

  function getSelectedCategory() {
    if (window.location.pathname.includes('leebrary-subject')) {
      return window.location.pathname
        .replace('/private/leebrary/leebrary-subject/', '')
        .replace('/list/', '');
    }
    return category?.id;
  }

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
      if (
        key === 'leebrary-subject' &&
        category?.key !== `leebrary-subject:${getSelectedCategory()}`
      ) {
        setCategory({
          key: `leebrary-subject:${getSelectedCategory()}`,
          id: getSelectedCategory(),
        });
      } else if (key === 'pins' && category?.key !== 'pins') {
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
