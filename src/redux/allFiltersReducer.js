import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './allFiltersActions';

const userFilters = {
  language: [],
  level: []
}

const commonFilters = {
  query: '',
  tags: []
}

export const initialState = {
    filterType: 'readFilters',
    readFilters: {
      ...{ category: [], publisher: [], derivation_type: [], status: [], story_type: [],  sort: 'Relevance' },
      ...userFilters,
      ...commonFilters
    },
    listsFilters: {
      ...{ category: [], sort: 'Relevance' },
      ...commonFilters
    },
    imagesFilters: {
      ...{ category: [], publisher: [], style: [], sort: 'Relevance' },
      ...userFilters,
      ...commonFilters
    },
    peopleFilters: { ...commonFilters },
    organisationsFilters: { ...commonFilters }
}


export default handleActions({
    [actions.applyFilter]: ( state, action ) => u({
        filterType: action.payload.filterType,
        [action.payload.filterType]: { ...state[action.payload.filterType], ...action.payload.filter }
    }, state),
    [actions.resetFilters]: ( state, action ) => u({ ...initialState }, state ),
}, initialState);

