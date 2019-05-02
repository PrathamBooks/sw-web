import {
  createAsyncActions,
  runAsyncWorkflow
} from "../lib/reduxHelpers";

import { Newsletter } from "../api";

export const [
  fetchSubscribe,
  receiveSubscribe,
  fetchSubscribeError
] = createAsyncActions(
  'SUBSCRIBE_TO_NEWSLETTER',
  () => {},
  () => {}
);

export const subscribeWorkflow = (email) => {
  const fetchPromise = Newsletter.subscribe(email);
  
  return runAsyncWorkflow({
    fetch: fetchSubscribe,
    receive: receiveSubscribe,
    error: fetchSubscribeError
  }, fetchPromise, { email });
}
