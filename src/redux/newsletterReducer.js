import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './newsletterActions';

const initialState = {
  isSubscribed: false,
  isFetchingSubscribe: false
};

export default handleActions({
  [actions.fetchSubscribe]: (state, action) => u({
    isFetchingSubscribe: true
  }, state),

  [actions.receiveSubscribe]: (state, action) => u({
    isFetchingSubscribe: false,
    isSubscribed: true
  }, state)
}, initialState);
