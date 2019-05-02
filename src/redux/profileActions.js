import {
  createAsyncActions,
  runAsyncWorkflow
} from "../lib/reduxHelpers";
import { User, Organisation, Publisher } from "../api";
import { profileTypes } from '../lib/constants';

const mapModelsToNames = {
  [profileTypes.USER]: User,
  [profileTypes.ORGANISATION]: Organisation,
  [profileTypes.PUBLISHER]: Publisher
};

export const [
  fetchProfile,
  receiveProfile,
  fetchProfileError
] = createAsyncActions(
  "PROFILE",
  slug => ({ slug }),
  ({ ok, data, profileType }) => ({ profile: data, profileType })
);

export const fetchProfileWorkflow = (slug, profileType, perPage) => {
  const fetchPromise = mapModelsToNames[profileType].fetchProfile(slug, 24);

  return runAsyncWorkflow(
    {
      fetch: fetchProfile,
      receive: receiveProfile,
      error: fetchProfileError
    },
    fetchPromise,
    {
      slug,
      profileType,
      perPage
    },
    true,
    (dispatchFn, error) => {
      // Redirect to legacy 404 page in case of any error
      if (process.env.NODE_ENV === 'production') {
        window.location.href = '/errors/error_404'
      }
    }
  );
};

export const [
  fetchMore,
  receiveMore,
  fetchMoreError
] = createAsyncActions(
  "PROFILE_LOAD_MORE",
  (collection, page) => ({ collection, page }),
  ({ data, metadata, profileType, collection }) => ({ data, metadata, profileType, collection })
);

export const loadMoreWorkflow = (profileType, profileName, slug, collection, page, perPage) => {
  const fetchPromise = mapModelsToNames[profileType].fetchProfile(slug, 24, page);

  return runAsyncWorkflow(
    {
      fetch: fetchMore,
      receive: receiveMore,
      error: fetchMoreError
    },
    fetchPromise,
    {
      profileType,
      collection,
      perPage,
      page
    }
  );
}
