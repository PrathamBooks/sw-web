import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './offlineBooksActions';

const initialState = {
  books: [],
  isSavingOffline: false
};

export default handleActions({
  [actions.saveOffline]: (state, action) => u({
    isSavingOffline: true
  }, state),

  [actions.receiveSaveOffline]: (state, action) => {
    const books = state.books.concat(action.payload.book);
    return u({
      books: books,
      isSavingOffline: false
    }, state);
  },

  [actions.saveOfflineError]: (state, actions) => u({
    isSavingOffline: false
  }, state),

  [actions.unsaveOffline]: (state, action) => {
    return u({
      books: u.reject(value => {
        return action.payload.bookId === value.id
      })
    }, state);
  }
}, initialState);
