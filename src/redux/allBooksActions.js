import {
  createAsyncActions,
  runAsyncWorkflow
} from '../lib/reduxHelpers';

import { Book } from '../api';


export const [
  fetchAllBooksFilters,
  receiveAllBooksFilters,
  fetchAllBooksFiltersError
] = createAsyncActions(
  'ALL_BOOKS_FILTERS',
  () => ({}),
  ({ data, sortOptions, downloadType }) => ({ filters: data, sortOptions, downloadType })
);

export const fetchAllBooksFiltersWorkflow = () => {
  const fetchPromise = Book.fetchAllFilters();
  
  return runAsyncWorkflow({
    fetch: fetchAllBooksFilters,
    receive: receiveAllBooksFilters,
    error: fetchAllBooksFiltersError
  }, fetchPromise);
};


export const [
  fetchAllBooks,
  receiveAllBooks,
  fetchAllBooksError
] = createAsyncActions(
  'ALL_BOOKS',
  ({ page, perPage }) => ({ page, perPage }),
  ({ data, metadata }) => ({ books: data, totalBooksCount: metadata.hits , totalImagesCount: metadata.illustrations_count ,
  totalListsCount: metadata.lists_count,
  totalUsersCount : metadata.users_count , 
  totalOrganisationsCount : metadata.organisation_count
   })
);

export const [
  fetchMoreAllBooks,
  receiveMoreAllBooks,
  fetchMoreAllBooksError
] = createAsyncActions(
  'MORE_ALL_BOOKS',
  ({ page, perPage }) => ({ page, perPage }),
  ({ data }) => ({ books: data })
);

export const fetchAllBooksWorkflow = (appliedFilters, page, perPage) => {
  const fetchingMore = page && page > 1;
  const fetchPromise = Book.fetchAll(appliedFilters, page, perPage);
  
  return runAsyncWorkflow({
    fetch: fetchingMore ? fetchMoreAllBooks : fetchAllBooks,
    receive: fetchingMore ? receiveMoreAllBooks : receiveAllBooks,
    error: fetchingMore ? fetchMoreAllBooksError : fetchAllBooksError
  }, fetchPromise);
};

export const [
  fetchAllBooksHeaderImage,
  receiveAllBooksHeaderImage,
  fetchAllBooksHeaderImageError
] = createAsyncActions(
  'HEADER_IMAGE_FOR_ALL_BOOKS',
  () => ({}),
  ({ data }) => ({ banner_image: data.bannerImageUrl })
);

export const fetchCategoryHeaderImageWorkflow = (categoryName) => {
  const fetchPromise = Book.fetchCategoryHeaderImage(categoryName);
  
  return runAsyncWorkflow({
    fetch: fetchAllBooksHeaderImage,
    receive: receiveAllBooksHeaderImage,
    error: fetchAllBooksHeaderImageError
  }, fetchPromise);
};

export const [
  fetchConfirmStoryFormat,
  receiveConfirmStoryFormat,
  fetchConfirmStoryFormatError
] = createAsyncActions(
  'CONFIRM_SELECTED_STORY_FORMAT',
  () => ({}),
  ({ data }) => ({ data })
);

export const fetchConfirmStoryFormatWorkflow = (selectedStories) => {
  const fetchPromise = Book.fetchConfirmStoryFormat(selectedStories);
  
  return runAsyncWorkflow({
    fetch: fetchConfirmStoryFormat,
    receive: receiveConfirmStoryFormat,
    error: fetchConfirmStoryFormatError
  }, fetchPromise);
};
