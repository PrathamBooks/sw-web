import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Book from '../Book';
import LoaderBlock from '../LoaderBlock';
import {
  fetchBookWorkflow,
  addBookToListWorkflow,
  removeBookFromListWorkflow,
  postFlagBookWorkflow,
  fetchBookAssetsWorkflow,
  addToEditorsPicksWorkflow,
  removeFromEditorsPicksWorkflow,
  likeBookWorkflow,
  openGlobalBookReader,
  fetchBookDownloadLimitWorkflow,
  postRelevelWorkflow
} from '../../redux/bookActions';
import {
  fetchAllBooksFiltersWorkflow
} from '../../redux/allBooksActions';
import { changeTargetLanguage, fetchFiltersWorkflow, openTranslationModal, fetchCheckTranslationsWorkflow } from '../../redux/translateActions'

import { recordGaEvents, recordBookDownload, recordBookDownloadPopUpOpened, recordBookDownloadPopUpFormOpened } from '../../redux/googleAnalyticsActions';
import { fetchUserListsWorkflow, openAuthModal } from '../../redux/userActions';
import { saveOfflineWorkflow, unsaveOffline, isAvailableOffline } from '../../redux/offlineBooksActions';
import { createReadingListWorkflow } from '../../redux/readingListsActions';
import { addSlimNotification, removeSlimNotification } from '../../redux/slimNotificationActions';
import { addOfflineBookModal } from '../../redux/offlineBookModalAction';
import { links, gaEventCategories, gaEventActions } from '../../lib/constants';
import { getImageSize } from '../../lib/images';

import './BookContainer.scss';

const mapStateToProps = ({ allBooks, book, viewport, user, readingLists, offlineBooks, network, notification, windowDimensions, translate }) => ({
  isFetchingBook: book.isFetchingBook,
  book: book.book,
  isAddingOrRemovingFromList: book.isAddingOrRemovingFromList,
  isFetchingUserLists: user.isFetchingLists,
  userLists: user.lists,
  isLoggedIn: user.isLoggedIn,
  roles: user.profile.roles,
  viewport,
  isFetchingBookAssets: book.isFetchingAssets,
  assets: book.assets,
  isAddingToOrRemovingFromEditorsPicks: book.isAddingToOrRemovingFromEditorsPicks,
  isCreatingReadingList: readingLists.isCreatingReadingList,
  offlineBooks,
  isSavingOffline: offlineBooks.isSavingOffline,
  online: network.online,
  isFlaggingBook: book.isFlaggingBook,
  isFetchingBookDownloadLimit: book.isFetchingBookDownloadLimit,
  userEmail: user.profile.email,
  name: user.profile.name,
  organisation: user.profile.orgName,
  country: user.profile.country,
  offlineBookPopupSeen: user.profile.offlineBookPopupSeen,
  notifications: notification.notifications,
  windowDimensions: windowDimensions,
  isFetchingFilters: allBooks.isFetchingFilters,
  filters: allBooks.filters,
  isReleveling: book.isReleveling,
  isFetchingTranslateFilters: translate.isFetchingFilters,
  translateFilters: translate.filters,
  targetLanguage: translate.targetLanguage,
  isCheckingTranslations: translate.isCheckingTranslations
});

const mapDispatchToProps = {
  postRelevelWorkflow,
  fetchAllBooksFiltersWorkflow,
  fetchBookDownloadLimitWorkflow,
  fetchBookWorkflow,
  fetchUserListsWorkflow,
  addBookToListWorkflow,
  removeBookFromListWorkflow,
  postFlagBookWorkflow,
  fetchBookAssetsWorkflow,
  saveOfflineWorkflow,
  unsaveOffline,
  createReadingListWorkflow,
  addToEditorsPicksWorkflow,
  removeFromEditorsPicksWorkflow,
  likeBookWorkflow,
  openGlobalBookReader,
  openAuthModal,
  addSlimNotification,
  addOfflineBookModal,
  recordGaEvents,
  removeSlimNotification,
  recordBookDownload,
  recordBookDownloadPopUpOpened,
  recordBookDownloadPopUpFormOpened,
  changeTargetLanguage,
  fetchFiltersWorkflow,
  openTranslationModal,
  fetchCheckTranslationsWorkflow
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class BookContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      attributionLoading: false
    }
  }
   componentWillMount() {
    this.props.fetchBookWorkflow(this.props.match.params.slug);
    this.props.fetchUserListsWorkflow();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.slug !== nextProps.match.params.slug) {
      this.props.fetchBookWorkflow(nextProps.match.params.slug);
    }
  }

  onBeforeEditor = (slug, urlCreator) => {
    const { viewport, addSlimNotification, t } = this.props;

    if (viewport.medium) {
      window.location.href = urlCreator(slug)
    } else {
      addSlimNotification({
        id: 'Book.mobile-editor-notification',
        content: t('Book.mobile-editor-notification-text'),
      });
    }
  }

  onTranslateClicked = (slug) => {
    this.onBeforeEditor(slug, links.translateBook);
  }

  onRelevelClicked = (slug) => {
    this.onBeforeEditor(slug, links.relevelBook);
  }

  onEditDraft = () => {
    this.onBeforeEditor(this.props.book.slug, links.editor);
  };

  onEditPublished = () => {
    this.onBeforeEditor(this.props.book.slug, links.editPublishedStory);
  }

  onRelevelModalClosed = () => {
    this.props.fetchBookWorkflow(this.props.match.params.slug);
  }

  onReadClicked = (slug, sectionClicked, isAudio=false) => {
    const {
      fetchBookAssetsWorkflow,
      openGlobalBookReader,
      recordGaEvents,
      userEmail,
      book,
      online
    } = this.props;
    fetchBookAssetsWorkflow(slug)
      .then(openGlobalBookReader({book, showAudioBookReader: isAudio}))

    recordGaEvents({
      eventCategory: gaEventCategories.book,
      eventAction: isAudio ? gaEventActions.listened : gaEventActions.read,
      userEmail: userEmail,
      dimension2: book.level,
      dimension3: book.language,
      dimension4: online ? 'Online' : 'Offline' ,
      dimension5: book.slug,
      metric1: 1,
      eventLabel: sectionClicked
    })
  }

  onLastPageClicked = () => {
    const {
      openGlobalBookReader,
      book,
      fetchBookAssetsWorkflow } = this.props;
      this.setState({ attributionLoading : true })
       fetchBookAssetsWorkflow(book.slug)
      .then(response => {
        if ( response ) {
          openGlobalBookReader({ book, showAttributionPage : true  })
          this.setState({ attributionLoading : false })
        }
      })
    }

  onLikeClicked = (slug) => {
    const {
      likeBookWorkflow,
      userEmail,
      book,
      online,
      recordGaEvents
    } = this.props;
    likeBookWorkflow(slug);

    recordGaEvents({
      eventCategory: gaEventCategories.book,
      eventAction: gaEventActions.liked,
      userEmail: userEmail,
      dimension2: book.level,
      dimension3: book.language,
      dimension4: online ? 'Online' : 'Offline' ,
      dimension5: book.slug
    });
  }

  render() {
    const {
      isFetchingBook,
      book,
      isLoggedIn,
      isFetchingUserLists,
      isAddingOrRemovingFromList,
      userLists,
      viewport,
      addBookToListWorkflow,
      removeBookFromListWorkflow,
      postFlagBookWorkflow,
      isFetchingBookAssets,
      assets,
      saveOfflineWorkflow,
      createReadingListWorkflow,
      roles,
      addToEditorsPicksWorkflow,
      removeFromEditorsPicksWorkflow,
      isAddingToOrRemovingFromEditorsPicks,
      isCreatingReadingList,
      offlineBooks,
      unsaveOffline,
      online,
      isFlaggingBook,
      isSavingOffline,
      openAuthModal,
      addSlimNotification,
      addOfflineBookModal,
      userEmail,
      name,
      organisation,
      country,
      offlineBookPopupSeen,
      recordGaEvents,
      notifications,
      removeSlimNotification,
      recordBookshelfAdd,
      recordBookshelfDelete,
      recordBookDownload,
      recordBookDownloadPopUpOpened,
      recordBookDownloadPopUpFormOpened,
      windowDimensions,
      isFetchingBookDownloadLimit,
      fetchBookDownloadLimitWorkflow,
      isFetchingFilters,
      filters,
      fetchAllBooksFiltersWorkflow,
      postRelevelWorkflow,
      isReleveling,
      isFetchingTranslateFilters,
      fetchFiltersWorkflow,
      translateFilters,
      targetLanguage,
      changeTargetLanguage,
      openTranslationModal,
      isCheckingTranslations,
      fetchCheckTranslationsWorkflow
    } = this.props;

    if (isFetchingBook || !book) {
      return <LoaderBlock />;
    }

    const isFlaggingCurrentBook = isFlaggingBook[book.slug];

    return (
      <Book
        book={book}
        isLoggedIn={isLoggedIn}
        isFetchingUserLists={isFetchingUserLists}
        userLists={userLists}
        isAddingOrRemovingFromList={isAddingOrRemovingFromList}
        viewport={viewport}
        onAddToList={addBookToListWorkflow}
        onRemoveFromList={removeBookFromListWorkflow}
        onFlagClicked={postFlagBookWorkflow}
        onReadClicked={this.onReadClicked}
        isFetchingAssets={isFetchingBookAssets}
        assets={assets}
        availableOffline={isAvailableOffline(book.id, offlineBooks)}
        offlineBooksCount={offlineBooks.books.length}
        onClickAddToOffline={saveOfflineWorkflow.bind(this, book, getImageSize(windowDimensions.width))}
        onClickRemoveFromOffline={unsaveOffline.bind(this, book.id)}
        onEdit={book.status === "published" ? this.onEditPublished : this.onEditDraft}
        online={online}
        onCreateList={createReadingListWorkflow}
        roles={roles}
        onAddToEditorsPicks={addToEditorsPicksWorkflow}
        onRemoveFromEditorsPicks={removeFromEditorsPicksWorkflow}
        isAddingToOrRemovingFromEditorsPicks={isAddingToOrRemovingFromEditorsPicks}
        isCreatingReadingList={isCreatingReadingList}
        onLikeClicked={this.onLikeClicked}
        isFlaggingBook={isFlaggingCurrentBook}
        isSavingOffline={isSavingOffline}
        openAuthModal={openAuthModal}
        addSlimNotification={addSlimNotification}
        onTranslateClicked={this.onTranslateClicked}
        onRelevelClicked={this.onRelevelClicked}
        onLastPageClicked={this.onLastPageClicked}
        addOfflineBookModal={addOfflineBookModal}
        userEmail={userEmail}
        name={name}
        attributionLoading={this.state.attributionLoading}
        organisation={organisation}
        country={country}
        offlineBookPopupSeen={offlineBookPopupSeen}
        recordGaEvents={recordGaEvents}
        notifications={notifications}
        removeSlimNotification={removeSlimNotification}
        recordBookshelfAdd={recordBookshelfAdd}
        recordBookshelfDelete={recordBookshelfDelete}
        recordBookDownload={recordBookDownload}
        recordBookDownloadPopUpOpened={recordBookDownloadPopUpOpened}
        recordBookDownloadPopUpFormOpened={recordBookDownloadPopUpFormOpened}
        isFetchingBookDownloadLimit={isFetchingBookDownloadLimit}
        fetchBookDownloadLimitWorkflow={fetchBookDownloadLimitWorkflow}
        isFetchingFilters={isFetchingFilters}
        filters={filters}
        fetchAllBooksFiltersWorkflow={fetchAllBooksFiltersWorkflow}
        postRelevelWorkflow={postRelevelWorkflow}
        isReleveling={isReleveling}
        onRelevelModalClosed={this.onRelevelModalClosed}
        isFetchingTranslateFilters={isFetchingTranslateFilters}
        fetchFiltersWorkflow={fetchFiltersWorkflow}
        translateFilters={translateFilters}
        targetLanguage={targetLanguage}
        changeTargetLanguage={changeTargetLanguage}
        openTranslationModal={openTranslationModal}
        isCheckingTranslations={isCheckingTranslations}
        fetchCheckTranslationsWorkflow={fetchCheckTranslationsWorkflow}
      />
    );
  }
}

BookContainer.propTypes = {
  fetchBookWorkflow: PropTypes.func.isRequired
};

export default BookContainer;
