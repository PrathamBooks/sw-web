import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './peopleSearchActions';

const initialState = {
  sortOptions: null,
  isFetchingPeople: false,
  isFetchingMorePeople: false, // for pagination
  loadedPages: 0,
  people: null,
  totalPeopleCount: 0,
};

export default handleActions({
  [actions.fetchPeople]: (state, action) => u({
    isFetchingPeople: true
  }, state),
  
  [actions.receivePeople]: (state, action) => u({
    isFetchingPeople: false,
    people: action.payload.people,
    totalPeopleCount: action.payload.totalPeopleCount,
    loadedPages: 1
  }, state),

  [actions.fetchMorePeople]: (state, action) => u({
    isFetchingMorePeople: true
  }, state),

  [actions.receiveMorePeople]: (state, action) => u({
    isFetchingMorePeople: false,
    people: state.people.concat(action.payload.people),
    loadedPages: state.loadedPages + 1
  }, state),
}, initialState);
