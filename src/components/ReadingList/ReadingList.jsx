import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';
import DocumentTitle from 'react-document-title';
import u from 'updeep';
import Likes from '../Likes';
import Breadcrumb from '../Breadcrumb';
import ReadingListEntry from '../ReadingListEntry';
import Avatar from '../Avatar';
import Link from '../Link';
import Button from '../Button';
import Stat from '../Stat';
import TextField from '../TextField';
import ActionBar, {ActionBarSection} from '../ActionBar';
import Block from '../Block';
import ShareMenu from '../ShareMenu';
import List from '../List';
import FloatingActionsBar from '../FloatingActionsBar';
import OfflineActions from '../Book/OfflineActions'
import NoSpaceForMoreOfflineBooksModal from '../Book/NoSpaceForMoreOfflineBooksModal'
import DeleteModal from '../Book/DeleteModal'
import DownloadList from './DownloadList';

import {
  links,
  profileTypes,
  userFeedbackPopups,
  MAX_OFFLINE_BOOKS_COUNT,
  gaEventCategories,
  gaEventActions
} from '../../lib/constants';

import './ReadingList.scss';

// Just adds an 's' at the end of the author type. This is all we need for
// our current list of author types (users, organisations, publishers). If we
// add any new ones later, the render() function might need to be re-written to
// handle them.
const pluralizeAuthorType = type => `${type}s`;

class ReadingList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isModalVisible: {
        noSpaceForMoreOfflineBooks: false,
        delete: false
      },
      isSavingOffline: false
    }

    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
  }

  onOpenModal(modalName) {
    this.setState(u({
      isModalVisible: {
        [modalName]: true
      }
    }, this.state));
  }

  onCloseModal(modalName) {
    this.setState(u({
      isModalVisible: {
        [modalName]: false
      }
    }, this.state));
  }

  onAddToOfflineClicked = () => {
    const {
      onClickAddToOffline,
      offlineBookPopupSeen,
      addOfflineBookModal,
      userEmail,
      books,
      recordGaEvents,
      feedbackPopupsSeen,
      addUserFeedbackModal,
      listTitle,
      readingList,
      addSlimNotification,
      t
    } = this.props;

    this.setState({isSavingOffline: true});

    onClickAddToOffline()
      .then(() => addSlimNotification({
        type: 'info',
        content: t('ReadingList.added-to-offline-library-notification'),
      }))
      .then(() => {
        this.setState({isSavingOffline: false});
        if (!offlineBookPopupSeen) {
          addOfflineBookModal(userEmail);
        }
        // send to GA for each book in the reading list.
        books.forEach(book => 
          recordGaEvents({
            eventCategory: gaEventCategories.offline,
            eventAction: gaEventActions.add,
            userEmail: userEmail,
            dimension2: book.level,
            dimension3: book.language,
            dimension5: book.slug,
            eventLabel: listTitle,
            dimension6: readingList.categories.join(', ')
           })
        );
      })
      .then(() => {
        if (!feedbackPopupsSeen.includes(userFeedbackPopups.ListModal)) {
          addUserFeedbackModal({userEmail: this.props.userEmail, feedbackType: userFeedbackPopups.ListModal, eventLabel: this.props.listTitle});
        }
      });
  }

  onShareClicked = () => {
    const {
      recordGaEvents,
      userEmail,
      listTitle,
      readingList
    } = this.props;

    recordGaEvents({
      eventCategory: gaEventCategories.list,
      eventAction: gaEventActions.shared,
      userEmail: userEmail,
      eventLabel: listTitle,
      dimension6: readingList.categories.join(', ')
    });
  }

  onDownloadClicked = () => {
    const {
      recordGaEvents,
      userEmail,
      listTitle,
      readingList,
      books,
      addSlimNotification,
      t
    } = this.props;

    addSlimNotification({
      type: 'info',
      content: t('ReadingList.downloaded'),
    })

    recordGaEvents({
      eventCategory: gaEventCategories.list,
      eventAction: gaEventActions.download,
      userEmail: userEmail,
      eventLabel: listTitle,
      metric4: books.length,
      dimension6: readingList.categories.join(', ')
    });
  }

  renderBooks() {
    const {
      editable,
      editActive,
      onAddHowToUse,
      onRemoveHowToUse,
      onDeleteBook,
      onMoveBook,
      onReadingListFieldChange,
      readingList,
      isUpdatingReadingList,
      userEmail,
      listTitle,
      recordGaEvents,
      onReadClicked,
      isFetchingAssets,
      currentGlobalBookReaderSlug
    } = this.props;
    
    return readingList.books.map((b, i, arr) =>
      <ReadingListEntry
        key={`${b.title}-${i}`}
        index={i}
        first={i === 0}
        last={i === arr.length - 1}
        description={b.description}
        book={b}
        editActive={editable && editActive}
        onFieldChange={(f, v) => onReadingListFieldChange(`books.${i}.${f}`, v)}
        onAddHowToUse={onAddHowToUse}
        onRemoveHowToUse={onRemoveHowToUse}
        onDeleteBook={onDeleteBook}
        onMoveBook={onMoveBook}
        isUpdatingReadingList={isUpdatingReadingList}
        userEmail={userEmail}
        listTitle={listTitle}
        readingListCategories={readingList.categories.join(', ')}
        recordGaEvents={recordGaEvents}
        onReadClicked={onReadClicked} 
        isFetchingAssets={isFetchingAssets}
        currentGlobalBookReaderSlug={currentGlobalBookReaderSlug}
        readingList={readingList}      
      />
    );
  }

  renderHeaderActions(baseClassName) {
    const {
      editable,
      editActive,
      onEdit,
      t,
    } = this.props;

    if (editable && !editActive) {
      return (
        <div className={`${baseClassName}__header-actions`}>
          <Button
            fullWidth={true}
            iconLeft='pen'
            label={t('global.edit')}
            onClick={onEdit}/>
        </div>
      );
    }

    return null;
  }

  renderEditActions(baseClassName) {
    const {
      editable,
      editActive,
      onCancel,
      onSave,
      isUpdatingReadingList,
      didEditReadingList,
      t,
    } = this.props;

    if (editable && editActive) {
      return (
        <FloatingActionsBar float>
          <Button
            iconLeft="check"
            variant="primary"
            label={t('global.save-changes')}
            onClick={onSave}
            loading={isUpdatingReadingList}
            disabled={!didEditReadingList}
          />

          <Button
            iconLeft="close"
            label={t('ReadingList.cancel')}
            onClick={onCancel}
            disabled={isUpdatingReadingList}
          />
        </FloatingActionsBar>
      );
    }

    return null;
  }

  renderActionBar(baseClassName) {
    const {
      readingList,
      t,
      viewport,
      editable,
      editActive,
      isLoggedIn,
      availableOffline,
      offlineBooks,
      isAvailableOffline,
      openAuthModal
    } = this.props;

    let author = readingList.author;
    let authorType = profileTypes.USER;
    if (profileTypes.ORGANISATION in readingList) {
      author = readingList[profileTypes.ORGANISATION];
      authorType = profileTypes.ORGANISATION;
    } else if (profileTypes.PUBLISHER in readingList) {
      author = readingList[profileTypes.PUBLISHER];
      authorType = profileTypes.PUBLISHER;
    }

   
    let likeEl = null
    if (readingList.likeCount>=0)  {
      likeEl = <Likes
                  parentClassName={`${baseClassName}__likes`}
                  t={t}
                  isliked={readingList.liked}
                  likesCount={readingList.likeCount}
                  onLike={() => this.props.onLikeButtonClicked(readingList.slug)}
                  isLoggedIn={isLoggedIn}
                  openAuthModal={openAuthModal}
                  logInMsg={t('global.please-log-in', 
                    {action: t('global.like',1), content_type: t('global.list',1)})}
                />
    }

    let booksAvailableToSaveToOffline = readingList.books.filter(book => !isAvailableOffline(book.id, offlineBooks))
    
    return (
      <ActionBar
        disabled={editable && editActive}
        parentClassName={`${baseClassName}__action-bar`}>
        <ActionBarSection>
          <Link href={links.profile(pluralizeAuthorType(authorType), author.slug)} isInternal={true}>
            <Avatar
              parentClassName={`${baseClassName}__avatar`}
              name={author.name}
              size="m"
              url={author.profileImage}
              variant="circular"
            />
          </Link>
          {' '}
          {t("ReadingList.list-created-by")}
          {' '}
          <Link href={links.profile(pluralizeAuthorType(authorType), author.slug)} isInternal={true}>{author.name}</Link>
        </ActionBarSection>
        <ActionBarSection>
          {likeEl}
          <Stat value={readingList.readCount} icon="book" />
        </ActionBarSection>
        <ActionBarSection>
          <List inline={true}>
            {
              process.env.REACT_APP_FEATURE_OFFLINE && readingList.books.length > 0
              ?
              <OfflineActions
                availableOffline={availableOffline}
                onClickAddToOffline={() => {
                  const bookCountAfterSave = offlineBooks.books.length + booksAvailableToSaveToOffline.length
                  if (bookCountAfterSave <= MAX_OFFLINE_BOOKS_COUNT) {
                    return this.onAddToOfflineClicked()
                  } else {
                    return this.onOpenModal('noSpaceForMoreOfflineBooks')
                  }
                }}
                onClickRemoveFromOffline={() => this.onOpenModal('delete')}
                disabled={!('serviceWorker' in navigator)}
                isLoggedIn={isLoggedIn}
                isSavingOffline={this.state.isSavingOffline}
                t={t}
                openAuthModal={openAuthModal}
              />
              :
              null
            }
          {/*TODO: SW-2820 Fix alignment according to new requirements*/}
            <DownloadList
              isLoggedIn={isLoggedIn}
              t={t}
              slug={readingList.slug}
              openAuthModal={openAuthModal}
              onClick={this.onDownloadClicked}
            />
            <ShareMenu
              title={readingList.title}
              align={viewport.medium ? 'right' : 'left'}
              href={window.location.href}
              onClick={this.onShareClicked} />
          </List>
        </ActionBarSection>
      </ActionBar>
    );
  }

  render() {
    const {
      t,
      readingList,
      editable,
      editActive,
      viewport,
      isUpdatingReadingList,
      onClickRemoveFromOffline,
      userEmail,
      recordGaEvents,
      addSlimNotification
    } = this.props;

    const baseClassName = 'pb-reading-list';
    const classNames = [baseClassName];

    const breadcrumbPath = [{
      title: t('global.home'),
      href: links.home(),
      isInternal: true
    }, {
      title: t('global.list', 2),
      href: links.lists(),
      isInternal: true
    }];

    const booksEl = this.renderBooks();
    const headerActionsEl = this.renderHeaderActions(baseClassName);
    const actionBarEl = this.renderActionBar(baseClassName);

    if (editable && editActive) {
      classNames.push(`${baseClassName}--edit-active`);
    }

    return (
      <div className={classNames.join(' ')}>
        <DocumentTitle title={`${readingList.title} - ${t("global.site-title")}`} />
        <Block>
          <div className={`${baseClassName}__wrapper`}>
            <Breadcrumb paths={breadcrumbPath} />
            <div className={`${baseClassName}__header`}>
              <div className={`${baseClassName}__header-wrapper ${editable && editActive ? `${baseClassName}__header-wrapper--extended` : null }`}>
                {
                  editable && editActive
                  ?
                  <TextField
                    id="reading-list-title-input"
                    label={t('global.title')}
                    size={viewport.medium ? "l" : "m"}
                    fontFamily="alt"
                    defaultValue={readingList.title}
                    onChange={e => this.props.onReadingListFieldChange('title', e.target.value)}
                    disabled={true}
                  />
                  :
                  <h1 className={`${baseClassName}__title`}>{readingList.title}</h1>
                }
              </div>
              {headerActionsEl}
              {this.renderEditActions(baseClassName)}
            </div>

            {actionBarEl}

            <div className={`${baseClassName}__content-wrapper`}>
              {
                editable && editActive
                ?
                <TextField
                  id="reading-list-list-desc-input"
                  label={t("global.list-desc")}
                  defaultValue={readingList.description}
                  type="multiline"
                  onChange={e => this.props.onReadingListFieldChange('description', e.target.value)}
                  disabled={isUpdatingReadingList}
                />
                :
                <div className={`${baseClassName}__desc`}>{readingList.description}</div>
              }
              <div className={`${baseClassName}__books`}>
                {booksEl}
              </div>
            </div>
          </div>
        </Block>
        {
          this.state.isModalVisible.noSpaceForMoreOfflineBooks
          ?
          <NoSpaceForMoreOfflineBooksModal
            viewport={viewport}
            onClose={() => this.onCloseModal('noSpaceForMoreOfflineBooks')}
            maximum={MAX_OFFLINE_BOOKS_COUNT}
          />
          :
          null
        }
        {
          this.state.isModalVisible.delete
          ?
          <DeleteModal
            onConfirm={onClickRemoveFromOffline}
            onClose={() => this.onCloseModal('delete')}
            viewport={viewport}
            count={readingList.books.length}
            books={readingList.books}
            userEmail={userEmail}
            recordGaEvents={recordGaEvents}
            baseClassName={baseClassName}
            addSlimNotification={addSlimNotification}
          />
          :
          null
        }
      </div>
    );
  }
}

ReadingList.propTypes = {
  t: PropTypes.func,
  readingList: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    books: PropTypes.arrayOf(PropTypes.shape({
      ...ReadingListEntry.propTypes,
      howToUse: PropTypes.string
    }))
  }).isRequired,
  editable: PropTypes.bool,
  editActive: PropTypes.bool,
  onReadingListFieldChange: PropTypes.func,
  onReadingListBookFieldChange: PropTypes.func,
  onEdit: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  onAddHowToUse: PropTypes.func,
  onDeleteBook: PropTypes.func,
  onMoveBook: PropTypes.func,
  onLikeButtonClicked: PropTypes.func,
  viewport: PropTypes.object.isRequired
};

export default translate()(ReadingList);
