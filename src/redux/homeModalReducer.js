import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './homeModalActions';

const initialState = {
  isHomePagePopUp: false
};

export default handleActions({
  [actions.updateHomeModal]: (state, action) => u({
    isHomePagePopUp: true
  }, state),

}, initialState);
