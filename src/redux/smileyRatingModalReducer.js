import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './smileyRatingModalActions';

const initialState = {
  isSmileyRatingModalVisible: false,
  showAudioBookReaderOnBack: false
};

export default handleActions({
  [actions.addSmileyRatingModal]: (state, action) => u({
    isSmileyRatingModalVisible: true,
    showAudioBookReaderOnBack: action.payload.showAudioBookReaderOnBack
  }, state),

  [actions.removeSmileyRatingModal]: (state, action) => u({
    isSmileyRatingModalVisible: false
  }, state),
  }, initialState);
