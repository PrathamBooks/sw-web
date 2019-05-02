import { LOCATION_CHANGE } from 'react-router-redux';
import { ADD_OFFLINE_BOOK_MODAL, OFFLINE_BOOK_MODAL_CLICKED } from './offlineBookModalAction';
import { ADD_USER_FEEDBACK_MODAL, USER_FEEDBACK_MODAL_CLICKED } from './userFeedbackModalAction';
import { GA_GENERIC,
         GA_LOCALIZATION,
         GA_BOOK_READ_COMPLETED,
         GA_BOOK_DOWNLOAD,
         GA_BOOK_DOWNLOAD_POPUP_OPENED,
         GA_BOOK_DOWNLOAD_POPUP_FORM_OPENED,   
         GA_ILLUSTRATION_DOWNLOAD, } from './googleAnalyticsActions';

/*
Configured in StoryWeaver google analytics,

Custom Dimensions ->
dimension1: 'User email',
dimension2: 'Story level',
dimension3: 'Story language',
dimension4: 'Mode', // dimensionValues -> Online/Offline
dimension5: 'Story Slug',
dimension6: 'Category of the List'

Custom Metrics ->
metric1: 'Total Reads',
metric2: 'Offline Books', // metricValue will be +1/-1 for Add/Delete book from Offline 
metric3: 'Shares',
metric4: 'Books Downloaded',
metric5: 'Readalong Time Duration'

*/

const googleAnalyticsMiddleware = store => next => action => {
  if (window.ga) {
    switch(action.type) {
      case LOCATION_CHANGE:
        //In react-router-redux, pathname contains Url path without search params,
        // so sending path along with search query so that its tracked in Site Search
        window.ga('set', 'page', `${action.payload.pathname}${action.payload.search}`);
        window.ga('send', 'pageview');
        break;
      case ADD_OFFLINE_BOOK_MODAL:
        window.ga('send', 'event', 'OfflineBookModal', 'OfflineBookModalOpened', action.payload);
        break;
      case OFFLINE_BOOK_MODAL_CLICKED:
        window.ga('send', 'event', 'OfflineBookModal', 'OfflineBookModalClicked', action.payload);
        break;
      case ADD_USER_FEEDBACK_MODAL:
        window.ga('send', {
          hitType:'event',
          eventCategory: action.payload.feedbackType,
          eventAction: `${action.payload.feedbackType}Opened`,
          eventLabel: action.payload.eventLabel,
          dimension1: action.payload.userEmail,
        });
        break;
      case USER_FEEDBACK_MODAL_CLICKED:
        window.ga('send', {
          hitType:'event',
          eventCategory: action.payload.feedbackType,
          eventAction: `${action.payload.feedbackType}FormOpened`,
          eventLabel: action.payload.eventLabel,
          dimension1: action.payload.userEmail, 
        });
        break;
      case GA_BOOK_READ_COMPLETED:
        window.ga('send', {
          hitType:'event',
          eventCategory: 'Book',
          eventAction: 'Read Completed',
          dimension1: action.payload.userEmail, 
          dimension2: action.payload.level,
          dimension3: action.payload.language,
          dimension4: action.payload.offline ? 'Offline' : 'Online' ,
          dimension5: action.payload.slug
        });
        break;
      case GA_GENERIC:
        window.ga('send', {
          hitType:'event',
          eventCategory: action.payload.eventCategory,
          eventAction: action.payload.eventAction,
          eventLabel: action.payload.eventLabel,
          dimension1: action.payload.userEmail || 'User',
          dimension2: action.payload.dimension2,
          dimension3: action.payload.dimension3,
          dimension4: action.payload.dimension4 || 'Online',
          dimension5: action.payload.dimension5,
          dimension6: action.payload.dimension6,
          metric1: action.payload.metric1,
          metric2: action.payload.metric2,
          metric3: action.payload.metric3,
          metric4: action.payload.metric4,
          metric5: action.payload.metric5
        });
        break;
      case GA_LOCALIZATION:
        window.ga('send', {
          hitType:'event',
          eventCategory: 'Localization',
          eventAction: 'Language Change',
          dimension1: action.payload.userEmail,
          eventLabel: action.payload.newLanguage
        });
        break;
      case GA_BOOK_DOWNLOAD:
        window.ga('send', {
          hitType:'event',
          eventCategory: 'Book',
          eventAction: 'Download',
          dimension1: action.payload.userEmail,
          dimension2: action.payload.level,
          dimension3: action.payload.language,
          dimension5: action.payload.slug,
          metric4: 1 //increment the book download count
        });
        break;
      case GA_BOOK_DOWNLOAD_POPUP_OPENED:
        window.ga('send', {
          hitType:'event',
          eventCategory: 'Book',
          eventAction: 'Download PopUp Opened',
          dimension1: action.payload.userEmail,
          dimension2: action.payload.level,
          dimension3: action.payload.language,
          dimension5: action.payload.slug
        });
        break;
      case GA_BOOK_DOWNLOAD_POPUP_FORM_OPENED:
        window.ga('send', {
          hitType:'event',
          eventCategory: 'Book',
          eventAction: 'Download PopUp Form Link Opened',
          dimension1: action.payload.userEmail,
          dimension2: action.payload.book.level,
          dimension3: action.payload.book.language,
          dimension5: action.payload.book.slug
        });
        break;
      case GA_ILLUSTRATION_DOWNLOAD:
        window.ga('send', {
          hitType:'event',
          eventCategory: 'Illustration',
          eventAction: 'Download',
          dimension1: action.payload.userEmail,
          dimension5: action.payload.slug,
          eventLabel: action.payload.resolution
        });
        break;
      default :
        break;
    }
  }
  return next(action);
};

export default googleAnalyticsMiddleware;
