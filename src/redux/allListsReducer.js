import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './allListsActions';

const initialState = {
  isFetchingFilters: false,
  filters: null,
  sortOptions: null,
  isFetchingAllLists: false,
  loadedPages: 0,
  lists: [],
  listsInfo: { hits: 0, page: null },
};


export default handleActions({
  [actions.fetchAllListsFilters]: (state, action) => u({
    isFetchingFilters: true
  }, state),

  [actions.receiveAllListsFilters]: (state, action) => u({
    isFetchingFilters: false,
    filters: action.payload.filters,
    sortOptions: action.payload.sortOptions
  }, state),

  [actions.fetchAllLists]: (state, action) => u({
    isFetchingAllLists: true
  }, state),

  [actions.receiveAllLists]: (state, action) => u({
    isFetchingAllLists: false,
    lists: state.lists.concat(action.payload.lists),
    listsInfo: action.payload.listsInfo,
    loadedPages: state.loadedPages + 1,
  }, state),

  [actions.initializeLists]: (state, action) => u({
    loadedPages: 0,
    lists: [],
  }, state),

}, initialState);

