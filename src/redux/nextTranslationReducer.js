import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './nextTranslationActions';

const initialState = {
  isGlobalNextTranslationSuggestionsVisible: false,
  nextSuggestionsType: '',
  translateToLanguage: ''
};

export default handleActions({

  [actions.openNextTranslationSuggestions]: (state, action) => u({
    isGlobalNextTranslationSuggestionsVisible: true,
    nextSuggestionsType: action.payload.nextSuggestionsType,
    translateToLanguage: action.payload.translateToLanguage
  }, state),

  [actions.closeNextTranslationSuggestions]: (state, action) => u({
    isGlobalNextTranslationSuggestionsVisible: false
  }, state),

}, initialState);
