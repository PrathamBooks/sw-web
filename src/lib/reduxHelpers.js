import { createAction } from "redux-actions";

function ServerError(url, httpCode, message, errorCode, ctx) {
  this.name = 'ServerError';
  this.isServerError = true;
  this.message = message || 'The server returned an error.';
  this.httpCode = httpCode;
  this.url = url;
  this.errorCode = errorCode;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, (ctx || this.constructor));
  }
}

ServerError._super = Error;
ServerError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: ServerError,
    enumerable: false,
    writable: true,
    configurable: true
  }
});

/**
 * Creates an array of actions of the form FETCH_XYZ, RECEIVE_XYZ, and FETCH_XYZ_ERROR.
 * These actions are used for async data fetching where we need to display a loading indicator.
 * 
 * Optionally, you can supply a payload creator for the fetch action, and one for the receive
 * action.
 * 
 * The fetch payload creator is a function that takes some parameters, and produces an
 * object that is attached to the produced fetch redux action as a payload. This can be accessed
 * from a reducer or middleware.
 * 
 * The receive payload creator is a function that takes the received data from the server as a
 * parameter, and produces an object that is attached to the produced receive redux action as a
 * payload. Use this to extract fields from the server response. This data can be accessed from
 * a reducer or middleware.
 *
 * Creates FETCH actions by default. To create POST, DELETE, etc. actions, pass the string as
 * the fourth argument.
*/
export const createAsyncActions = (
  name,
  fetchPayloadCreator,
  receivePayloadCreator = () => {},
  actionString = 'FETCH'
) => [
  createAction(`sw/${actionString}_${name}`, fetchPayloadCreator),
  createAction(`sw/RECEIVE_${name}`, receivePayloadCreator),
  createAction(`sw/${actionString}_${name}_ERROR`)
];

/**
 * A higher-order function that generates a workflow-type action creator for
 * making simple async requests.
 *
 * A workflow-type action creator is a kind of action creator that is used in
 * conjunction with redux-thunk. It's simply a function that you dispatch, and is handled by
 * redux-thunk. When redux-thunk runs this function, the following events take place:
 * 
 *   - the function dispatches a fetch action
 *   - it attaches then and catch handlers to the request promise that is passed in (the actual
 *     HTTP request is made by the user of this function)
 *   - everything that happens next is handled by the then and catch handlers this function
 *     attaches to the request promise
 *   - if there's an error, it dispatches an error action with the error information as a payload
 *   - if there's no error then it stores the response and optionally parses it as JSON
 *   - if the response signals an error, it dispatches the error action with the error information
 *     as payload
 *   - if the response is ok, it dispatches a receive action
 * 
 * All the actions (fetch, receive, error) are created by action creators created by the
 * createAsyncActions function.
 * 
 * This makes simple HTTP requests with redux and redux-thunk less repetitive.
 *
*/
export const runAsyncWorkflow = (
  actions,
  requestPromise,
  payload = {},
  parseJson = true,
  catcher
) => dispatch => {
  dispatch(actions.fetch({ ...payload }));

  // TODO: dedup requests.
  // TODO: better error handling.

  return requestPromise
    .then(response => Promise.all([
      response,
      parseJson ? response.json() : Promise.resolve(null)
    ]))
    .then(([originalResponse, responseJson]) => {
      if (originalResponse.status < 200 || originalResponse.status >= 500) {
        const error = new ServerError(originalResponse.url, originalResponse.status);
        return Promise.reject(error);
      }
      
      return parseJson ? responseJson : originalResponse;
    })
    .then(response => {
      dispatch(actions.receive({ ...response, ...payload }))
      return response
    })
    .catch(error => {
      dispatch(actions.error(error));
      
      if (catcher) {
        return catcher(error);
      }

      console.error('Warning: unhandled promise rejection while running an async workflow: ', error);
      return error
    });
};
