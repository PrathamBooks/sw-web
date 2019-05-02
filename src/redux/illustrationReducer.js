import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './illustrationActions';

const initialState = {
  isFetchingIllustration: false,
  illustration: null,
  isLikingIllustration: false,
  isFlaggingIllustration: false,
  isUploadingIllustration: false,
  uploadErrors: {},
  isFetchingTags: false,
  tags: [],
  isFetchingIllustratorSuggestions: false,
  illustratorSuggestions: [],
  isFetchingFormData: false,
  formData: null,
  isfetchingConfirmImageFormat: false,
  isFetchingIllustrationDownloadLimit: false
}

export default handleActions({
  [actions.fetchIllustration]: (state, action) => u({
    isFetchingIllustration: true
  }, state),

  [actions.receiveIllustration]: (state, action) => u({
    isFetchingIllustration: false,
    illustration: action.payload.illustration
  }, state),

  [actions.fetchIllustrationError]: (state, action) => u({
    isFetchingIllustration: false,
  }, state),

  [actions.fetchIllustrationDownloadLimit]: (state, action) => u({
    isFetchingIllustrationDownloadLimit: true
  }, state),

  [actions.receiveIllustrationDownloadLimit]: (state, action) => u({
    isFetchingIllustrationDownloadLimit: false
  }, state),

  [actions.likeIllustration]: (state, action) => u({
    isLikingIllustration: true
  }, state),

  [actions.receiveLikeIllustration]: (state, action) => u({
    isLikingIllustration: false,
    illustration: {
      liked: true,
      likesCount: state.illustration.likesCount + 1
    }
  }, state),

  [actions.postFlagIllustration]: (state, action) => u({
    isFlaggingIllustration: true
  }, state),

  [actions.receivePostFlagIllustration]: (state, action) => u({
    illustration: {
      isFlagged: true
    },
    isFlaggingIllustration: false
  }, state),

  [actions.postFlagIllustrationError]: (state, action) => u({
    isFlaggingIllustration: false
  }, state),

 [actions.fetchIllustrationFormData]: (state, action) => u({
    isFetchingFormData: true
  }, state),

  [actions.receiveIllustrationFormData]: (state, action) => u({
    isFetchingFormData: false,
    formData: action.payload.data
  }, state),

  [actions.fetchIllustrationFormDataError]: (state, action) => u({
    isFetchingFormData: false,
  }, state),

  [actions.uploadIllustration]: (state, action) => u({
    isUploadingIllustration: true
  }, state),

  [actions.receiveUploadIllustration]: (state, action) => u({
    isUploadingIllustration: false,
  }, state),

 [actions.uploadIllustrationError]: (state, action) => u({
    isUploadingIllustration: false,
    uploadErrors: action.payload
  }, state),

  [actions.fetchAutoCompleteTag]: (state, action) => u({
    isFetchingTags: true
  }, state),

  [actions.receiveAutoCompleteTag]: (state, action) => {
    const tags = action.payload.data.map(tag => {
      return {
        name: tag.name,
        queryValue: tag.name
      }
    })
    return u({
      isFetchingTags: false,
      tags: tags
    }, state)
  },

  [actions.fetchAutoCompleteTagError]: (state, action) => u({
    isFetchingTags: false,
    TagsErrors: action.payload
  }, state),

  [actions.fetchAutoCompleteIllustrators]: (state, action) => u({
    isFetchingIllustratorSuggestions: true
  }, state),

  [actions.receiveAutoCompleteIllustrators]: (state, action) => {
    const illustrators = action.payload.data.map(illustrator => {
      return {
        name: illustrator.email,
        queryValue: illustrator.email,
        firstName: illustrator.first_name,
        lastName: illustrator.last_name,
        bio: illustrator.bio
      }
    })
    return u({
      isFetchingIllustratorSuggestions: false,
      illustratorSuggestions: illustrators
    }, state)
  },

  [actions.fetchAutoCompleteIllustratorsError]: (state, action) => u({
    isFetchingIllustratorSuggestions: false,
  }, state),

  [actions.fetchConfirmImageFormat]: (state, action) => u({
    isfetchingConfirmImageFormat: true
  }, state),

  [actions.receiveConfirmImageFormat]: (state, action) => u({
    isfetchingConfirmImageFormat: false
  }, state),
}, initialState);
