import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './profileActions';
import { profileTypes } from '../lib/constants';

const initialState = {
  isFetchingProfile: false,
  isFetchingMore: false,
  profile: {
    [profileTypes.USER]: null,
    [profileTypes.ORGANISATION]: null,
    [profileTypes.PUBLISHER]: null
  }
};

export default handleActions({
  [actions.fetchProfile]: (state, action) => u({
    isFetchingProfile: true,
    profile: {
      [action.payload.profileType]: null
    }
  }, state),

  [actions.receiveProfile]: (state, action) => u({
    isFetchingProfile: false,
    profile: {
      [action.payload.profileType]: action.payload.profile
    }
  }, state),

  [actions.fetchMore]: (state, action) => u({
    isFetchingMore: true
  }, state),

  [actions.receiveMore]: (state, action) => {
    const { profileType, collection } = action.payload
    const data = state.profile[profileType][collection].results.concat(action.payload.data[collection].results)
    const metadata = action.payload.data[collection].meta
    return u({
      isFetchingMore: false,
      profile: {
        [profileType]: {
          [collection]: {
            meta: metadata,
            results: data
          }
        }
      }
    }, state)
  }
}, initialState);
