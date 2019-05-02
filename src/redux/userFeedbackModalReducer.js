import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './userFeedbackModalAction';

const initialState = {
  isUserFeedbackModalVisible: false,
  profile: '',
  feedbackType: '',
  eventLabel: ''
};

export default handleActions({
  [actions.addUserFeedbackModal]: (state, action) => u({
    isUserFeedbackModalVisible: true,
    profile: action.payload.userEmail,
    feedbackType: action.payload.feedbackType,
    eventLabel: action.payload.eventLabel
  }, state),

  [actions.userFeedbackModalClicked]: (state, action) => u({
    isUserFeedbackModalVisible: false,
    profile: action.payload.userEmail,
    feedbackType: action.payload.feedbackType,
    eventLabel: action.payload.eventLabel
  }, state),

  [actions.removeUserFeedbackModal]: (state, action) => u({
    isUserFeedbackModalVisible: false,
    profile: '',
    feedbackType: ''
  }, state),

  }, initialState);
