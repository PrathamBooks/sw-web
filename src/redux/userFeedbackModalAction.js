import { createActions } from "redux-actions";

export const ADD_USER_FEEDBACK_MODAL = 'ADD_USER_FEEDBACK_MODAL';
export const USER_FEEDBACK_MODAL_CLICKED = 'USER_FEEDBACK_MODAL_CLICKED';
export const REMOVE_USER_FEEDBACK_MODAL = 'REMOVE_USER_FEEDBACK_MODAL';

export const { addUserFeedbackModal } = createActions('ADD_USER_FEEDBACK_MODAL');
export const { userFeedbackModalClicked } = createActions('USER_FEEDBACK_MODAL_CLICKED');
export const { removeUserFeedbackModal } = createActions('REMOVE_USER_FEEDBACK_MODAL');
