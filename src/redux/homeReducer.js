import { handleActions } from 'redux-actions';
import u from 'updeep';
import * as actions from './homeActions';
import * as bookActions from './bookActions';

const initialState = {
  bannerImages: [],
  editorsPick: {
    meta: {},
    results: []
  },
  newArrivals: {
    meta: {},
    results: []
  },
  mostRead: {
    meta: {},
    results: []
  },
  homeCards: [],

  blogPosts: [],
  recommendedStories: [],
  lists: [],
  statistics: {},
  profile: {}
}

export default handleActions({
  [actions.receiveBannerImages]: (state, action) => u({
    bannerImages: action.payload.data.bannerImages,
  }, state),

  [actions.receiveHome]: (state, action) => u({
    editorsPick: action.payload.data.editorsPick,
    newArrivals: action.payload.data.newArrivals,
    mostRead: action.payload.data.mostRead,
    blogPosts: action.payload.data.blogPosts,
    statistics: action.payload.data.statistics,
    lists: action.payload.data.lists
  }, state),

  [actions.receiveRecommendations]: (state, action) => u({
    recommendedStories: action.payload.data.recommendedStories
  }, state),

  [actions.popupOpened]: (state, action) => u({
    profile: action.payload
  }, state),

  [actions.bookRead]: (state, action) => u({
    profile: action.payload
  }, state),

  [bookActions.receiveBookAssets]: (state, action) => {
    const updatesList = {};

    if (state.statistics && state.statistics.readsCount) {
      updatesList.statistics = {
        readsCount: state.statistics.readsCount + 1
      }
    }

    return u(updatesList, state);
  },

  [actions.receiveCards]: (state, action) => u({
    homeCards: action.payload.cards
  }, state),

}, initialState);
