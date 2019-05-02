import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './offlineBookModalAction';

const initialState = {
  isofflineModalVisible: false,
  profile: ''
};

export default handleActions({
  [actions.addOfflineBookModal]: (state, action) => u({
    isofflineModalVisible: true,
    profile: action.payload
  }, state),

  [actions.offlineBookModalClicked]: (state, action) => u({
    isofflineModalVisible: false,
    profile: action.payload
  }, state),

  [actions.removeOfflineBookModal]: (state, action) => u({
    isofflineModalVisible: false
  }, state),

  }, initialState);
