import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './allBooksActions';

const initialState = {
  isFetchingFilters: false,
  filters: null,
  sortOptions: null,
  bulkDownloadFormatOptions: [],
  isFetchingBooks: false,
  isFetchingMoreBooks: false, // for pagination
  loadedPages: 0,
  books: null,
  totalBooksCount: 0,
  totalImagesCount: 0,
  totalListsCount: 0,
  totalUsersCount : 0,
  totalOrganisationsCount: 0,
  headerImage: '',
  isfetchingConfirmBooksFormat: false
};

export default handleActions({
  [actions.fetchAllBooksFilters]: (state, action) => u({
    isFetchingFilters: true
  }, state),

  [actions.receiveAllBooksFilters]: (state, action) => u({
    isFetchingFilters: false,
    filters: action.payload.filters,
    sortOptions: action.payload.sortOptions,
    bulkDownloadFormatOptions: action.payload.downloadType
  }, state),

  [actions.fetchAllBooks]: (state, action) => u({
    isFetchingBooks: true
  }, state),
  
  [actions.receiveAllBooks]: (state, action) => u({
    isFetchingBooks: false,
    books: action.payload.books,
    totalBooksCount: action.payload.totalBooksCount,
    totalImagesCount: action.payload.totalImagesCount,
    totalListsCount: action.payload.totalListsCount,
    totalUsersCount :action.payload.totalUsersCount,
    totalOrganisationsCount: action.payload.totalOrganisationsCount,
    loadedPages: 1
  }, state),

  [actions.fetchMoreAllBooks]: (state, action) => u({
    isFetchingMoreBooks: true
  }, state),

  [actions.receiveMoreAllBooks]: (state, action) => u({
    isFetchingMoreBooks: false,
    books: state.books.concat(action.payload.books),
    loadedPages: state.loadedPages + 1
  }, state),

  [actions.receiveAllBooksHeaderImage]: (state, action) => u({
    headerImage: action.payload.banner_image
  }, state),

  [actions.fetchConfirmStoryFormat]: (state, action) => u({
    isfetchingConfirmBooksFormat: true
  }, state),

  [actions.receiveConfirmStoryFormat]: (state, action) => u({
    isfetchingConfirmBooksFormat: false
  }, state),
  
}, initialState);
