// TODO: Move this to redux-actions
const NETWORK_ONLINE = "NETWORK_ONLINE";
const NETWORK_OFFLINE = "NETWORK_OFFLINE";

const initialState = {
  online: window.navigator.onLine
};

export default (state = initialState, action) => {
  switch (action.type) {
    case NETWORK_ONLINE:
      return {
        ...state,
        online: true
      };

    case NETWORK_OFFLINE:
      return {
        ...state,
        online: false
      };

    default:
      return state;
  }
};
