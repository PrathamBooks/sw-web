import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './notificationActions';

const initialState = {
  notifications: []
};

export default handleActions({
  [actions.addNotification]: (state, action) => {
    const isNotificationVisible = state.notifications.find(
      n => n.id === action.payload.notification.id
    );
    
    const shouldAddNotification = (action.payload.notification.dedup && !isNotificationVisible) ||
                                  !action.payload.notification.dedup;
    
    const notifications = shouldAddNotification ?
                          state.notifications.concat(action.payload.notification) :
                          state.notifications;
    
    return u({ notifications }, state);
  },

  [actions.removeNotification]: (state, action) => {
    return u({
      notifications: u.reject((value, index) => action.payload.index === index)
    }, state)
  }

}, initialState);
