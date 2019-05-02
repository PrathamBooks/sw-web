import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Prompt } from 'react-router-dom';
import u from 'updeep';
import cloneDeep from 'lodash/cloneDeep';
import pick from 'lodash/pick';
import { translate } from 'react-polyglot';

import ReadingList from '../ReadingList';
import LoaderBlock from '../LoaderBlock';
import ConfirmModal from '../ConfirmModal';

import {
  fetchReadingListDetailsWorkflow,
  postReadingListLikeWorkflow,
  updateReadingListWorkflow
} from '../../redux/readingListsActions';
import {
  saveOfflineWorkflow,
  unsaveOffline,
  isAvailableOffline
} from '../../redux/offlineBooksActions';
import { openAuthModal } from '../../redux/userActions';
import { delays, userFeedbackPopups, gaEventCategories, gaEventActions } from '../../lib/constants';
import { addOfflineBookModal } from '../../redux/offlineBookModalAction';
import { addUserFeedbackModal } from '../../redux/userFeedbackModalAction';
import { recordGaEvents } from '../../redux/googleAnalyticsActions';
import { addSlimNotification } from '../../redux/slimNotificationActions';
import { getImageSize } from '../../lib/images';
import {
  fetchBookWorkflow, 
  fetchNextReadBooksWorkflow, 
  openGlobalBookReader, 
  fetchBookAssetsWorkflow,
} from '../../redux/bookActions';

import './ReadingListContainer.scss';


const mapStateToProps = ({ book, readingLists, user, viewport, offlineBooks, windowDimensions }) => ({
  readingList: readingLists.readingList,
  book: book.book,
  isFetchingReadingList: readingLists.isFetchingReadingList,
  isUpdatingReadingList: readingLists.isUpdatingReadingList,
  isLoggedIn: user.isLoggedIn,
  profile: user.profile,
  viewport,
  offlineBooks,
  windowDimensions,
  isFetchingAssets: book.isFetchingAssets,
  currentGlobalBookReaderSlug: book.currentGlobalBookReaderSlug,
});

const mapDispatchToProps = {
  fetchBookWorkflow, 
  openGlobalBookReader,
  fetchBookAssetsWorkflow,
  fetchNextReadBooksWorkflow,
  fetchReadingListDetailsWorkflow,
  postReadingListLikeWorkflow,
  updateReadingListWorkflow,
  saveOfflineWorkflow,
  unsaveOffline,
  addOfflineBookModal,
  openAuthModal,
  recordGaEvents,
  addUserFeedbackModal,
  addSlimNotification,
};


class ReadingListContainer extends Component {
  constructor(props) {
    super(props);

    // We operate on a copy of the reading list, since it's user editable.
    this.state = {
      readingList: cloneDeep(props.readingList),
      isEditing: false,
      didEditReadingList: false,
      isConfirmDeleteModalVisible: false,
      bookIndexToDelete: -1,
      isListOpenedGaFired: false
    };
  }

  setIsEditing = (isEditing) => {
    this.setState({ isEditing: isEditing });
  }

  onReadingListFieldChange = (field, newValue) => {
    this.setState(u.updateIn(`readingList.${field}`, newValue, this.state));
    this.setState({ didEditReadingList: true });
  }

  onMoveBook = (index, offset) => {
    let newIndex = index + offset;

    if (newIndex < 0 || newIndex > this.state.readingList.books.length - 1) {
      return;
    }

    const newBooks = cloneDeep(this.state.readingList.books);
    const t = newBooks[index];
    newBooks[index] = newBooks[newIndex];
    newBooks[newIndex] = t;

    this.setState(u.updateIn('readingList.books', newBooks, this.state));
    this.setState({ didEditReadingList: true });
  }

  onSave = () => {
    // If nothing was edited, return.
    if (!this.state.didEditReadingList) {
      return this.setIsEditing(false);
    }

    // We only care about sending back fields that can change.
    const readingListFields = ['title', 'description', 'books', 'id'];
    const updatedReadingList = pick(this.state.readingList, readingListFields);

    // Sending back full books objects confuses the backend. Again, we only send back the fields that can change.
    const bookFields = ['id', 'usageInstructions'];
    updatedReadingList.books = updatedReadingList.books.map(book => pick(book, bookFields));

    this.props.updateReadingListWorkflow(updatedReadingList)
      .then(() => {
        this.setIsEditing(false);
        this.setState({ didEditReadingList: false });
      });
  }

  onCancel = () => {
    this.setState({
      readingList: cloneDeep(this.props.readingList),
      isEditing: false,
      didEditReadingList: false
    });
  }

  onAddHowToUse = (index) => {
    this.setState(u.updateIn(
      `readingList.books.${index}`,
      {
        usageInstructions: {
          txt: ''
        }
      },
      this.state
    ));

    this.setState({ didEditReadingList: true });
  }
  
  onRemoveHowToUse = (index) => {
    this.setState(u.updateIn(
      `readingList.books.${index}`,
      {
        usageInstructions: {
          txt: null,
          html: null
        }
      },
      this.state
    ));

    this.setState({ didEditReadingList: true });
  }

  openConfirmDeleteModal = (index) => {
    this.setState({
      isConfirmDeleteModalVisible: true,
      bookIndexToDelete: index
    });
  }

  closeConfirmDeleteModal = () => {
    this.setState({
      isConfirmDeleteModalVisible: false,
      bookIndexToDelete: -1
    });
  }

  onDeleteBook = (index) => {
    this.closeConfirmDeleteModal();

    if (index === -1) {
      return;
    }
    
    const newReadingList = u({
      books: books => books.filter((_, i) =>  i !== index)
    }, this.state.readingList);

    this.setState({
      didEditReadingList: true,
      readingList: newReadingList
    });
  }

  onBeforeUnload = (e) => {
    if (!this.state.isEditing) {
      return;
    }

    const { t } = this.props;
    const dialogText = t('ReadingList.before-unload-prompt');
    e.returnValue = dialogText;
    return dialogText;
  }

  onLikeButtonClicked = () => {
    const {
      readingList,
      isLoggedIn,
      postReadingListLikeWorkflow,
      recordGaEvents,
      profile,
    } = this.props;

    if (isLoggedIn) {
      postReadingListLikeWorkflow(readingList.slug);

      recordGaEvents({
        eventCategory: gaEventCategories.list,
        eventAction: gaEventActions.liked,
        userEmail: profile.email,
        eventLabel: readingList.title,
        dimension6: readingList.categories.join(', ')
      });
    }
  }

  onReadClicked = (book, sectionClicked) => {
    const {
      fetchBookAssetsWorkflow,
      fetchNextReadBooksWorkflow,
      openGlobalBookReader,
      profile,
      recordGaEvents
    } = this.props;
    fetchBookAssetsWorkflow(book.slug)
      .then(openGlobalBookReader({book}))
      .then(() => fetchNextReadBooksWorkflow(book.slug));
        recordGaEvents({
          eventCategory: gaEventCategories.book,
          eventAction: gaEventActions.read,
          userEmail: profile.email,
          eventLabel: sectionClicked,
          dimension2: book.level,
          dimension3: book.language,
          dimension4: 'Online',
          dimension5: book.slug,
          metric1: 1,
        }); 
  }

  componentDidMount() {
    this.props.fetchReadingListDetailsWorkflow(this.props.match.params.slug);
    window.addEventListener('beforeunload', this.onBeforeUnload);
    this.timeout = setTimeout(() => {
      if (this.props.profile.popupsSeen && !this.props.profile.popupsSeen.includes(userFeedbackPopups.ListModal)) {
        this.props.addUserFeedbackModal({userEmail: this.props.profile.email, feedbackType: userFeedbackPopups.ListModal, eventLabel: this.state.readingList.title})
      }
    }, delays[userFeedbackPopups.ListModal]);
    
  }

  componentWillReceiveProps(nextProps) {
    // This comparison is okay, we only need to check if the reference changed.
    // We don't care about the actual values.
    // We need to do this becase we need to make a local clone of the reading list
    // every time the value in Redux changes.
    if (this.state.readingList !== nextProps.readingList) {
      this.setState({ readingList: cloneDeep(nextProps.readingList) });
    }
    // To send GA event on opening the list page (using isListOpenedGaFired state to send GA only once)
    if(!this.state.isListOpenedGaFired && nextProps.profile && nextProps.readingList && nextProps.recordGaEvents) {
      nextProps.recordGaEvents({
        eventCategory: gaEventCategories.list,
        eventAction: gaEventActions.opened,
        userEmail: nextProps.profile.email,
        eventLabel: nextProps.readingList.title,
        dimension6: nextProps.readingList.categories.join(', ')
      });
      this.setState({ isListOpenedGaFired: true });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onBeforeUnload);
    // Cleared timeout while unmounting
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    if (this.props.profile.popupsSeen && !this.props.profile.popupsSeen.includes(userFeedbackPopups.ListModal)) {
      this.props.addUserFeedbackModal({userEmail: this.props.profile.email, feedbackType:  userFeedbackPopups.ListModal, eventLabel: this.state.readingList.title})
    }
  }

  render() {
    const {
      isFetchingReadingList,
      isUpdatingReadingList,
      isLoggedIn,
      profile,
      t,
      viewport,
      offlineBooks,
      saveOfflineWorkflow,
      unsaveOffline,
      addOfflineBookModal,
      openAuthModal,
      addUserFeedbackModal,
      recordGaEvents,
      addSlimNotification,
      windowDimensions,
      isFetchingAssets,
      currentGlobalBookReaderSlug      
    } = this.props;

    if (isFetchingReadingList || !this.state.readingList) {
      return <LoaderBlock />;
    }

    const isEditable = isLoggedIn && this.state.readingList && profile.id === this.state.readingList.author.id;

    const books = this.state.readingList.books

    const availableOffline = books.every(book => isAvailableOffline(book.id, offlineBooks))
    const onClickAddToOffline = () => {
      const saveBooksPromise = books
        .filter(book => !isAvailableOffline(book.id, offlineBooks))
        .map(book => saveOfflineWorkflow(book, getImageSize(windowDimensions.width)))

      return Promise.all(saveBooksPromise)
    }
    const onClickRemoveFromOffline = () => {
      books.map(book => unsaveOffline(book.id))
      addSlimNotification({
        type: 'info',
        content: t('ReadingList.removed-from-offline-library-notification'),
      })
    }

    return (
      <div>
        <ReadingList
          readingList={this.state.readingList}
          onLikeButtonClicked={this.onLikeButtonClicked}
          editable={isEditable}
          editActive={this.state.isEditing}
          onReadingListFieldChange={this.onReadingListFieldChange}
          onEdit={() => this.setIsEditing(true)}
          onSave={this.onSave}
          onCancel={this.onCancel}
          onAddHowToUse={this.onAddHowToUse}
          onRemoveHowToUse={this.onRemoveHowToUse}
          onDeleteBook={this.openConfirmDeleteModal}
          onMoveBook={this.onMoveBook}
          viewport={viewport}
          isUpdatingReadingList={isUpdatingReadingList}
          didEditReadingList={this.state.didEditReadingList}
          isLoggedIn={isLoggedIn}
          availableOffline={availableOffline}
          offlineBooks={offlineBooks}
          onClickAddToOffline={onClickAddToOffline}
          onClickRemoveFromOffline={onClickRemoveFromOffline}
          isAvailableOffline={isAvailableOffline}
          addOfflineBookModal={addOfflineBookModal}
          addUserFeedbackModal={addUserFeedbackModal}
          userEmail={profile.email}
          offlineBookPopupSeen={profile.offlineBookPopupSeen}
          feedbackPopupsSeen={profile.popupsSeen}
          books={books}
          openAuthModal={openAuthModal}
          listTitle={this.state.readingList.title}
          recordGaEvents={recordGaEvents}
          addSlimNotification={addSlimNotification}
          onReadClicked={this.onReadClicked}
          isFetchingAssets={isFetchingAssets}
          currentGlobalBookReaderSlug={currentGlobalBookReaderSlug}
        />
        <Prompt when={this.state.isEditing} message={t('ReadingList.before-unload-prompt')} />
        {
          this.state.isConfirmDeleteModalVisible
          ?
          <ConfirmModal
            title={t('ReadingList.confirm-delete-book-title')}
            text={t('ReadingList.confirm-delete-book')}
            onConfirm={() => this.onDeleteBook(this.state.bookIndexToDelete)}
            onClose={this.closeConfirmDeleteModal}
            viewport={viewport}
          />
          :
          null
        }
      </div>
    );
  }
}

ReadingListContainer.propTypes = {
  readingList: PropTypes.object,
  isFetchingReadingList: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  profile: PropTypes.shape({
    id: PropTypes.number
  }).isRequired,
  fetchReadingListDetailsWorkflow: PropTypes.func.isRequired,
  postReadingListLikeWorkflow: PropTypes.func.isRequired,
  updateReadingListWorkflow: PropTypes.func.isRequired,
  viewport: PropTypes.object.isRequired
};

export default translate()(connect(mapStateToProps, mapDispatchToProps)(ReadingListContainer));
