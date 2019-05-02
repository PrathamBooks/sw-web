import {
  createAsyncActions,
  runAsyncWorkflow
} from '../lib/reduxHelpers';

import { Book , Image ,  ReadingList , Person, Organisation } from '../api';
import { profileTypes } from '../lib/constants';

export const [
  fetchSearchBooksFilters,
  receiveSearchBooksFilters,
  fetchSearchBooksFiltersError
] = createAsyncActions(
  'SEARCH_BOOKS_FILTERS',
  () => ({}),
  ({ data, sortOptions , downloadType  }) => ({ booksFilters: data, sortOptions , downloadType })
);

export const fetchSearchBooksFiltersWorkflow = () => {
  const fetchPromise = Book.fetchAllFilters();
  
  return runAsyncWorkflow({
    fetch: fetchSearchBooksFilters,
    receive: receiveSearchBooksFilters,
    error: fetchSearchBooksFiltersError
  }, fetchPromise);
};

export const [
  fetchSearchBooks,
  receiveSearchBooks,
  fetchSearchBooksError
] = createAsyncActions(
  'SEARCH_BOOKS',
  ({ page, perPage }) => ({ page, perPage }),
  ({ data, metadata }) => ({ books: data, totalSearchBooksCount: metadata.hits , totalSearchImagesCount: metadata.illustrations_count ,
  totalSearchListsCount: metadata.lists_count,
  totalSearchUsersCount : metadata.users_count , 
  totalSearchOrganisationsCount : metadata.organisation_count
   })
);

export const [
  fetchSearchMoreBooks,
  receiveSearchMoreBooks,
  fetchSearchMoreBooksError
] = createAsyncActions(
  'SEARCH_MORE_BOOKS',
  ({ page, perPage }) => ({ page, perPage }),
  ({ data }) => ({ books: data })
);

export const fetchSearchBooksWorkflow = (appliedFilters, page, perPage) => {
  const fetchingMore = page && page > 1;
  const fetchPromise = Book.fetchAll(appliedFilters, page, perPage);
  
  return runAsyncWorkflow({
    fetch: fetchingMore ? fetchSearchMoreBooks : fetchSearchBooks,
    receive: fetchingMore ? receiveSearchMoreBooks : receiveSearchBooks,
    error: fetchingMore ? fetchSearchMoreBooksError : fetchSearchBooksError
  }, fetchPromise);
};
 
export const [
  fetchSearchImagesFilters,
  receiveSearchImagesFilters,
  fetchSearchImagesFiltersError
] = createAsyncActions(
  'SEARCH_IMAGES_FILTERS',
  () => ({}),
  ({ data, sortOptions }) => ({ imagesFilters: data, sortOptions })
);

export const fetchSearchImagesFiltersWorkflow = () => {
  const fetchPromise = Image.fetchAllFilters();
  
  return runAsyncWorkflow({
    fetch: fetchSearchImagesFilters,
    receive: receiveSearchImagesFilters,
    error: fetchSearchImagesFiltersError
  }, fetchPromise);
};

export const [
  fetchSearchImages,
  receiveSearchImages,
  fetchSearchImagesError
] = createAsyncActions(
  'SEARCH_IMAGES',
  ({ page, perPage }) => ({ page, perPage }),
  ({ data, metadata }) => ({ images: data, totalSearchImagesCount: metadata.hits,
    totalSearchBooksCount: metadata.books_count ,
    totalSearchListsCount: metadata.lists_count,
    totalSearchUsersCount : metadata.users_count , 
    totalSearchOrganisationsCount : metadata.organisation_count
  })
);

export const [
  fetchSearchMoreImages,
  receiveSearchMoreImages,
  fetchSearchMoreImagesError
] = createAsyncActions(
  'SEARCH_MORE_IMAGES',
  ({ page, perPage }) => ({ page, perPage }),
  ({ data }) => ({ images: data })
);

export const fetchSearchImagesWorkflow = (appliedFilters, page, perPage) => {
  const fetchingMore = page && page > 1;
  const fetchPromise = Image.fetchAll(appliedFilters, page, perPage);
  
  return runAsyncWorkflow({
    fetch: fetchingMore ? fetchSearchMoreImages : fetchSearchImages,
    receive: fetchingMore ? receiveSearchMoreImages : receiveSearchImages,
    error: fetchingMore ? fetchSearchMoreImagesError : fetchSearchImagesError
  }, fetchPromise);
};
  
export const [
  fetchSearchReadingListsFilters,
  receiveSearchReadingListsFilters,
  fetchSearchReadingListsFiltersError
] = createAsyncActions(
  'READING_LISTS_FILTERS',
  () => ({}),
  ({ data: { filters, sortOptions } }) => ({ filters, sortOptions })
);

export const fetchSearchReadingListsFiltersWorkflow = () => {
  const fetchPromise = ReadingList.fetchAllFilters();
  
  return runAsyncWorkflow({
    fetch: fetchSearchReadingListsFilters,
    receive: receiveSearchReadingListsFilters,
    error: fetchSearchReadingListsFiltersError
  }, fetchPromise);
};

export const [
  fetchSearchReadingLists,
  receiveSearchReadingLists,
  fetchSearchReadingListsError
] = createAsyncActions(
  'SEARCH_READING_LISTS',
  ({ page, perPage }) => ({ page, perPage }),
  ({ data, metadata }) => ({ lists: data, totalSearchListsCount: metadata.hits,
    totalSearchImagesCount: metadata.illustrations_count ,
    totalSearchBooksCount: metadata.books_count,
    totalSearchUsersCount : metadata.users_count , 
    totalSearchOrganisationsCount : metadata.organisation_count
  })
);

export const [
  fetchSearchMoreReadingLists,
  receiveSearchMoreReadingLists,
  fetchSearchMoreReadingListsError
] = createAsyncActions(
  'SEARCH_MORE_READING_LISTS',
  ({ page, perPage }) => ({ page, perPage }),
  ({ data }) => ({ lists: data })
);

export const fetchSearchReadingListsWorkflow = (appliedFilters, page, perPage) => {
  const fetchingMore = page && page > 1;
  const fetchPromise = ReadingList.search(appliedFilters, page, perPage);
  
  return runAsyncWorkflow({
    fetch: fetchingMore ? fetchSearchMoreReadingLists : fetchSearchReadingLists,
    receive: fetchingMore ? receiveSearchMoreReadingLists : receiveSearchReadingLists,
    error: fetchingMore ? fetchSearchMoreReadingListsError : fetchSearchReadingListsError
  }, fetchPromise);
};

export const [
fetchSearchPeople,
receiveSearchPeople,
fetchSearchPeopleError
] = createAsyncActions(
'SEARCH_PEOPLE',
({ page, perPage }) => ({ page, perPage }),
({ data, metadata }) => ({ people: data, totalSearchUsersCount: metadata.hits,
  totalSearchImagesCount: metadata.illustrations_count ,
  totalSearchBooksCount: metadata.books_count,
  totalSearchListsCount: metadata.lists_count,
  totalSearchOrganisationsCount : metadata.organisation_count
})
);

export const [
fetchSearchMorePeople,
receiveSearchMorePeople,
fetchSearchMorePeopleError
] = createAsyncActions(
'SEARCH_MORE_PEOPLE',
({ page, perPage }) => ({ page, perPage }),
({ data }) => ({ people: data })
);

export const fetchSearchPeopleWorkflow = (variant = profileTypes.USER, appliedFilters, page, perPage) => {
const fetchingMore = page && page > 1;

let fetchPromise;
if (variant === profileTypes.USER) {
  fetchPromise = Person.fetchAll(appliedFilters, page, perPage);
} else if (variant === profileTypes.ORGANISATION) {
  fetchPromise = Organisation.fetchAll(appliedFilters, page, perPage);
}

return runAsyncWorkflow({
  fetch: fetchingMore ? fetchSearchMorePeople : fetchSearchPeople,
  receive: fetchingMore ? receiveSearchMorePeople : receiveSearchPeople,
  error: fetchingMore ? fetchSearchMorePeopleError : fetchSearchPeopleError
}, fetchPromise);
};
