import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './readingListsActions';

const initialState = {
  isFetchingReadingList: false,
  readingList: null,
  isCreatingReadingList: false,
  isLikingReadingList: false,
  isEditingReadingList: false,
  isUpdatingReadingList: false
};

export default handleActions({
  [actions.fetchReadingListDetails]: (state, action) => u({
    isFetchingReadingList: true
  }, state),

  [actions.receiveReadingListDetails]: (state, action) => u({
    isFetchingReadingList: false,
    readingList: action.payload.readingList
  }, state),

  [actions.postReadingListLike]: (state, action) => u({
    isLikingReadingList: true
  }, state),

  [actions.receiveReadingListLike]: (state, action) => u({
    isLikingReadingList: false,
    readingList: action.payload.readingList
  }, state),

  [actions.updateReadingList]: (state, action) => u({
    isUpdatingReadingList: true
  }, state),

  [actions.receiveUpdateReadingList]: (state, action) => u({
    isUpdatingReadingList: false,
    readingList: action.payload.readingList
  }, state),

  [actions.createReadingList]: (state, action) => u({
    isCreatingReadingList: true
  }, state),

  [actions.receiveCreateReadingList]: (state, action) => u({
    isCreatingReadingList: false
  }, state),

  [actions.createReadingListError]: (state, action) => u({
    isCreatingReadingList: false
  }, state),
}, initialState);
