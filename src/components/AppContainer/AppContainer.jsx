import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { initViewport } from '../../redux/viewportActions';
import { initNetwork } from '../../redux/networkActions';
import { fetchMeWorkflow, logoutWorkflow, openAuthModal, fetchNotificationsWorkflow } from '../../redux/userActions'
import { submitStoryNotice} from '../../redux/homeActions'
import { subscribeWorkflow } from '../../redux/newsletterActions';
import { changeLanguage, updateConsentWorkflow } from '../../redux/userActions';
import {
  fetchNextReadBooksWorkflow,
  fetchNextTranslationBooksWorkflow,
  fetchBookAssetsWorkflow,
  openGlobalBookReader,
  closeGlobalBookReader, 
  closeGlobalQuickView,
  openNextReadSuggestions,
  closeNextReadSuggestions,
  postFlagBookWorkflow,
  postSmileyRatingWorkflow,
  fetchBookWorkflow,
  fetchSmileyRatingBookWorkflow } from '../../redux/bookActions';
import { closeNextTranslationSuggestions} from '../../redux/nextTranslationActions';
import { addNotification } from '../../redux/notificationActions';
import { addSlimNotification } from '../../redux/slimNotificationActions';
import { addSmileyRatingModal, removeSmileyRatingModal } from '../../redux/smileyRatingModalActions';
import { recordLocalization, recordBookReadCompleted, recordGaEvents} from '../../redux/googleAnalyticsActions';
import { changeTargetLanguage, fetchFiltersWorkflow, closeTranslationModal, fetchCheckTranslationsWorkflow} from '../../redux/translateActions';

import { gaEventCategories, gaEventActions} from '../../lib/constants';

import { translate } from 'react-polyglot';
import { onWindowSizeChange } from '../../redux/windowSizeActions';


import './AppContainer.scss';

import SiteHeader from '../SiteHeader';
import SiteFooter from '../SiteFooter';
import NotificationContainer from '../NotificationContainer';
import SlimNotificationContainer from '../SlimNotificationContainer';
import BookReaderModal from '../BookReaderModal';
import QuickViewModal from '../QuickViewModal';
import AuthModalContainer from '../AuthModalContainer';
import OfflineBookModal from '../OfflineBookModal';
import UserFeedbackModal from '../UserFeedbackModal';
import TranslationModal from '../TranslationModal';
import NotificationModal from '../NotificationModal';
import NextReadModal from '../NextReadModal';
import NextTranslationModal from '../NextTranslationModal';
import SmileyRatingModal from '../SmileyRatingModal';

const mapStateToProps = state => {
  return {
    viewport: state.viewport,
    isLoggedIn: state.user.isLoggedIn,
    profile: state.user.profile,
    isFetchingMe: state.user.isFetchingMe,
    isConsentGiven: state.user.isConsentGiven,
    isSubscribed: state.newsletter.isSubscribed,
    isFetchingSubscribe: state.newsletter.isFetchingSubscribe,
    online: state.network.online,
    bookAssets: state.book.assets,
    currentGlobalBookReaderSlug: state.book.currentGlobalBookReaderSlug,
    smileyRatingBook: state.book.smileyRatingBook,
    isFetchingSmileyRatingBook: state.book.isFetchingSmileyRatingBook,
    isGlobalBookReaderVisible: state.book.isGlobalBookReaderVisible,
    isGlobalNextReadSuggestionsVisible: state.book.isGlobalNextReadSuggestionsVisible,
    nextTranslationBooks: state.book.nextTranslationBooks,
    isGlobalNextTranslationSuggestionsVisible: state.nextTranslation.isGlobalNextTranslationSuggestionsVisible,
    showAudioBookReader: state.book.showAudioBookReader,
    showAttributionPage: state.book.showAttributionPage,
    globalBookReaderStartPage: state.book.globalBookReaderStartPage,
    isGlobalQuickViewVisible: state.book.isGlobalQuickViewVisible,
    currentGlobalQuickViewBook: state.book.currentGlobalQuickViewBook,
    stage: state.user.stage,
    isOfflineBookModalVisible: state.offlineBookModal.isofflineModalVisible,
    isUserFeedbackModalVisible: state.userFeedbackModal.isUserFeedbackModalVisible,
    isNotificationModalVisible: state.notificationModal.isNotificationModalVisible,
    windowDimensions: state.windowDimensions,
    isFetchingBookAssets: state.book.isFetchingAssets,
    nextReadBooks: state.book.nextReadBooks,
    currentGlobalBookReaderBook: state.book.currentGlobalBookReaderBook,
    isSmileyRatingModalVisible: state.smileyRatingModal.isSmileyRatingModalVisible,
    showAudioBookReaderOnBack: state.smileyRatingModal.showAudioBookReaderOnBack,
    book: state.book.book,
    isFlaggingBook: state.book.isFlaggingBook,
    isSubmittingSmileyRating: state.book.isSubmittingSmileyRating,
    isFetchingNextReadBooks: state.book.isFetchingNextReadBooks,
    isGlobalTranslationModalVisible: state.translate.isGlobalTranslationModalVisible,
    currentGlobalTranslationModalBook: state.translate.currentGlobalTranslationModalBook,
    translateTargetLanguage: state.translate.targetLanguage,
    isFetchingTranslateFilters: state.translate.isFetchingFilters,
    translateFilters: state.translate.filters,
    availableTranslations: state.translate.availableTranslations,
    isCheckingTranslations: state.translate.isCheckingTranslations,
    openTranslateTabLink: state.translate.openTranslateTabLink,
    isFetchingNextTranslationBooks: state.book.isFetchingNextTranslationBooks,
    nextSuggestionsType: state.nextTranslation.nextSuggestionsType,
    translateToLanguage: state.nextTranslation.translateToLanguage
  }
}

const mapDispatchToProps = {
  onWindowSizeChange,
  initViewport,
  initNetwork,
  fetchMeWorkflow,
  submitStoryNotice,
  logoutWorkflow,
  updateConsentWorkflow,
  subscribeWorkflow,
  changeLanguage,
  closeGlobalBookReader,
  closeGlobalQuickView,
  fetchBookAssetsWorkflow,
  fetchNextReadBooksWorkflow,
  openGlobalBookReader,
  openNextReadSuggestions,
  closeNextReadSuggestions,
  closeNextTranslationSuggestions,
  fetchNextTranslationBooksWorkflow,
  openAuthModal,
  addNotification,
  addSlimNotification,
  addSmileyRatingModal,
  postFlagBookWorkflow,
  postSmileyRatingWorkflow,
  fetchSmileyRatingBookWorkflow,
  fetchBookWorkflow,
  removeSmileyRatingModal,
  recordLocalization,
  recordBookReadCompleted,
  recordGaEvents,
  fetchNotificationsWorkflow,
  closeTranslationModal,
  fetchFiltersWorkflow,
  changeTargetLanguage,
  fetchCheckTranslationsWorkflow
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class AppContainer extends Component {
  static defaultProps = {
    chromeless: false
  }

  componentWillMount() {
    const {
      fetchNotificationsWorkflow,
      addSlimNotification
    } = this.props;
    fetchNotificationsWorkflow().then((response) => {

      if(response.flashMessages) {
        const flashMessages = response.flashMessages;
        if (flashMessages['success']) {
          addSlimNotification({
            type: 'success',
            content: flashMessages['success']
          })
        }
        else if (flashMessages['error']) {
          addSlimNotification({
            type: 'danger',
            content: flashMessages['error']
          })
        }
        else if (flashMessages['alert']) {
          //TODO: This needs to be changed to warning state after warning state is added to SlimNotification
          addSlimNotification({
            type: 'danger',
            content: flashMessages['alert']
          })
        }
        else {
          addSlimNotification({
            //'Info' is the default state for any other type of flash messages ex. notice, etc
            content: flashMessages['notice']
          })
        }
      }
    });
  }

  componentDidMount() {
    const {
      initViewport,
      initNetwork,
      fetchMeWorkflow,
      addSlimNotification,
      submitStoryNotice,
      onWindowSizeChange,
      t
    } = this.props;
    window.addEventListener('resize', onWindowSizeChange);
    initViewport();
    initNetwork();
    fetchMeWorkflow().then((response) => {
      if(response.meta && response.meta.contestStoryNotice){
        addSlimNotification({
          content: t("Contest.notification-text")
        })
        submitStoryNotice();
      }
    });
  }

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

  componentWillUnmount() {
    window.removeEventListener('resize', this.props.onWindowSizeChange);
  }

  onReadClicked = (book, sectionClicked) => {
    const {
      fetchBookAssetsWorkflow,
      fetchNextReadBooksWorkflow,
      openGlobalBookReader,
      closeNextReadSuggestions,
      recordGaEvents,
      profile,
      online
    } = this.props;
      fetchBookAssetsWorkflow(book.slug)
      .then(openGlobalBookReader({book}))
      .then(closeNextReadSuggestions)
      .then(() => fetchNextReadBooksWorkflow(book.slug));
    recordGaEvents({
      eventCategory: gaEventCategories.book,
      eventAction: gaEventActions.read,
      userEmail: profile.email,
      dimension2: book.level,
      dimension3: book.language,
      dimension4: online ? 'Online' : 'Offline',
      dimension5: book.slug,
      metric1: 1,
      eventLabel: sectionClicked
    });
  };

  onNextReadModalCloseClicked = () => {
    const {
      profile,
      closeNextReadSuggestions,
      recordGaEvents
    } = this.props;
    
    recordGaEvents({
        userEmail: profile.email,  
        eventCategory: gaEventCategories.nextReadSuggestion,
        eventAction: gaEventActions.closed,
      });
    closeNextReadSuggestions();   
  }

  render() {
    const baseClassName = 'pb-app';
    const {
      viewport,
      chromeless,
      isLoggedIn,
      profile,
      logoutWorkflow,
      isFetchingMe,
      isConsentGiven,
      updateConsentWorkflow,
      isSubscribed,
      isFetchingSubscribe,
      subscribeWorkflow,
      online,
      bookAssets,
      isGlobalBookReaderVisible,
      closeGlobalBookReader,
      isGlobalNextReadSuggestionsVisible,
      closeNextTranslationSuggestions,
      isGlobalNextTranslationSuggestionsVisible,
      nextTranslationBooks,
      isFetchingBookAssets,
      openNextReadSuggestions,
      isGlobalQuickViewVisible,
      currentGlobalQuickViewBook,
      closeGlobalQuickView,
      openAuthModal,
      stage,
      globalBookReaderStartPage,
      addNotification,
      addSlimNotification,
      isOfflineBookModalVisible,
      isUserFeedbackModalVisible,
      isNotificationModalVisible,
      isSmileyRatingModalVisible,
      addSmileyRatingModal,
      isFlaggingBook,
      closeNextReadSuggestions,
      postFlagBookWorkflow,
      postSmileyRatingWorkflow,
      fetchBookWorkflow,
      removeSmileyRatingModal,
      openGlobalBookReader,
      book,
      recordBookReadCompleted,
      windowDimensions,
      nextReadBooks,
      currentGlobalBookReaderBook,
      showAudioBookReader,
      showAttributionPage,
      recordGaEvents,
      fetchBookAssetsWorkflow,
      isSubmittingSmileyRating,
      smileyRatingBook,
      currentGlobalBookReaderSlug,
      fetchSmileyRatingBookWorkflow,
      isFetchingSmileyRatingBook,
      fetchNextReadBooksWorkflow,
      isFetchingNextReadBooks,
      showAudioBookReaderOnBack,
      isGlobalTranslationModalVisible,
      currentGlobalTranslationModalBook,
      closeTranslationModal,
      translateTargetLanguage,
      changeTargetLanguage,
      fetchFiltersWorkflow,
      isFetchingTranslateFilters,
      translateFilters,
      fetchCheckTranslationsWorkflow,
      availableTranslations,
      isCheckingTranslations,
      openTranslateTabLink,
      isFetchingNextTranslationBooks,
      nextSuggestionsType,
      translateToLanguage
    } = this.props;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--fill-height`]: !chromeless
    };

    return (
      <div className={classNames(classes)}>
        {
          chromeless
          ?
          null
          :
          <SiteHeader
            viewport={viewport}
            isLoggedIn={isLoggedIn}
            user={profile}
            logout={logoutWorkflow}
            isFetchingMe={isFetchingMe}
            offline={!online}
            openAuthModal={() => openAuthModal()}
            addNotification={addNotification}
            addSlimNotification={addSlimNotification}
          />
        }
        {chromeless ? null : <NotificationContainer /> }
        {chromeless ? null : <SlimNotificationContainer /> }
        <div className={`${baseClassName}__content`}>{this.props.children}</div>
        {
          chromeless
          ?
          null
          :
          <SiteFooter
            isLoggedIn={isLoggedIn}
            isFetchingMe={isFetchingMe}
            isConsentGiven={isConsentGiven}
            updateConsent={updateConsentWorkflow}
            isSubscribed={isSubscribed}
            isFetchingSubscribe={isFetchingSubscribe}
            subscribe={subscribeWorkflow}
            shouldShowLanguageSelector={true}
            offline={!online}
            changeLanguage={this.onChangeLanguage}
          />
        }
        {
          isGlobalNextTranslationSuggestionsVisible
            ?
            <NextTranslationModal
              onCloseClicked={() => closeNextTranslationSuggestions()} nextTranslationBooks={nextTranslationBooks}
              viewport={viewport}
              translateToLanguage={translateToLanguage}
              nextSuggestionsType={nextSuggestionsType}
              isFetchingNextTranslationBooks={isFetchingNextTranslationBooks}
              />
            :
            null
        }
        {
          isGlobalBookReaderVisible
          ?
          <BookReaderModal
            showAttributionPage={showAttributionPage}
            startPage={globalBookReaderStartPage}
            onCloseClicked={() => closeGlobalBookReader()}
            viewport={viewport}
            assets={bookAssets}
            offline={!online}
            userEmail={profile.email}
            userRoles={profile.roles}
            book={currentGlobalBookReaderBook}
            recordBookReadCompleted={recordBookReadCompleted}
            recordGaEvents={recordGaEvents}
            windowDimensions={windowDimensions}
            openNextReadSuggestions={openNextReadSuggestions}
            showAudioBookReader={showAudioBookReader}
            addSmileyRatingModal={addSmileyRatingModal}
            slug={currentGlobalBookReaderSlug}
            fetchSmileyRatingBook={fetchSmileyRatingBookWorkflow}
            addSlimNotification={addSlimNotification}
          />
          :
          null
        }
        {
          isGlobalNextReadSuggestionsVisible && online
          ?
          <NextReadModal
            onCloseClicked={this.onNextReadModalCloseClicked}
            onReadClicked={this.onReadClicked}
            nextReadBooks={nextReadBooks}
            isFetchingBookAssets={isFetchingBookAssets}
            viewport={viewport}
          />
          :
          null
        }
        {
          isGlobalQuickViewVisible
          ?
          <QuickViewModal
            viewport={viewport}
            book={currentGlobalQuickViewBook}
            onCloseClicked={() => closeGlobalQuickView()}
          />
          :
          null
        }
        <AuthModalContainer stage={stage} />
        {
          isOfflineBookModalVisible
          ?
          <OfflineBookModal />
          :
          null
        }

        {
          isUserFeedbackModalVisible
          ?
          <UserFeedbackModal />
          :
          null
        }

        {
          isNotificationModalVisible
          ?
          <NotificationModal />
          :
          null
        }

        {
          isSmileyRatingModalVisible
          ?
          <SmileyRatingModal
            isVisible={isSmileyRatingModalVisible}
            slug={currentGlobalBookReaderSlug}
            currentBookSlug={book ? book.slug : null}
            isFetchingNextReadBooks={isFetchingNextReadBooks}
            book={smileyRatingBook}
            isLoggedIn={isLoggedIn}
            isFetchingSmileyRatingBook={isFetchingSmileyRatingBook}
            isFlaggingBook={isFlaggingBook}
            viewport={viewport}
            userRoles={profile.roles}
            lastStoryPage={smileyRatingBook.lastPagePosition}
            openGlobalBookReader={openGlobalBookReader}
            openNextReadSuggestions={openNextReadSuggestions}
            closeNextReadSuggestions={closeNextReadSuggestions}
            postFlagBookWorkflow={postFlagBookWorkflow}
            postSmileyRatingWorkflow={postSmileyRatingWorkflow}
            fetchBookWorkflow={fetchBookWorkflow}
            removeSmileyRatingModal={removeSmileyRatingModal}
            recordGaEvents={recordGaEvents}
            userEmail={profile.email}
            fetchBookAssetsWorkflow={fetchBookAssetsWorkflow}
            isSubmittingSmileyRating={isSubmittingSmileyRating}
            fetchNextReadBooksWorkflow={fetchNextReadBooksWorkflow}
            showAudioBookReaderOnBack={showAudioBookReaderOnBack}
            />
          :
          null
        }

        {
          isGlobalTranslationModalVisible && !chromeless
          ?
          <TranslationModal
            isVisible={isGlobalTranslationModalVisible}
            book={currentGlobalTranslationModalBook}
            closeTranslationModal={closeTranslationModal}
            translateTargetLanguage={translateTargetLanguage}
            viewport={viewport}
            changeTargetLanguage={changeTargetLanguage}
            fetchFiltersWorkflow={fetchFiltersWorkflow}
            isFetchingTranslateFilters={isFetchingTranslateFilters}
            translateFilters={translateFilters}
            addSlimNotification={addSlimNotification}
            fetchCheckTranslationsWorkflow={fetchCheckTranslationsWorkflow}
            availableTranslations={availableTranslations}
            isCheckingTranslations={isCheckingTranslations}
            openTranslateTabLink={openTranslateTabLink}
            />
          :
          null
        }
      </div>
    );
  }
}

AppContainer.propTypes = {
  chromeless: PropTypes.bool
};

export default AppContainer;
