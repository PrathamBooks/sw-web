import React from 'react';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk';
import { I18n } from 'react-polyglot';
import { configure, addDecorator } from '@storybook/react';
import createHistory from 'history/createBrowserHistory';

import locales from '../src/i18n';

import viewportReducer from '../src/redux/viewportReducer';
import userReducer from '../src/redux/userReducer';
import newsletterReducer from '../src/redux/newsletterReducer';
import networkReducer from '../src/redux/networkReducer';
import bookReducer from '../src/redux/bookReducer';
import offlineBookModalReducer from '../src/redux/offlineBookModalReducer';
import offlineBooksReducer from '../src/redux/offlineBooksReducer';
import allFiltersReducer from '../src/redux/allFiltersReducer';
import userFeedbackModalReducer from '../src/redux/userFeedbackModalReducer';
import slimNotificationReducer from '../src/redux/slimNotificationReducer';
import notificationModalReducer from '../src/redux/notificationModalReducer';
import notificationReducer from '../src/redux/notificationReducer';
import smileyRatingModalReducer from '../src/redux/smileyRatingModalReducer';


import AppContainer from '../src/components/AppContainer/AppContainer';

const history = createHistory();
const middleware = [thunk, routerMiddleware(history)];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({
    router: routerReducer,
    viewport: viewportReducer,
    user: userReducer,
    newsletter: newsletterReducer,
    network: networkReducer,
    book: bookReducer,
    offlineBookModal: offlineBookModalReducer,
    allFilters: allFiltersReducer,
    userFeedbackModal: userFeedbackModalReducer,
    slimNotification: slimNotificationReducer,
    notificationModal: notificationModalReducer,
    notification: notificationReducer,
    offlineBooks: offlineBooksReducer,
    smileyRatingModal: smileyRatingModalReducer,
  }),
  composeEnhancers(applyMiddleware(...middleware))
);

const locale = localStorage.getItem('locale') || 'en';
const messages = locales[locale];

const StyleDecorator = function StyleDecorator(storyFn) {
  return React.createElement(
    Provider,
    { store: store },
    React.createElement(
      ConnectedRouter,
      { history: history},
      React.createElement(
        I18n,
        { locale: locale, messages: messages },
        React.createElement(
          AppContainer,
          { chromeless: true },
          storyFn()
        )
      )
    )
  );
};

addDecorator(StyleDecorator);

const req = require.context('../src/components/', true, /\.stories\.js$/)

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
