import { createActions } from "redux-actions";

export const ADD_OFFLINE_BOOK_MODAL = 'ADD_OFFLINE_BOOK_MODAL';
export const OFFLINE_BOOK_MODAL_CLICKED = 'OFFLINE_BOOK_MODAL_CLICKED';

export const { addOfflineBookModal } = createActions('ADD_OFFLINE_BOOK_MODAL');
export const { offlineBookModalClicked } = createActions('OFFLINE_BOOK_MODAL_CLICKED');
export const { removeOfflineBookModal } = createActions({'REMOVE_OFFLINE_BOOK_MODAL': () => ({})});
