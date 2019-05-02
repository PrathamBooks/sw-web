import { createAction } from "redux-actions";

import {
  createAsyncActions,
  runAsyncWorkflow
} from "../lib/reduxHelpers";

import { User, Book, Organisation } from "../api";

export const [
  fetchMe,
  receiveMe,
  fetchMeError
] = createAsyncActions(
  'ME',
  () => {},
  ({ data }) => ({ profile: data })
);

export const fetchMeWorkflow = () => {
  const fetchPromise = User.fetchMe();
  
  return runAsyncWorkflow({
    fetch: fetchMe,
    receive: receiveMe,
    error: fetchMeError
  }, fetchPromise);
}

export const [
  fetchNotifications,
  receiveNotifications,
  fetchNotificationsError
] = createAsyncActions(
  'FLASH_NOTIFICATIONS',
  () => {},
  () => {}
);

export const fetchNotificationsWorkflow = () => {
  const fetchPromise = User.fetchNotifications();
  
  return runAsyncWorkflow({
    fetch: fetchNotifications,
    receive: receiveNotifications,
    error: fetchNotificationsError
  }, fetchPromise);
}

export const [
  fetchLogout,
  receiveLogout,
  fetchLogoutError
] = createAsyncActions(
  'LOGOUT',
  () => {},
  () => {}
);

export const logoutWorkflow = () => {
  const fetchPromise = User.logout();
  
  return runAsyncWorkflow({
    fetch: fetchLogout,
    receive: receiveLogout,
    error: fetchLogoutError
  }, fetchPromise, {}, false);
}

export const [
  fetchUserLists,
  receiveUserLists,
  fetchUserListsError
] = createAsyncActions(
  'USER_LISTS',
  () => {},
  ({ ok, data }) => ({ lists: data })
);

export const fetchUserListsWorkflow = () => {
  const fetchPromise = User.fetchLists();

  return runAsyncWorkflow({
    fetch: fetchUserLists,
    receive: receiveUserLists,
    error: fetchUserListsError
  }, fetchPromise);
};

export const [
  deleteUserList,
  receiveDeleteUserList,
  deleteUserListError
] = createAsyncActions(
  'DELETE_USER_LIST',
  ({ listId }) => ({ listId }),
  ({ listId }) => ({ listId }),
  'DELETE'
);

export const deleteUserListWorkflow = listId => {
  const deleteUserListPromise = User.deleteList(listId);

  return runAsyncWorkflow(
    {
      fetch: deleteUserList,
      receive: receiveDeleteUserList,
      error: deleteUserListError
    },
    deleteUserListPromise,
    { listId }, 
    false
  );
};

export const [
  fetchChangeLanguage,
  receiveChangeLanguage,
  changeLanguageError
] = createAsyncActions(
  'CHANGE_LANGUAGE',
  () => {},
  ({ newLanguage }) => ({ newLanguage })
)

export const changeLanguage = newLanguage => {
  const changeLanguagePromise = User.changeLanguage(newLanguage)
    .then(() => {
      localStorage.setItem('locale', newLanguage)
      window.location.reload()
    })

  return runAsyncWorkflow(
    {
      fetch: fetchChangeLanguage,
      receive: receiveChangeLanguage,
      error: changeLanguageError
    },
    changeLanguagePromise,
    { newLanguage }
  )
}

export const openAuthModal = createAction('OPEN_AUTH_MODAL')
export const closeAuthModal = createAction('CLOSE_AUTH_MODAL')

export const [
  fetchOfflineChangePopUpStatus,
  receiveOfflineChangePopUpStatus,
  fetchOfflineChangePopUpStatusError
] = createAsyncActions(
  'CHANGE_OFFLINE_POPUP_STATUS',
  () => {},
  () => {}
);

export const changeOfflineBookPopUpStatusWorkflow = () => {
  const changeOfflinePopUpStatusPromise = User.changeOfflinePopUpStatus();

  return runAsyncWorkflow({
    fetch: fetchOfflineChangePopUpStatus,
    receive: receiveOfflineChangePopUpStatus,
    error: fetchOfflineChangePopUpStatusError
  }, changeOfflinePopUpStatusPromise);
};

export const [
  fetchUserFeedbackModalStatus,
  receiveUserFeedbackModalStatus,
  fetchUserFeedbackModalStatusError
] = createAsyncActions(
  'CHANGE_OFFLINE_POPUP_STATUS',
  () => {},
  () => {}
);

export const changeUserFeedbackModalStatusWorkflow = (feedbackType) => {
  const changeUserFeedbackModalStatusPromise = User.changeUserFeedbackModalStatus(feedbackType);

  return runAsyncWorkflow({
    fetch: fetchUserFeedbackModalStatus,
    receive: receiveUserFeedbackModalStatus,
    error: fetchUserFeedbackModalStatusError
  }, changeUserFeedbackModalStatusPromise);
};

export const [
  fetchEmailStatus,
  receiveEmailStatus,
  fetchEmailStatusError
] = createAsyncActions(
  'EMAIL_STATUS',
  () => {},
  () => {}
);

export const fetchEmailStatusWorkflow = (email) => {
  const fetchPromise = User.fetchEmailStatus(email)

  return runAsyncWorkflow({
    fetch: fetchEmailStatus,
    receive: receiveEmailStatus,
    error: fetchEmailStatusError
  }, fetchPromise)
}

export const [
  fetchLogin,
  receiveLogin,
  fetchLoginError
] = createAsyncActions(
  'LOGIN',
  () => {},
  () => {}
);

export const fetchLoginWorkflow = (email, password, rememberMe) => {
  const fetchPromise = User.login(email, password, rememberMe)

  return runAsyncWorkflow({
    fetch: fetchLogin,
    receive: receiveLogin,
    error: fetchLoginError
  }, fetchPromise)
}

export const [
  fetchLanguageOptions,
  receiveLanguageOptions,
  fetchLanguageOptionsError
] = createAsyncActions(
  'LANGUAGE_OPTIONS',
  () => {},
  ({ data }) => ({ queryValues: data.language.queryValues })
);

export const fetchLanguageOptionsWorkflow = () => {
  const fetchPromise = Book.fetchAllFilters()

  return runAsyncWorkflow({
    fetch: fetchLanguageOptions,
    receive: receiveLanguageOptions,
    error: fetchLanguageOptionsError
  }, fetchPromise)
}

export const [
  fetchOrganisationsOptions,
  receiveOrganisationsOptions,
  fetchOrganisationsOptionsError
] = createAsyncActions(
  'ORGANISATIONS_OPTIONS',
  () => {},
  ({ data }) => ({ data: data })
);

export const searchOrganisationsWorkflow = (searchValue) => {
  const fetchPromise = Organisation.search(searchValue)

  return runAsyncWorkflow({
    fetch: fetchOrganisationsOptions,
    receive: receiveOrganisationsOptions,
    error: fetchOrganisationsOptionsError
  }, fetchPromise)
}

export const [
  fetchSignup,
  receiveSignup,
  fetchSignupError
] = createAsyncActions(
  'SIGNUP',
  () => {},
  () => {}
);

export const fetchSignupWorkflow = (details) => {
  const fetchPromise = User.signup(details)

  return runAsyncWorkflow({
    fetch: fetchSignup,
    receive: receiveSignup,
    error: fetchSignupError
  }, fetchPromise)
}

export const [
  fetchForgotPassword,
  receiveForgotPassword,
  fetchForgotPasswordError
] = createAsyncActions(
  'FORGOT_PASSWORD',
  () => {},
  () => {}
)

export const fetchForgotPasswordWorkflow = (email) => {
  const fetchPromise = User.forgotPassword(email)

  return runAsyncWorkflow({
    fetch: fetchForgotPassword,
    receive: receiveForgotPassword,
    error: fetchForgotPasswordError
  }, fetchPromise)
}

export const [
  fetchResetPassword,
  receiveResetPassword,
  fetchResetPasswordError
] = createAsyncActions(
  'RESET_PASSWORD',
  () => {},
  () => {}
)

export const fetchResetPasswordWorkflow = (password, confirmPassword, resetPasswordToken) => {
  const fetchPromise = User.resetPassword(password, confirmPassword, resetPasswordToken)

  return runAsyncWorkflow({
    fetch: fetchResetPassword,
    receive: receiveResetPassword,
    error: fetchResetPasswordError
  }, fetchPromise)
}

export const [
  fetchResendConfirmationLink,
  receiveResendConfirmationLink,
  fetchResendConfirmationLinkError
] = createAsyncActions(
  'RESEND_CONFIRMATION_LINK',
  () => {},
  () => {}
)

export const fetchResendConfirmationLinkWorkflow = (email) => {
  const fetchPromise = User.resendConfirmationLink(email)

  return runAsyncWorkflow({
    fetch: fetchResendConfirmationLink,
    receive: receiveResendConfirmationLink,
    error: fetchResendConfirmationLinkError
  }, fetchPromise)
}

export const [
  fetchEmailConfirmation,
  receiveEmailConfirmation,
  fetchEmailConfirmationError
] = createAsyncActions(
  'EMAIL_CONFIRMATION',
  () => {},
  () => {}
)

export const fetchEmailConfirmationWorkflow = (confirmationToken) => {
  const fetchPromise = User.emailConfirmation(confirmationToken)

  return runAsyncWorkflow({
    fetch: fetchEmailConfirmation,
    receive: receiveEmailConfirmation,
    error: fetchEmailConfirmationError
  }, fetchPromise)
}

export const [
  fetchFacebookAuth,
  receiveFacebookAuth,
  fetchFacebookAuthError
] = createAsyncActions(
  'FACEBOOK_AUTH',
  () => {},
  () => {}
)

export const fetchFacebookAuthWorkflow = (name, email, uid) => {
  const fetchPromise = User.facebookAuth(name, email, uid)

  return runAsyncWorkflow({
    fetch: fetchFacebookAuth,
    receive: receiveFacebookAuth,
    error: fetchFacebookAuthError
  }, fetchPromise)
}

export const [
  fetchGoogleAuth,
  receiveGoogleAuth,
  fetchGoogleAuthError
] = createAsyncActions(
  'GOOGLE_AUTH',
  () => {},
  () => {}
)

export const fetchGoogleAuthWorkflow = (name, email, uid) => {
  const fetchPromise = User.googleAuth(name, email, uid)

  return runAsyncWorkflow({
    fetch: fetchGoogleAuth,
    receive: receiveGoogleAuth,
    error: fetchGoogleAuthError
  }, fetchPromise)
}

export const [
  updateConsent,
  receiveupdateConsent,
  updateConsentError
] = createAsyncActions(
  'UPDATE_USER_CONSENT',
  () => {},
  () => {}
);

export const updateConsentWorkflow = () => {
  const updateConsentPromise = User.updateConsent();

  return runAsyncWorkflow(
    {
      fetch: updateConsent,
      receive: receiveupdateConsent,
      error: updateConsentError
    },
    updateConsentPromise
  );
};