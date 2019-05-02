
import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './windowSizeActions';

const initialState = {
  width: window.innerWidth,
  height: window.innerHeight
};

export default handleActions({
  [actions.onWindowSizeChange]: (state, action) => u({
    width: window.innerWidth,
    height: window.innerHeight
  }, state),

  }, initialState);
