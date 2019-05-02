import {
    createAsyncActions,
    runAsyncWorkflow
  } from '../lib/reduxHelpers';
import { Person, Organisation } from '../api';
import { profileTypes } from '../lib/constants';

export const [
  fetchPeople,
  receivePeople,
  fetchPeopleError
] = createAsyncActions(
  'PEOPLE',
  ({ page, perPage }) => ({ page, perPage }),
  ({ data, metadata }) => ({ people: data, totalPeopleCount: metadata.hits })
);

export const [
  fetchMorePeople,
  receiveMorePeople,
  fetchMorePeopleError
] = createAsyncActions(
  'MORE_PEOPLE',
  ({ page, perPage }) => ({ page, perPage }),
  ({ data }) => ({ people: data })
);

export const fetchPeopleWorkflow = (variant = profileTypes.USER, appliedFilters, page, perPage) => {
  const fetchingMore = page && page > 1;

  let fetchPromise;
  if (variant === profileTypes.USER) {
    fetchPromise = Person.fetchAll(appliedFilters, page, perPage);
  } else if (variant === profileTypes.ORGANISATION) {
    fetchPromise = Organisation.fetchAll(appliedFilters, page, perPage);
  }

  return runAsyncWorkflow({
    fetch: fetchingMore ? fetchMorePeople : fetchPeople,
    receive: fetchingMore ? receiveMorePeople : receivePeople,
    error: fetchingMore ? fetchMorePeopleError : fetchPeopleError
  }, fetchPromise);
};
