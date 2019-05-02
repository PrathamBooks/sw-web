import { createAction } from 'redux-actions';
import {
  createAsyncActions,
  runAsyncWorkflow
} from '../lib/reduxHelpers';

import { Book } from '../api';


export const [
  fetchBook,
  receiveBook,
  fetchBookError
] = createAsyncActions(
  'BOOK',
  slug => ({ slug }),
  ({ data }) => ({ book: data })
);

export const fetchBookWorkflow = slug => {
  const fetchPromise = Book.fetch(slug);

  return runAsyncWorkflow({
    fetch: fetchBook,
    receive: receiveBook,
    error: fetchBookError
  }, fetchPromise);
};

export const [
  fetchBookDownloadLimit,
  receiveBookDownloadLimit,
  fetchBookDownloadLimitError
] = createAsyncActions(
  'BOOK_DOWNLOAD_LIMIT',
  slug => ({ slug }),
  ({ data }) => ({ book: data })
);

export const fetchBookDownloadLimitWorkflow = slug => {
  const fetchPromise = Book.fetch(slug);

  return runAsyncWorkflow({
    fetch: fetchBookDownloadLimit,
    receive: receiveBookDownloadLimit,
    error: fetchBookDownloadLimitError
  }, fetchPromise);
};

export const [
  fetchNextReadBooks,
  receiveNextReadBooks,
  fetchNextReadBooksError
] = createAsyncActions(
  'NEXT_READ_BOOKS',
  slug => ({ slug }),
  ({ data }) => ({ nextReadBooks: data.similarBooks })
);

export const fetchNextReadBooksWorkflow = slug => {
  const fetchPromise = Book.fetch(slug);

  return runAsyncWorkflow({
    fetch: fetchNextReadBooks,
    receive: receiveNextReadBooks,
    error: fetchNextReadBooksError
  }, fetchPromise);
};

export const [
  addToList,
  receiveAddToList,
  addToListError
] = createAsyncActions(
  'ADD_BOOK_TO_LIST',
  ({ bookSlug, listSlug }) => ({ bookSlug, listSlug }),
  ({ bookSlug, listSlug }) => ({ bookSlug, listSlug })
);

export const addBookToListWorkflow = (bookSlug, listSlug) => {
  const fetchPromise = Book.addToList(bookSlug, listSlug);

  return runAsyncWorkflow(
    {
      fetch: addToList,
      receive: receiveAddToList,
      error: addToListError
    },
    fetchPromise,
    { bookSlug, listSlug }
  );
};

export const [
  addToBookshelf,
  receiveAddToBookshelf,
  addToBookshelfError
] = createAsyncActions(
  'ADD_BOOK_TO_BOOKSHELF',
  ({ bookSlug, listSlug }) => ({ bookSlug, listSlug }),
  ({ bookSlug, listSlug }) => ({ bookSlug, listSlug })
);

export const addBookToBookshelfWorkflow = (bookSlug, listSlug) => {
  const fetchPromise = Book.addToList(bookSlug, listSlug);

  return runAsyncWorkflow(
    {
      fetch: addToBookshelf,
      receive: receiveAddToBookshelf,
      error: addToBookshelfError
    },
    fetchPromise,
    { bookSlug, listSlug }
  );
};


export const [
  removeFromList,
  receiveRemoveFromList,
  removeFromListError
] = createAsyncActions(
  'REMOVE_BOOK_FROM_LIST',
  ({ bookSlug, listSlug }) => ({ bookSlug, listSlug }),
  ({ bookSlug, listSlug }) => ({ bookSlug, listSlug })
);

export const removeBookFromListWorkflow = (bookSlug, listSlug) => {
  const fetchPromise = Book.removeFromList(bookSlug, listSlug);

  return runAsyncWorkflow(
    {
      fetch: removeFromList,
      receive: receiveRemoveFromList,
      error: removeFromListError
    },
    fetchPromise,
    { bookSlug, listSlug }
  );
};


export const [
  removeFromBookshelf,
  receiveRemoveFromBookshelf,
  removeFromBookshelfError
] = createAsyncActions(
  'REMOVE_BOOK_FROM_BOOKSHELF',
  ({ bookSlug, listSlug }) => ({ bookSlug, listSlug }),
  ({ bookSlug, listSlug }) => ({ bookSlug, listSlug })
);

export const removeBookFromBookshelfWorkflow = (bookSlug, listSlug) => {
  const fetchPromise = Book.removeFromList(bookSlug, listSlug);

  return runAsyncWorkflow(
    {
      fetch: removeFromBookshelf,
      receive: receiveRemoveFromBookshelf,
      error: removeFromBookshelfError
    },
    fetchPromise,
    { bookSlug, listSlug }
  );
};


export const [
  postFlagBook,
  receivePostFlagBook,
  postFlagBookError
] = createAsyncActions(
  'FLAG_BOOK',
  ({ bookSlug, reasons }) => ({ bookSlug, reasons }),
  ({ bookSlug }) => ({ bookSlug })
);

export const postFlagBookWorkflow = (bookSlug, reasons) => {
  const fetchPromise = Book.flag(bookSlug, reasons);

  return runAsyncWorkflow(
    {
      fetch: postFlagBook,
      receive: receivePostFlagBook,
      error: postFlagBookError
    },
    fetchPromise,
    { bookSlug, reasons }
  );
};

export const [
  postSmileyRating,
  receivePostSmileyRating,
  postSmileyRatingError
] = createAsyncActions(
  'SMILEY_RATING',
  ({ bookSlug, reaction }) => ({ bookSlug, reaction }),
  ({ bookSlug }) => ({ bookSlug })
);

export const postSmileyRatingWorkflow = (bookSlug, reaction) => {
  const fetchPromise = Book.submitSmileyRating(bookSlug, reaction);

  return runAsyncWorkflow(
    {
      fetch: postSmileyRating,
      receive: receivePostSmileyRating,
      error: postSmileyRatingError
    },
    fetchPromise,
    { bookSlug, reaction }
  );
};

export const [
  fetchSmileyRatingBook,
  receiveSmileyRatingBook,
  fetchSmileyRatingBookError
] = createAsyncActions(
  'SMILEY_RATING_BOOKS',
  slug => ({ slug }),
  ({ data }) => ({ smileyRatingBook: data })
);

export const fetchSmileyRatingBookWorkflow = slug => {
  const fetchPromise = Book.fetch(slug);

  return runAsyncWorkflow({
    fetch: fetchSmileyRatingBook,
    receive: receiveSmileyRatingBook,
    error: fetchSmileyRatingBookError
  }, fetchPromise);
};

export const [
  fetchNextTranslationBooks,
  receiveNextTranslationBooks,
  fetchNextTranslationBooksError
] = createAsyncActions(
  'NEXT_TRANSLATION_BOOKS',
  ({slug , translateToLanguage })=> ({ slug , translateToLanguage }),
  ({ data }) => ({ nextTranslationBooks: data.similarBooks })
);

export const fetchNextTranslationBooksWorkflow = (slug , translateToLanguage) => {
  const fetchPromise = Book.fetchNextTranslationBooks(slug, translateToLanguage);

  return runAsyncWorkflow({
    fetch: fetchNextTranslationBooks,
    receive: receiveNextTranslationBooks,
    error: fetchNextTranslationBooksError
  }, fetchPromise);
};

export const [
  postRelevel,
  receivePostRelevel,
  postRelevelError
] = createAsyncActions(
  'RELEVEL',
  ({ bookSlug, newLevel }) => ({ bookSlug, newLevel }),
  ({ newLevel }) => ({ newLevel })
);

export const postRelevelWorkflow = (bookSlug, newLevel) => {
  const fetchPromise = Book.relevel(bookSlug, newLevel);

  return runAsyncWorkflow(
    {
      fetch: postRelevel,
      receive: receivePostRelevel,
      error: postRelevelError
    },
    fetchPromise,
    { bookSlug, newLevel }
  );
};


export const [
  fetchBookAssets,
  receiveBookAssets,
  receiveBookAssetsError
] = createAsyncActions(
  'BOOK_ASSETS',
  ({ slug }) => ({ slug }),
  ({ data }) => ({ assets: data })
);

export const fetchBookAssetsWorkflow = slug => {
  const fetchPromise = Book.fetchAssets(slug);

  return runAsyncWorkflow(
    {
      fetch: fetchBookAssets,
      receive: receiveBookAssets,
      error: fetchBookError
    },
    fetchPromise,
    { slug }
  );
};


export const [
  addToEditorsPicks,
  receiveAddToEditorsPicks,
  addToEditorsPicksError
] = createAsyncActions(
  'ADD_TO_EDITORS_PICKS',
  ({ slug }) => ({ slug })
);

export const addToEditorsPicksWorkflow = (slug) => {
  const addToEditorsPicksPromise = Book.addToEditorsPicks(slug);

  return runAsyncWorkflow(
    {
      fetch: addToEditorsPicks,
      receive: receiveAddToEditorsPicks,
      error: addToEditorsPicksError
    },
    addToEditorsPicksPromise
  );
};


export const [
  removeFromEditorsPicks,
  receiveRemoveFromEditorsPicks,
  removeFromEditorsPicksError
] = createAsyncActions(
  'REMOVE_FROM_EDITORS_PICKS',
  ({ slug }) => ({ slug })
);

export const removeFromEditorsPicksWorkflow = (slug) => {
  const removeFromEditorsPicksPromise = Book.removeFromEditorsPicks(slug);

  return runAsyncWorkflow(
    {
      fetch: removeFromEditorsPicks,
      receive: receiveRemoveFromEditorsPicks,
      error: removeFromEditorsPicksError
    },
    removeFromEditorsPicksPromise
  );
};


export const [
  likeBook,
  receiveLikeBook,
  likeBookError
] = createAsyncActions(
  'LIKE_BOOK',
  ({ slug }) => ({ slug })
);

export const likeBookWorkflow = (slug) => {
  const likeBookPromise = Book.like(slug);

  return runAsyncWorkflow(
    {
      fetch: likeBook,
      receive: receiveLikeBook,
      error: likeBookError
    },
    likeBookPromise
  );
};


export const openGlobalBookReader = createAction('sw/OPEN_GLOBAL_BOOK_READER');
export const closeGlobalBookReader = createAction('sw/CLOSE_GLOBAL_BOOK_READER');

export const openNextReadSuggestions = createAction('sw/OPEN_NEXT_READ_SUGGESTIONS');
export const closeNextReadSuggestions = createAction('sw/CLOSE_NEXT_READ_SUGGESTIONS');

export const openGlobalQuickView = createAction(
  'sw/OPEN_GLOBAL_QUICK_VIEW',
  book => ({ book })
);
export const closeGlobalQuickView = createAction('sw/CLOSE_GLOBAL_QUICK_VIEW');
