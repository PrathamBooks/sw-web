import {
  createAsyncActions,
  runAsyncWorkflow
} from '../lib/reduxHelpers';
import { createActions } from "redux-actions";
import { Illustration } from '../api';


export const [
  fetchAllIllustrationsFilters,
  receiveAllIllustrationsFilters,
  fetchAllIllustrationsFiltersError
] = createAsyncActions(
  'ALL_ILLUSTRATIONS_FILTERS',
  () => ({}),
  ({ data, sortOptions, downloadType }) => ({ filters: data, sortOptions, downloadType })
);

export const fetchAllIllustrationsFiltersWorkflow = () => {
  const fetchPromise = Illustration.fetchAllFilters();
  
  return runAsyncWorkflow({
    fetch: fetchAllIllustrationsFilters,
    receive: receiveAllIllustrationsFilters,
    error: fetchAllIllustrationsFiltersError
  }, fetchPromise);
};


export const [
  fetchAllIllustrations,
  receiveAllIllustrations,
  fetchAllIllustrationsError
] = createAsyncActions(
  'ALL_ILLUSTRATIONS',
  () => {},
  ({ ok, metadata, data }) => ({ illustrationsInfo: metadata, illustrations: data })
);

export const fetchAllIllustrationsWorkflow = (appliedFilters, page) => {
  const fetchPromise = Illustration.fetchAllIllustrations(appliedFilters, page);

  return runAsyncWorkflow({
    fetch: fetchAllIllustrations,
    receive: receiveAllIllustrations,
    error: fetchAllIllustrationsError
  }, fetchPromise);
};

export const { initializeIllustrations } = createActions('INITIALIZE_ILLUSTRATIONS');

