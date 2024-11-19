import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { getClassImage } from '@academic-portfolio/helpers/getClassImage';
import { useIsStudent } from '@academic-portfolio/hooks';
import { listSessionClasses } from '@academic-portfolio/request/classes';
import { Box, LoadingOverlay, Stack } from '@bubbles-ui/components';
import { unflatten, useStore } from '@common';
import loadable from '@loadable/component';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import _, { find, isEmpty } from 'lodash';

import LibraryContext, { LibraryProvider } from '../../../context/LibraryContext';
import prefixPN from '../../../helpers/prefixPN';
import { hasPinsRequest, listCategoriesRequest } from '../../../request';
import BulkAssetPage from '../assets/BulkAssetPage';

import { VIEWS } from './Library.constants';

import { LibraryNavbar } from '@leebrary/components/LibraryNavbar';

const AssetPage = loadable(() => import('../assets/AssetPage'));
const ListAssetPage = loadable(() => import('../assets/ListAssetPage'));

const CATEGORY_LEEBRARY_SUBJECT = 'leebrary-subject';
const CATEGORY_LEEBRARY_SHARED = 'leebrary-shared';
const CATEGORY_LEEBRARY_RECENT = 'leebrary-recent';

function cleanPath(path) {
  return path.replace('//', '/');
}

const LibraryPageContent = () => {
  const { path } = useRouteMatch();
  const [store] = useStore();
  const { newAsset, category, loading, setAsset, setCategories, categories } =
    useContext(LibraryContext);
  const [, translations] = useTranslateLoader(prefixPN('home'));
  const [t, translationsCategories] = useTranslateLoader(prefixPN('categories'));
  const history = useHistory();
  const isStudent = useIsStudent();
  const [settings, setSettings] = useState({ hasPins: false, loadingPins: true });
  const [hideNavBar, setHideNavBar] = useState(false);

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
      result.map((data) => {
        const pluralName = t(`${data.key}.plural`);
        const singularName = t(`${data.key}.singular`);

        return {
          ...data,
          icon: data.menuItem.iconSvg,
          name: data.menuItem.label,
          pluralName,
          singularName,
          creatable: [1, '1', true, 'true'].includes(data.creatable),
        };
      })
    );

    setSettings({ hasPins: settingsResult.hasPins, loadingPins: false });
  };

  useEffect(() => {
    const pathSegments = history.location.pathname.split('/');
    const editSegment = pathSegments[pathSegments.length - 2];
    const lastSegment = pathSegments[pathSegments.length - 1];

    if (lastSegment === 'new' || editSegment === 'edit' || lastSegment === 'bulk-upload') {
      setAsset(null);
      setHideNavBar(true);
    } else {
      setHideNavBar(false);
    }
  }, [history.location.pathname]);

  useEffect(() => {
    if (isStudent !== null && translationsCategories) {
      getCategories();
    }
  }, [isStudent, translationsCategories]);

  const navbarLabels = useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      return items.leebrary.home.navbar;
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
      {!hideNavBar && (
        <Box style={{ width: 240, height: '100%' }} skipFlex>
          {!isEmpty(categories) && (
            <LibraryNavbar
              showSharedWithMe
              labels={navbarLabels}
              categories={categories}
              selectedCategory={category?.id ? category.id : category?.key}
              subjects={store.subjects}
              onNavSubject={onNavSubject}
              onNavShared={onNavShared}
              onNav={handleOnNav}
              onFile={handleOnFile}
              onNew={handleOnNew}
              loading={loading}
              isStudent={isStudent}
            />
          )}
        </Box>
      )}
      <Box>
        <Switch>
          {/* BULK UPLOAD ASSET ·························································· */}
          <Route path={cleanPath(`${path}/:category/bulk-upload`)}>
            <BulkAssetPage />
          </Route>

          {/* NEW ASSET ·························································· */}
          <Route path={cleanPath(`${path}/:category/new`)}>
            <AssetPage />
          </Route>

          {/* EDIT ASSET ·························································· */}
          <Route path={cleanPath(`${path}/edit/:id`)}>
            <AssetPage />
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
            <Redirect to={cleanPath(`${path}/leebrary-recent/list`)} />
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
    if (window.location.pathname.includes(CATEGORY_LEEBRARY_SUBJECT)) {
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

  const newBulkUpload = (data, categoryItem) => {
    setFile(data);
    setCategory(categoryItem);
    setView(VIEWS.BULK_UPLOAD);
    history.push(`${path}/${categoryItem.key}/bulk-upload`.replace('//', '/'));
  };

  const selectCategory = useCallback(
    (key) => {
      if (
        key === CATEGORY_LEEBRARY_SUBJECT &&
        category?.key !== `leebrary-subject:${getSelectedCategory()}`
      ) {
        setCategory({
          key: `leebrary-subject:${getSelectedCategory()}`,
          id: getSelectedCategory(),
        });
      } else if (key === 'pins' && category?.key !== 'pins') {
        setCategory({ key: 'pins', id: null });
      } else if (key === CATEGORY_LEEBRARY_SHARED && category?.key !== CATEGORY_LEEBRARY_SHARED) {
        setCategory({ key: CATEGORY_LEEBRARY_SHARED, id: null });
      } else if (key === CATEGORY_LEEBRARY_RECENT && category?.key !== CATEGORY_LEEBRARY_RECENT) {
        setCategory({ key: CATEGORY_LEEBRARY_RECENT, id: null });
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
      newBulkUpload,
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
