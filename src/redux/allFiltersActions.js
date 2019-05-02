import { createAction } from "redux-actions";

export const applyFilter = createAction('APPLIED_FILTERS');
export const resetFilters = createAction('RESET_FILTERS');