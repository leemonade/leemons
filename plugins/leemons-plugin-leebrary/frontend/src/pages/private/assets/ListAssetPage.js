import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { isEmpty } from 'lodash';

import { useIsStudent, useIsTeacher } from '@academic-portfolio/hooks';
import useAcademicFiltersForAssetList from '@assignables/hooks/useAcademicFiltersForAssetList';

import { AssetList } from '@leebrary/components';
import loadMediaTypes from '@leebrary/helpers/loadMediaTypes';
import LibraryContext from '../../../context/LibraryContext';

// HELPERS

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const ListAssetPage = () => {
  const { categories, asset, setAsset, category, selectCategory } = useContext(LibraryContext);
  const params = useParams();
  const urlQuery = useQuery();
  const history = useHistory();
  const location = useLocation();
  const isStudent = useIsStudent();
  const isTeacher = useIsTeacher();
  const academicFilters = useAcademicFiltersForAssetList({ useLabels: false });

  const [searchCriteria, setSearchCriteria] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [mediaTypesArray, setMediaTypesArray] = useState([]);

  // --------------------------------------------------------------------------------------------
  // EFFECTS

  // Set the context category when the url changes according to the URL category param
  useEffect(() => {
    const currentCategoryName = category?.key.startsWith('leebrary-subject')
      ? 'leebrary-subject'
      : category?.key;

    let navigateFromOneSubjectToAnother = false;
    if (currentCategoryName === 'leebrary-subject' && currentCategoryName === params?.category) {
      const urlSegments = location.pathname.split('/');
      const categoryIndex = urlSegments.findIndex((segment) => segment === params.category);
      const segmentAfterCategory = urlSegments[categoryIndex + 1] || null;
      navigateFromOneSubjectToAnother =
        category?.key.replace('leebrary-subject:', '') !== segmentAfterCategory;
    }
    if (
      !isEmpty(params?.category) &&
      (currentCategoryName !== params?.category || navigateFromOneSubjectToAnother)
    ) {
      selectCategory(params?.category);
      if (category) {
        setAsset(null);
      }
    }
  }, [params, category]);

  // Get the media types for media assets
  useEffect(() => {
    if (category?.key === 'media-files') {
      loadMediaTypes(category?.id).then((types) => {
        setMediaTypesArray([...types]);
      });
    }
  }, [category?.id, category?.key]);

  // Set the states passed to AssetList to serve as parameters for the request according to the URL query params
  useEffect(() => {
    setAsset(urlQuery.get('open'));
    setSearchCriteria(urlQuery.get('search'));
    setStatusFilter(urlQuery.get('status') || 'all');
    setMediaTypeFilter(urlQuery.get('media-type') || 'all');
    setCategoryFilter(urlQuery.get('category-filter') || 'all');
  }, [urlQuery]);

  const manageQueryParams = ({
    searchCriteriaToFilterBy,
    categoryToFilterBy,
    mediaTypeToFilterBy,
    statusToFilterBy,
    assetToOpenId,
  }) => {
    const search = urlQuery.get('search');
    const _categoryFilter = urlQuery.get('category-filter');
    const mediaType = urlQuery.get('media-type');
    const status = urlQuery.get('status');
    const open = urlQuery.get('open');
    const result = [];

    // Get current params and keep them in the url in order to combine filters
    if (search && typeof searchCriteriaToFilterBy !== 'string') result.push(`search=${search}`);
    if (_categoryFilter && !categoryToFilterBy) result.push(`category-filter=${_categoryFilter}`);
    if (mediaType && !mediaTypeToFilterBy) result.push(`media-type=${mediaType}`);
    if (status && !statusToFilterBy) result.push(`status=${status}`);
    if (open && !assetToOpenId) result.push(`open=${open}`);

    // Add new params or modify existent ones.
    if (searchCriteriaToFilterBy) result.push(`search=${searchCriteriaToFilterBy}`);
    if (categoryToFilterBy) result.push(`category-filter=${categoryToFilterBy}`);
    if (mediaTypeToFilterBy) result.push(`media-type=${mediaTypeToFilterBy}`);
    if (statusToFilterBy) result.push(`status=${statusToFilterBy}`);
    if (assetToOpenId && assetToOpenId !== 'forgetAsset') result.push(`open=${assetToOpenId}`);

    return result.join('&');
  };

  // --------------------------------------------------------------------------------------------
  // HANDLERS

  const handleOnEditItem = (item) => {
    history.push(`/private/leebrary/edit/${item.id}`);
  };

  // This filter is only appliable to multi-category sections (recent, favs, shared)
  const handleCategoryFilterChange = (categoryToFilterBy) => {
    setCategoryFilter(categoryToFilterBy);
    history.push(`${location.pathname}?${manageQueryParams({ categoryToFilterBy })}`);
  };

  const handleStatusChange = (statusToFilterBy) => {
    setStatusFilter(statusToFilterBy);
    history.push(`${location.pathname}?${manageQueryParams({ statusToFilterBy })}`);
  };

  const handleSearchByCriteria = (searchCriteriaToFilterBy) => {
    setSearchCriteria(searchCriteriaToFilterBy);
    history.push(`${location.pathname}?${manageQueryParams({ searchCriteriaToFilterBy })}`);
  };

  const handleMediaTypeChange = (mediaTypeToFilterBy) => {
    setMediaTypeFilter(mediaTypeToFilterBy);
    history.push(`${location.pathname}?${manageQueryParams({ mediaTypeToFilterBy })}`);
  };

  const handleOnSelectItem = (item) => {
    setAsset(item);
    history.push(`${location.pathname}?${manageQueryParams({ assetToOpenId: item.id })}`);
  };

  const handleUnselectItem = () => {
    history.push(`${location.pathname}?${manageQueryParams({ assetToOpenId: 'forgetAsset' })}`);
  };

  // --------------------------------------------------------------------------------------------
  // SET ASSET LIST PROPS ACCORDING TO TYPE OF CATEGORY

  const propsAndFiltersByCategory = useMemo(() => {
    let props = {};
    const contentAssignables = ['assignables.scorm', 'assignables.content-creator'];
    const isMultiCategorySection = ['pins', 'leebrary-shared', 'leebrary-recent'].includes(
      category?.key
    );
    const isAssignable = category?.key?.startsWith('assignables.');
    const isContentAssignable = contentAssignables.includes(category?.key);

    // ACADEMIC FILTERS
    if (
      ((isMultiCategorySection && category?.key !== 'leebrary-shared') ||
        (isAssignable && !isContentAssignable)) &&
      isTeacher
    ) {
      props = academicFilters;
      props.allowAcademicFilter = true;
    }
    if ((isStudent && category?.key === 'pins') || (isAssignable && !isContentAssignable)) {
      props = academicFilters;
      props.allowAcademicFilter = true;
    }

    // STATUS FILTER
    if (
      (isAssignable ||
        category?.key === 'tests-questions-banks' ||
        ['leebrary-recent', 'pins'].includes(category?.key)) &&
      category?.key !== 'assignables.scorm' &&
      !isStudent
    ) {
      props.allowStatusFilter = true;
      props.statusFilter = statusFilter;
      props.onStatusChange = handleStatusChange;
    }

    // CATEGORY FILTER (not implemented in 'Shared with me' section yet)
    if (isMultiCategorySection && category?.key !== 'leebrary-shared') {
      props.allowCategoryFilter = true;
      props.categoryFilter = categoryFilter;
      props.onCategoryFilter = handleCategoryFilterChange;
    }

    // MEDIA TYPE FILTER
    if (category?.key === 'media-files') {
      props.allowMediaTypeFilter = true;
      props.mediaTypes = mediaTypesArray;
      props.mediaTypeFilter = mediaTypeFilter;
      props.onMediaTypeChange = handleMediaTypeChange;
    }

    // DON'T SEARCH IN PROVIDER PROP
    if ((category?.key === 'media-files' || category?.key === 'bookmarks') && isTeacher) {
      props.searchInProvider = false;
    }

    return props;
  }, [
    category,
    isTeacher,
    isStudent,
    statusFilter,
    categoryFilter,
    mediaTypeFilter,
    academicFilters,
  ]);

  return (
    <div>
      <AssetList
        {...propsAndFiltersByCategory}
        category={category}
        categories={categories}
        asset={asset}
        onSelect={handleOnSelectItem}
        allowSearchByCriteria
        searchCriteria={searchCriteria}
        onSearch={handleSearchByCriteria}
        onEditItem={handleOnEditItem}
        forgetAssetToOpen={handleUnselectItem}
      />
    </div>
  );
};

export { ListAssetPage };
export default ListAssetPage;
