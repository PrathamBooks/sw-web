import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './slimNotificationActions';

const initialState = {
  notifications: []
};

export default handleActions({
  [actions.addSlimNotification]: (state, action) => {
    const notifications = [action.payload.slimNotification]
    return u({ notifications }, state);
  },

  [actions.removeSlimNotification]: (state, action) => {
    return u({
      notifications: u.reject((value, index) => action.payload.index === index)
    }, state)
  }

}, initialState);
