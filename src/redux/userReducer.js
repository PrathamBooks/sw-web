import u from 'updeep';
import { handleActions } from 'redux-actions';
import * as actions from './userActions';
import * as bookActions from './bookActions';
import { receiveCreateReadingList } from './readingListsActions';

const initialState = {
  isLoggedIn: false,
  isFetchingMe: false,
  isFetchingLogout: false,
  profile: {
    roles: [],
    bookshelf: {
      books: []
    }
  },
  languageOptions: [],
  isFetchingLists: false,
  isDeletingList: false,
  lists: null,
  language: 'en',
  offlinePopUpStatusUpdated: false,
  userFeedbackPopUpStatusUpdated: false,
  isAuthModalVisible: false,
  userAuthStages: '',
  organisations: [],
  isFetchingOrganisations: false,
  stage: '',
  resetPasswordToken: '',
  isConsentGiven: false,
  isFetchingNotifications: false
};

export default handleActions({
  [actions.fetchNotifications]: (state, action) => u({
    isFetchingNotifications: true
  }, state),

  [actions.receiveNotifications]: (state, action) => u({
    isFetchingNotifications: false
  }, state),

  [actions.fetchNotificationsError]: (state, action) => u({
    isFetchingNotifications: false
  }, state),

  [actions.fetchMe]: (state, action) => u({
    isFetchingMe: true
  }, state),

  [actions.receiveMe]: (state, action) => u({
    isFetchingMe: false,
    isLoggedIn: action.payload.profile.isLoggedIn,
    isConsentGiven: action.payload.profile.consentFlag,
    profile: action.payload.profile
  }, state),

  [actions.fetchMeError]: (state, _) => u({
    isFetchingMe: false
  }, state),

  [actions.fetchLogout]: (state, action) => u({
    isFetchingLogout: true
  }, state),

  [actions.receiveLogout]: (state, action) => u({
    isFetchingLogout: false,
    isLoggedIn: false
  }, state),

  [actions.fetchUserLists]: (state, action) => u({
    isFetchingLists: true
  }, state),

  [actions.receiveUserLists]: (state, action) => u({
    isFetchingLists: false,
    lists: action.payload.lists
  }, state),

  [actions.deleteUserList]: (state, action) => u({
    isDeletingList: true
  }, state),

  [actions.receiveDeleteUserList]: (state, action) => {
    return u({
      isDeletingList: false,
      lists: u.reject(value => value.id.toString() === action.payload.listId),
    }, state)
  },

  [receiveCreateReadingList]: (state, action) => u({
    lists: state.lists.concat(action.payload.readingList)
  }, state),


  [actions.receiveOfflineChangePopUpStatus]: (state, action) => u({
    offlinePopUpStatusUpdated: true
  }, state),

  [actions.receiveUserFeedbackModalStatus]: (state, action) => u({
    userFeedbackPopUpStatusUpdated: true
  }, state),

  [actions.receiveChangeLanguage]: (state, action) => u({
    language: action.payload.newLanguage
  }, state),

  [actions.openAuthModal]: (state, action) => u({
    isAuthModalVisible: true,
    stage: action.payload ? action.payload.stage : '',
    resetPasswordToken: action.payload ? action.payload.resetPasswordToken : '',
  }, state),

  [actions.closeAuthModal]: (state, action) => u({
    isAuthModalVisible: false,
    stage: '',
    resetPasswordToken: ''
  }, state),

  [actions.fetchEmailStatus]: (state, action) => u({
    isLoadingNext: true
  }, state),

  [actions.receiveEmailStatus]: (state, action) => u({
    isLoadingNext: false
  }, state),

  [actions.fetchLogin]: (state, action) => u({
    isLoadingNext: true
  }, state),

  [actions.receiveLogin]: (state, action) => u({
    isLoadingNext: false
  }, state),

  [actions.fetchLoginError]: (state, action) => u({
    isLoadingNext: false
  }, state),

  [actions.fetchLanguageOptions]: (state, action) => u({
    isLoadingNext: true
  }, state),

  [actions.receiveLanguageOptions]: (state, action) => u({
    isLoadingNext: false,
    languageOptions: action.payload.queryValues
  }, state),

  [actions.fetchOrganisationsOptions]: (state, action) => u({
    isFetchingOrganisations: true
  }, state),

  [actions.receiveOrganisationsOptions]: (state, action) => {
    const organisations = action.payload.data.map(organisation => {
      return {
        ...organisation,
        name: organisation.name ?`${organisation.name}, ${organisation.country}` : ``,
        queryValue: organisation.name||``
      }
    })
    return u({
      isFetchingOrganisations: false,
      organisations: organisations
    }, state)
  },

  [actions.fetchSignup]: (state, action) => u({
    isLoadingNext: true
  }, state),

  [actions.receiveSignup]: (state, action) => u({
    isLoadingNext: false
  }, state),

  [actions.fetchSignupError]: (state, action) => u({
    isLoadingNext: false
  }, state),

  [actions.fetchResetPassword]: (state, action) => u({
    isLoadingNext: true
  }, state),

  [actions.receiveResetPassword]: (state, action) => u({
    isLoadingNext: false
  }, state),

  [actions.fetchResetPasswordError]: (state, action) => u({
    isLoadingNext: false
  }, state),

  [actions.fetchResendConfirmationLink]: (state, action) => u({
    isLoadingNext: true
  }, state),

  [actions.receiveResendConfirmationLink]: (state, action) => u({
    isLoadingNext: false
  }, state),

  [actions.fetchResendConfirmationLinkError]: (state, action) => u({
    isLoadingNext: false
  }, state),

  [bookActions.receiveAddToBookshelf]: (state, action) => u({
    profile: {
      bookshelf: {
        books: [].concat(
          state.profile.bookshelf.books,
          { slug: action.payload.bookSlug }
        )
      }
    }
  }, state),

  [bookActions.receiveRemoveFromBookshelf]: (state, action) => {
    return u({
      profile: {
        bookshelf: {
          books: state.profile.bookshelf.books.filter(b => b.slug !== action.payload.bookSlug)
        }
      }
    }, state);
  },

  [actions.receiveupdateConsent]: (state, action) => u({
    isConsentGiven: true
  }, state)  
}, initialState);

