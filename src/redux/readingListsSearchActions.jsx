import {
    createAsyncActions,
    runAsyncWorkflow
  } from '../lib/reduxHelpers';
  
  import { ReadingList } from '../api';
  
  
  export const [
    fetchReadingListsFilters,
    receiveReadingListsFilters,
    fetchReadingListsFiltersError
  ] = createAsyncActions(
    'READING_LISTS_FILTERS',
    () => ({}),
    ({ data: { filters, sortOptions } }) => ({ filters, sortOptions })
  );
  
  export const fetchReadingListsFiltersWorkflow = () => {
    const fetchPromise = ReadingList.fetchAllFilters();
    
    return runAsyncWorkflow({
      fetch: fetchReadingListsFilters,
      receive: receiveReadingListsFilters,
      error: fetchReadingListsFiltersError
    }, fetchPromise);
  };
  
  
  export const [
    fetchReadingLists,
    receiveReadingLists,
    fetchReadingListsError
  ] = createAsyncActions(
    'READING_LISTS',
    ({ page, perPage }) => ({ page, perPage }),
    ({ data, metadata }) => ({ lists: data, totalListsCount: metadata.hits })
  );
  
  export const [
    fetchMoreReadingLists,
    receiveMoreReadingLists,
    fetchMoreReadingListsError
  ] = createAsyncActions(
    'MORE_READING_LISTS',
    ({ page, perPage }) => ({ page, perPage }),
    ({ data }) => ({ lists: data })
  );
  
  export const fetchReadingListsWorkflow = (appliedFilters, page, perPage) => {
    const fetchingMore = page && page > 1;
    const fetchPromise = ReadingList.search(appliedFilters, page, perPage);
    
    return runAsyncWorkflow({
      fetch: fetchingMore ? fetchMoreReadingLists : fetchReadingLists,
      receive: fetchingMore ? receiveMoreReadingLists : receiveReadingLists,
      error: fetchingMore ? fetchMoreReadingListsError : fetchReadingListsError
    }, fetchPromise);
  };
