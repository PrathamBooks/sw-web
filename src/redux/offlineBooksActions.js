import { createActions } from 'redux-actions';

import { createAsyncActions, runAsyncWorkflow } from '../lib/reduxHelpers'
import { Offline } from '../api'

export const { unsaveOffline } = createActions({
  'UNSAVE_OFFLINE': bookId => ({ bookId })
})

export const [
  saveOffline,
  receiveSaveOffline,
  saveOfflineError
] = createAsyncActions(
  'SAVE_OFFLINE',
  () => {},
  ({ book }) => ({ book })
);

export const saveOfflineWorkflow = (book, imageSize = 6) => {
  const fetchPromise = Offline.save(book.slug, imageSize);

  return runAsyncWorkflow(
    {
      fetch: saveOffline,
      receive: receiveSaveOffline,
      error: saveOfflineError
    },
    fetchPromise,
    { book }
  );
};

export const isAvailableOffline = (bookId, offlineBooks) => offlineBooks.books.filter(offlineBook => offlineBook.id === bookId).length
