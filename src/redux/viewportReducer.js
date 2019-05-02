// TODO: Move this to redux-actions
const VIEWPORT_WIDTH_MATCHED = 'VIEWPORT_WIDTH_MATCHED'
const VIEWPORT_WIDTH_NOT_MATCHED = 'VIEWPORT_WIDTH_NOT_MATCHED'

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case VIEWPORT_WIDTH_MATCHED:
      return {
        ...state,
        [action.payload.media]: true
      };

    case VIEWPORT_WIDTH_NOT_MATCHED:
      return {
        ...state,
        [action.payload.media]: false
      };

    default:
      return state;
  }
};
