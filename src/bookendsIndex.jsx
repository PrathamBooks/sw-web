import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import { I18n } from 'react-polyglot';

import locales from './i18n';

import viewportReducer from './redux/viewportReducer';
import userReducer from './redux/userReducer';
import newsletterReducer from './redux/newsletterReducer';
import allFiltersReducer from './redux/allFiltersReducer';

import { initViewport } from './redux/viewportActions';
// openAuthModal passed to SiteHeader for opening sign in modal
import { fetchMeWorkflow, logoutWorkflow, openAuthModal, updateConsentWorkflow } from './redux/userActions';
import { subscribeWorkflow } from './redux/newsletterActions';
import { changeLanguage } from './redux/userActions';
import { recordLocalization } from './redux/googleAnalyticsActions';
import googleAnalyticsMiddleware from './redux/googleAnalyticsMiddleware';
//import initGoogleAnalytics from './lib/googleAnalytics';
import { CookiesProvider } from 'react-cookie';

import './scss/_bookends.scss'

import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import AuthModalContainer from './components/AuthModalContainer'

const mapStateToProps = state => {
  return {
    viewport: state.viewport,
    isLoggedIn: state.user.isLoggedIn,
    isConsentGiven: state.user.isConsentGiven,
    profile: state.user.profile,
    isFetchingMe: state.user.isFetchingMe,
    isSubscribed: state.newsletter.isSubscribed,
    isFetchingSubscribe: state.newsletter.isFetchingSubscribe,
    allFilters: state.allFilters
  }
}

@connect(mapStateToProps, { initViewport, logoutWorkflow, openAuthModal, changeLanguage, updateConsentWorkflow, fetchMeWorkflow })
export class SiteHeaderContainer extends Component {
  componentDidMount() {
    this.props.initViewport()
    this.props.fetchMeWorkflow()
  }
  render() {
    const { isLoggedIn, profile, logoutWorkflow, isFetchingMe, openAuthModal } = this.props
    return (
      <div className="pb-body">
        <SiteHeader viewport={this.props.viewport} isLoggedIn={isLoggedIn} openAuthModal = {() => openAuthModal()}
         user={profile} logout={logoutWorkflow} isFetchingMe={isFetchingMe} />
      </div>
    );
  }
}

@connect(mapStateToProps, { initViewport, subscribeWorkflow, recordLocalization, changeLanguage, updateConsentWorkflow })
export class SiteFooterContainer extends Component {
  onChangeLanguage = (newLanguage) => {
    const {
      profile,
      changeLanguage,
      recordLocalization
    } = this.props;

    changeLanguage(newLanguage).then(
      () => recordLocalization({userEmail: profile.email, newLanguage: newLanguage})
    );

  }
  render() {
    const { isLoggedIn, isFetchingMe, isSubscribed, isFetchingSubscribe, subscribeWorkflow, isConsentGiven, updateConsentWorkflow } = this.props
    return (
      <div className="pb-body">
        <SiteFooter
          isLoggedIn={isLoggedIn}
          isFetchingMe={isFetchingMe}
          isConsentGiven={isConsentGiven}
          updateConsent={updateConsentWorkflow}
          isSubscribed={isSubscribed}
          isFetchingSubscribe={isFetchingSubscribe}
          subscribe={subscribeWorkflow}
          shouldShowLanguageSelector={true}
          changeLanguage={this.onChangeLanguage}
        />
      </div>
    );
  }
}

const middleware = [thunk];

const preloadedState = window.INITIAL_STATE;

// if (process.env.REACT_APP_GA_PROPERTY_ID) {
//   initGoogleAnalytics(process.env.REACT_APP_GA_PROPERTY_ID);
//   middleware.push(googleAnalyticsMiddleware);
// }

middleware.push(googleAnalyticsMiddleware);


const store = createStore(
  combineReducers({
    viewport: viewportReducer,
    user: userReducer,
    newsletter: newsletterReducer,
    allFilters: allFiltersReducer
  }),
  preloadedState,
  applyMiddleware(...middleware)
);

const locale = localStorage.getItem('locale') || 'en';
const messages = locales[locale];

ReactDOM.render(
  <Provider store={store}>
    <I18n locale={locale} messages={messages}>
      <SiteHeaderContainer />
    </I18n>
  </Provider>,
  document.getElementById('header')
);

ReactDOM.render(
  <CookiesProvider>
    <Provider store={store}>
      <I18n locale={locale} messages={messages}>
        <SiteFooterContainer />
      </I18n>
    </Provider>
  </CookiesProvider>,
  document.getElementById('footer')
);

ReactDOM.render(
  <Provider store={store}>
    <I18n locale={locale} messages={messages}>
      <AuthModalContainer />
    </I18n>
  </Provider>,
  document.getElementById('auth-modal')
)
