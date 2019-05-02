import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './expandedSearchActions';

const initialState = {
  isFetchingBooksFilters: false,
  booksFilters: null,
  isFetchingSearchBooks: false,
  isFetchingSearchMoreBooks: false,
  books: null,
  bulkDownloadFormatOptions: [],
  isFetchingImagesFilters: false,
  imagesFilters: null,
  isFetchingSearchImages: false,
  isFetchingSearchMoreImages: false,
  images: null,
  isFetchingListsFilters: false,
  filters: null,
  isFetchingSearchLists: false,
  isFetchingSearchMoreLists: false,
  lists: null,
  isFetchingSearchPeople: false,
  isFetchingSearchMorePeople: false,
  people: null,
  totalSearchBooksCount: null,
  totalSearchImagesCount: null,
  totalSearchListsCount: null,
  totalSearchUsersCount : null,
  totalSearchOrganisationsCount: null,
  loadedPages: 0,
  sortOptions: null,
};

export default handleActions({

  [actions.fetchSearchBooksFilters]: (state, action) => u({
    isFetchingBooksFilters: true
  }, state),

  [actions.receiveSearchBooksFilters]: (state, action) => u({
    isFetchingBooksFilters: false,
    booksFilters: action.payload.booksFilters,
    sortOptions: action.payload.sortOptions,
    bulkDownloadFormatOptions: action.payload.downloadType
  }, state),

  [actions.fetchSearchBooks]: (state, action) => u({
    isFetchingSearchBooks: true
  }, state),
  
  [actions.receiveSearchBooks]: (state, action) => u({
    isFetchingSearchBooks: false,
    books: action.payload.books,
    totalSearchBooksCount: action.payload.totalSearchBooksCount,
    totalSearchImagesCount: state.totalSearchImagesCount === null ?action.payload.totalSearchImagesCount : state.totalSearchImagesCount,
    totalSearchListsCount:  state.totalSearchListsCount === null ?action.payload.totalSearchListsCount : state.totalSearchListsCount,
    totalSearchUsersCount : state.totalSearchUsersCount === null ?action.payload.totalSearchUsersCount : state.totalSearchUsersCount ,
    totalSearchOrganisationsCount: state.totalSearchOrganisationsCount === null ?action.payload.totalOrganisationsCount : state.totalSearchOrganisationsCount,
    loadedPages: 1
  }, state),

  [actions.fetchSearchMoreBooks]: (state, action) => u({
    isFetchingSearchMoreBooks: true
  }, state),

  [actions.receiveSearchMoreBooks]: (state, action) => u({
    isFetchingSearchMoreBooks: false,
    books: state.books.concat(action.payload.books),
    loadedPages: state.loadedPages + 1
  }, state),

  [actions.fetchSearchImagesFilters]: (state, action) => u({
    isFetchingImagesFilters: true
  }, state),

  [actions.receiveSearchImagesFilters]: (state, action) => u({
    isFetchingImagesFilters: false,
    imagesFilters: action.payload.imagesFilters,
    sortOptions: action.payload.sortOptions
  }, state),

  [actions.fetchSearchImages]: (state, action) => u({
    isFetchingSearchImages: true
  }, state),
  
  [actions.receiveSearchImages]: (state, action) => u({
    isFetchingSearchImages: false,
    images: action.payload.images,
    totalSearchImagesCount: action.payload.totalSearchImagesCount,
    totalSearchBooksCount: state.totalSearchBooksCount === null ?action.payload.totalSearchBooksCount : state.totalSearchBooksCount,
    totalSearchListsCount: state.totalSearchListsCount === null ? action.payload.totalSearchListsCount :state.totalSearchListsCount,
    totalSearchUsersCount : state.totalSearchUsersCount  === null ?action.payload.totalSearchUsersCount : state.totalSearchUsersCount,
    totalSearchOrganisationsCount: state.totalSearchOrganisationsCount === null ? action.payload.totalSearchOrganisationsCount : state.totalSearchOrganisationsCount,
    loadedPages: 1
  }, state),

  [actions.fetchSearchMoreImages]: (state, action) => u({
    isFetchingSearchMoreImages: true
  }, state),

  [actions.receiveSearchMoreImages]: (state, action) => u({
    isFetchingSearchMoreImages: false,
    images: state.images.concat(action.payload.images),
    loadedPages: state.loadedPages + 1
  }, state),

  [actions.fetchSearchReadingListsFilters]: (state, action) => u({
    isFetchingListsFilters: true
  }, state),

  [actions.receiveSearchReadingListsFilters]: (state, action) => u({
    isFetchingListsFilters: false,
    filters: action.payload.filters,
    sortOptions: action.payload.sortOptions
  }, state),
  
  [actions.fetchSearchReadingLists]: (state, action) => u({
    isFetchingSearchLists: true
  }, state),
  
  [actions.receiveSearchReadingLists]: (state, action) => u({
    isFetchingSearchLists: false,
    lists: action.payload.lists,
    totalSearchListsCount: action.payload.totalSearchListsCount,
    totalSearchImagesCount: state.totalSearchImagesCount === null ? action.payload.totalSearchImagesCount : state.totalSearchImagesCount ,
    totalSearchBooksCount: state.totalSearchBooksCount === null ? action.payload.totalSearchBooksCount : state.totalSearchBooksCount,
    totalSearchUsersCount : state.totalSearchUsersCount === null ?action.payload.totalSearchUsersCount : state.totalSearchUsersCount ,
    totalSearchOrganisationsCount: state.totalSearchOrganisationsCount === null ?  action.payload.totalSearchOrganisationsCount : state.totalSearchOrganisationsCount,
    loadedPages: 1
  }, state),

  [actions.fetchSearchMoreReadingLists]: (state, action) => u({
    isFetchingSearchMoreLists: true
  }, state),

  [actions.receiveSearchMoreReadingLists]: (state, action) => u({
    isFetchingSearchMoreLists: false,
    lists: state.lists.concat(action.payload.lists),
    loadedPages: state.loadedPages + 1
  }, state),

  [actions.fetchSearchPeople]: (state, action) => u({
    isFetchingSearchPeople: true
  }, state),
  
  [actions.receiveSearchPeople]: (state, action) => u({
    isFetchingSearchPeople: false,
    people: action.payload.people,
    totalSearchUsersCount : action.payload.totalSearchUsersCount,
    totalSearchListsCount: state.totalSearchListsCount === null ? action.payload.totalSearchListsCount : state.totalSearchListsCount,
    totalSearchImagesCount: state.totalSearchImagesCount === null ? action.payload.totalSearchImagesCount : state.totalSearchImagesCount ,
    totalSearchBooksCount: state.totalSearchBooksCount === null ? action.payload.totalSearchBooksCount : state.totalSearchBooksCount,
    totalSearchOrganisationsCount: state.totalSearchOrganisationsCount === null ? action.payload.totalSearchOrganisationsCount : state.totalSearchOrganisationsCount,
    loadedPages: 1
  }, state),

  [actions.fetchSearchMorePeople]: (state, action) => u({
    isFetchingSearchMorePeople: true
  }, state),

  [actions.receiveSearchMorePeople]: (state, action) => u({
    isFetchingSearchMorePeople: false,
    people: state.people.concat(action.payload.people),
    loadedPages: state.loadedPages + 1
  }, state),
}, initialState);
