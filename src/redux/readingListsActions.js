import {
  createAsyncActions,
  runAsyncWorkflow
} from '../lib/reduxHelpers';

import { ReadingList } from '../api';

export const [
  fetchReadingListDetails,
  receiveReadingListDetails,
  fetchReadingListDetailsError
] = createAsyncActions(
  'READING_LIST_DETAILS',
  slug => ({ slug }),
  ({ ok, data }) => ({ readingList: data })
);

export const fetchReadingListDetailsWorkflow = slug => {
  const fetchPromise = ReadingList.fetchDetails(slug);

  return runAsyncWorkflow({
      fetch: fetchReadingListDetails,
      receive: receiveReadingListDetails,
      error: fetchReadingListDetailsError
    },
    fetchPromise,
    { slug },
    true,
    error => {
      // Redirect to legacy 404 page in case of any error
      if (process.env.NODE_ENV === 'production') {
        window.location.href = '/errors/error_404'
      }
    }
  );
};

export const [
  postReadingListLike,
  receiveReadingListLike,
  postReadingListLikeError
] = createAsyncActions(
  'READING_LIST_LIKE',
  slug => ({ slug }),
  ({ ok, data }) => ({ readingList: data }),
  'POST'
);

export const postReadingListLikeWorkflow = slug => {
  const postPromise = ReadingList.postLike(slug);

  return runAsyncWorkflow(
    {
      fetch: postReadingListLike,
      receive: receiveReadingListLike,
      error: postReadingListLikeError
    },
    postPromise,
    { slug }
  );
};

export const [
  updateReadingList,
  receiveUpdateReadingList,
  updateReadingListError
] = createAsyncActions(
  'UPDATE_READING_LIST',
  readingList => ({ readingList }),
  ({ ok, data }) => ({ readingList: data }),
  'PUT'
);

export const updateReadingListWorkflow = readingList => {
  const updateReadingListPromise = ReadingList.update(readingList);

  return runAsyncWorkflow(
    {
      fetch: updateReadingList,
      receive: receiveUpdateReadingList,
      error: updateReadingListError
    },
    updateReadingListPromise,
    { readingList }
  );
};


export const [
  createReadingList,
  receiveCreateReadingList,
  createReadingListError
] = createAsyncActions(
  'CREATE_READING_LIST',
  (title, description, books) => ({ title, description, books }),
  ({ data }) => ({ readingList: data })
);

export const createReadingListWorkflow = (name, description, books) => {
  const createReadingListPromise = ReadingList.create(name, description, books);

  return runAsyncWorkflow(
    {
      fetch: createReadingList,
      receive: receiveCreateReadingList,
      error: createReadingListError
    },
    createReadingListPromise
  );
};
