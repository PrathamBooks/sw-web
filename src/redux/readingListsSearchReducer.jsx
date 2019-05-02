import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './readingListsSearchActions';

const initialState = {
  isFetchingFilters: false,
  filters: null,
  sortOptions: null,
  isFetchingLists: false,
  isFetchingMoreLists: false, // for pagination
  loadedPages: 0,
  lists: null,
  totalListsCount: 0,
};

export default handleActions({
  [actions.fetchReadingListsFilters]: (state, action) => u({
    isFetchingFilters: true
  }, state),

  [actions.receiveReadingListsFilters]: (state, action) => u({
    isFetchingFilters: false,
    filters: action.payload.filters,
    sortOptions: action.payload.sortOptions
  }, state),

  [actions.fetchReadingLists]: (state, action) => u({
    isFetchingLists: true
  }, state),
  
  [actions.receiveReadingLists]: (state, action) => u({
    isFetchingLists: false,
    lists: action.payload.lists,
    totalListsCount: action.payload.totalListsCount,
    loadedPages: 1
  }, state),

  [actions.fetchMoreReadingLists]: (state, action) => u({
    isFetchingMoreLists: true
  }, state),

  [actions.receiveMoreReadingLists]: (state, action) => u({
    isFetchingMoreLists: false,
    lists: state.lists.concat(action.payload.lists),
    loadedPages: state.loadedPages + 1
  }, state),
}, initialState);
