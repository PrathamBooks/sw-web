import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './allIllustrationsActions';

const initialState = {
  isFetchingFilters: false,
  filters: null,
  sortOptions: null,
  bulkDownloadFormatOptions: [],
  isFetchingAllIllustrations: false,
  loadedPages: 0,
  illustrations: [],
  illustrationsInfo: { hits: 0, page: null },
  isFirstPage: true
};


export default handleActions({
  [actions.fetchAllIllustrationsFilters]: (state, action) => u({
    isFetchingFilters: true
  }, state),

  [actions.receiveAllIllustrationsFilters]: (state, action) => u({
    isFetchingFilters: false,
    filters: action.payload.filters,
    sortOptions: action.payload.sortOptions,
    bulkDownloadFormatOptions: action.payload.downloadType
  }, state),

  [actions.fetchAllIllustrations]: (state, action) => u({
    isFetchingAllIllustrations: true
  }, state),

  [actions.receiveAllIllustrations]: (state, action) => u({
    isFetchingAllIllustrations: false,
    illustrations: state.illustrations.concat(action.payload.illustrations),
    illustrationsInfo: action.payload.illustrationsInfo,
    loadedPages: state.loadedPages + 1,
    isFirstPage: false
  }, state),

  [actions.fetchAllIllustrationsError]: (state, action) => u({
    isFetchingAllIllustrations: false,
  }, state),

  [actions.initializeIllustrations]: (state, action) => u({
    loadedPages: 0,
    illustrations: [],
    isFirstPage: true
  }, state),

}, initialState);

