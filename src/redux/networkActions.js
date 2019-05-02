// TODO: Move this to redux-actions
const NETWORK_ONLINE = "NETWORK_ONLINE";
const NETWORK_OFFLINE = "NETWORK_OFFLINE";

export const initNetwork = () => dispatch => {
  window.addEventListener("online", e => {
    dispatch({
      type: NETWORK_ONLINE
    });
  });

  window.addEventListener("offline", e => {
    dispatch({
      type: NETWORK_OFFLINE
    });
  });

  return;
};