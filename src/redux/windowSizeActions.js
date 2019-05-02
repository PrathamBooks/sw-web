
import { createActions } from "redux-actions";

export const ON_WINDOW_SIZE_CHANGE = 'ON_WINDOW_SIZE_CHANGE';

export const { onWindowSizeChange } = createActions('ON_WINDOW_SIZE_CHANGE');
