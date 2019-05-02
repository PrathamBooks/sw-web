import { createAction } from "redux-actions";

export const GA_GENERIC = 'GA_GENERIC';
export const recordGaEvents = createAction(GA_GENERIC);

export const GA_LOCALIZATION = 'GA_LOCALIZATION';
export const recordLocalization = createAction(GA_LOCALIZATION);

export const GA_BOOK_READ_COMPLETED = 'GA_BOOK_READ_COMPLETED';
export const recordBookReadCompleted = createAction(GA_BOOK_READ_COMPLETED);

export const GA_BOOK_DOWNLOAD = 'GA_BOOK_DOWNLOAD';
export const recordBookDownload = createAction(GA_BOOK_DOWNLOAD);

export const GA_BOOK_DOWNLOAD_POPUP_OPENED = 'GA_BOOK_DOWNLOAD_POPUP_OPENED';
export const recordBookDownloadPopUpOpened = createAction(GA_BOOK_DOWNLOAD_POPUP_OPENED);

export const GA_BOOK_DOWNLOAD_POPUP_FORM_OPENED = 'GA_BOOK_DOWNLOAD_POPUP_FORM_OPENED';
export const recordBookDownloadPopUpFormOpened = createAction(GA_BOOK_DOWNLOAD_POPUP_FORM_OPENED);

export const GA_ILLUSTRATION_DOWNLOAD = 'GA_ILLUSTRATION_DOWNLOAD';
export const recordIllustrationDownload = createAction(GA_ILLUSTRATION_DOWNLOAD);