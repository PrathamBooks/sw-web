import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './notificationModalActions';

const initialState = {
  isNotificationModalVisible: false,
  notification: {}
};

export default handleActions({
  [actions.addNotificationModal]: (state, action) => u({
    isNotificationModalVisible: true,
    notification: action.payload
  }, state),

  [actions.removeNotificationModal]: (state, action) => u({
    isNotificationModalVisible: false,
    notification: {}
  }, state),
  }, initialState);
