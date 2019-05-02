import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './imagesSearchActions';

const initialState = {
  isFetchingFilters: false,
  filters: null,
  sortOptions: null,
  isFetchingImages: false,
  isFetchingMoreImages: false, // for pagination
  loadedPages: 0,
  images: null,
  totalImagesCount: 0,
};

export default handleActions({
  [actions.fetchImagesFilters]: (state, action) => u({
    isFetchingFilters: true
  }, state),

  [actions.receiveImagesFilters]: (state, action) => u({
    isFetchingFilters: false,
    filters: action.payload.filters,
    sortOptions: action.payload.sortOptions
  }, state),

  [actions.fetchImages]: (state, action) => u({
    isFetchingImages: true
  }, state),
  
  [actions.receiveImages]: (state, action) => u({
    isFetchingImages: false,
    images: action.payload.images,
    totalImagesCount: action.payload.totalImagesCount,
    loadedPages: 1
  }, state),

  [actions.fetchMoreImages]: (state, action) => u({
    isFetchingMoreImages: true
  }, state),

  [actions.receiveMoreImages]: (state, action) => u({
    isFetchingMoreImages: false,
    images: state.images.concat(action.payload.images),
    loadedPages: state.loadedPages + 1
  }, state),
}, initialState);
