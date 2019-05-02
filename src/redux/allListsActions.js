import {
  createAsyncActions,
  runAsyncWorkflow
} from '../lib/reduxHelpers';
import { createActions } from "redux-actions";
import { ReadingList } from '../api';

export const [
  fetchAllListsFilters,
  receiveAllListsFilters,
  fetchAllListsFiltersError
] = createAsyncActions(
  'ALL_LISTS_FILTERS',
  () => ({}),
  ({ data: { filters, sortOptions } }) => ({ filters, sortOptions })
);

export const fetchAllListsFiltersWorkflow = () => {
  const fetchPromise = ReadingList.fetchAllFilters();
  
  return runAsyncWorkflow({
    fetch: fetchAllListsFilters,
    receive: receiveAllListsFilters,
    error: fetchAllListsFiltersError
  }, fetchPromise);
};

export const [
  fetchAllLists,
  receiveAllLists,
  fetchAllListsError
] = createAsyncActions(
  'ALL_LISTS',
  () => {},
  ({ ok, metadata, data }) => ({ listsInfo: metadata, lists: data })
);

export const fetchAllListsWorkflow = (appliedFilters, page) => {
  
  const fetchPromise = ReadingList.search(appliedFilters, page);

  return runAsyncWorkflow({
    fetch: fetchAllLists,
    receive: receiveAllLists,
    error: fetchAllListsError
  }, fetchPromise);
};

export const { initializeLists } = createActions('INITIALIZE_LISTS');
