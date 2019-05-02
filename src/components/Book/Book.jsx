import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { translate } from 'react-polyglot';
import DocumentTitle from 'react-document-title';
import u from 'updeep';
import Likes from '../Likes';
import { Helmet } from "react-helmet";

import Block from '../Block';
import BookCard from '../BookCard';
import Button from '../Button';
import DocumentClass from '../DocumentClass';
import Stat from '../Stat';
import Rowifier from '../Rowifier';
import Credits from './Credits';
import SelectField from '../SelectField';
import SearchableSelectField from '../SearchableSelectField';
import AuthDropdown from '../AuthDropdown';
import Loader from '../Loader';
import EmbedModal from './EmbedModal';
import NoSpaceForMoreOfflineBooksModal from './NoSpaceForMoreOfflineBooksModal';
import BookBreadcrumbs from './BookBreadcrumbs';
import FlagModal from './FlagModal';
import RelevelModal from './RelevelModal';
import DeleteModal from './DeleteModal';
import DownloadModal from './DownloadModal';
import Translations from './Translations';
import BookActions from './BookActions';
import Tags from './Tags';
import CategoryTags from './CategoryTags';
import OfflineActions from './OfflineActions';
import SimilarBooks from './SimilarBooks';
import ConfirmModal from '../ConfirmModal';
import CreateListModal from './CreateListModal';
import Publisher from '../Publisher';
import Donor from '../Donor';
import FloatingActionsBar from '../FloatingActionsBar';
import Link from '../Link';
import CollapsibleSection from '../CollapsibleSection';
import List from '../List';
import Sizer from '../Sizer';
import Rating from '../Rating';
import SvgIcon from '../SvgIcon';
import StructuredDataMarkup from './StructuredDataMarkup';

import { MAX_OFFLINE_BOOKS_COUNT, links, gaEventCategories, gaEventActions, sectionClicked , roles as availableRoles } from '../../lib/constants';
import { getSmallestImage, getLargestImage } from '../../lib/images';

import './Book.scss';

const baseClassName = 'pb-book';

class Book extends Component {
  static defaultProps = {
    illustrators: [],
    authors: [],
    originalAuthors: [],
    tags: [],
    categories: [],
    userLists: [],
  }

  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: {
        embed: false,
        flag: false,
        relevel: false,
        confirmEdit: false,
        createList: false,
        noSpaceForMoreOfflineBooks: false,
        delete: false,
        download: false
      },
      isListenButtonClicked: false,
      showTranslateOptions: false
    };

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
    if (modalName === 'relevel') {
      this.props.onRelevelModalClosed();
    }
  }

  onReadClicked(slug, sectionClicked, isAudio=false) {
    if (isAudio)
      this.setState({isListenIconClicked: true})
    else
      this.setState({isListenIconClicked: false});
    this.props.onReadClicked(slug, sectionClicked, isAudio);
  }

  onFormLinkClicked = () => {
    const {
      userEmail,
      name,
      organisation,
      country,
      book,
      recordBookDownloadPopUpFormOpened
    } = this.props;

    recordBookDownloadPopUpFormOpened({userEmail, book})
    window.open(links.googleFormBookDownloadLink({userEmail, name, organisation, country}));
    this.setState(u({
      isModalVisible: {
        download: false
      }
    }, this.state));
  }

  onAddToOfflineClicked = () => {
    const {
      onClickAddToOffline,
      offlineBookPopupSeen,
      addOfflineBookModal,
      userEmail,
      book,
      recordGaEvents,
      addSlimNotification,
      t
    } = this.props;

    onClickAddToOffline()
      .then(() => addSlimNotification({
        type: 'info',
        content: t('BookCard.added-to-offline-library-notification'),
      }))
      .then(() => {
        if(!offlineBookPopupSeen) {
          addOfflineBookModal(userEmail);
        }
        recordGaEvents({
          eventCategory: gaEventCategories.offline,
          eventAction: gaEventActions.add,
          userEmail: userEmail,
          dimension2: book.level,
          dimension3: book.language,
          dimension5: book.slug,
          metric2: 1
        })
      });
  }

  onProfileLinkClicked = (profileSlug, linkType) => {
    const {
      recordGaEvents,
      userEmail,
    } = this.props;
  
    recordGaEvents({
      eventCategory: gaEventCategories.profile,
      eventAction: gaEventActions.opened,
      eventLabel: `${sectionClicked.bookDetails} ${linkType}`,
      userEmail: userEmail,
      dimension5: profileSlug
    });
  }

  onTranslateLinkClicked = () => {
    if(!this.props.isLoggedIn)
      return;
    this.setState({showTranslateOptions: true});
    this.props.fetchFiltersWorkflow();
  }

  onTranslateBookClicked(slug) {
    const { viewport,
      addSlimNotification,
      t, 
      book, 
      targetLanguage, 
      fetchCheckTranslationsWorkflow,
      openTranslationModal } = this.props;
    
    fetchCheckTranslationsWorkflow(book.slug, targetLanguage)
    .then(response => {
      if (response.ok) {
        if (response.data.length === 0) {
          if (viewport.medium) {
            window.location.href = links.translateBookToLanguage(slug, targetLanguage)
          }
          else {
            addSlimNotification({
              id: 'Book.mobile-editor-notification',
              content: t('Book.mobile-editor-notification-text'),
            });
          }
        }
        else {
          openTranslationModal(book, true);
        }
      }
    })
  }

  onBookDownload = (downloadLink) =>{
    //Refetching Book Details API to update the downloadLimitReached flag coming from backend before starting downloading

    this.props.fetchBookDownloadLimitWorkflow(this.props.book.slug)
      .then(response => {
        const data = response.data
        if(data.downloadLimitReached)
        {
          this.setState(u({
            isModalVisible: {
              download: true
            }
          }, this.state));
          this.props.recordBookDownloadPopUpOpened(data);
        }
        else
        {
          window.open(downloadLink);
        }
      })
  }

  render() {
    const {
      book,
      t,
      viewport,
      online,
      onFlagClicked,
      isFetchingUserLists,
      userLists,
      onAddToList,
      onRemoveFromList,
      isLoggedIn,
      isAddingOrRemovingFromList,
      isFetchingAssets,
      onClickRemoveFromOffline,
      availableOffline,
      onEdit,
      onCreateList,
      roles,
      onAddToEditorsPicks,
      onRemoveFromEditorsPicks,
      isAddingToOrRemovingFromEditorsPicks,
      isCreatingReadingList,
      onLikeClicked,
      onLastPageClicked,
      isFlaggingBook,
      isSavingOffline,
      offlineBooksCount,
      openAuthModal,
      addSlimNotification,
      onTranslateClicked,
      onRelevelClicked,
      isReleveling,
      postRelevelWorkflow,
      isFetchingFilters,
      filters,
      fetchAllBooksFiltersWorkflow,
      userEmail,
      recordGaEvents,
      notifications,
      removeNotification,
      recordBookDownload,
      isFetchingBookDownloadLimit,
      recordBookDownloadPopUpOpened,
      attributionLoading,
      isFetchingTranslateFilters,
      translateFilters,
      targetLanguage,
      changeTargetLanguage,
      isCheckingTranslations
    } = this.props;

    const {
      name: title,
      status,
      description,
      slug,
      authors,
      illustrators,
      photographers,
      tags,
      categories,
      similarBooks,
      translations,
      readsCount,
      likesCount,
      publishedDate,
      updatedDate,
      createdDate,
      liked,
      downloadLinks,
      isTranslation,
      isRelevelled,
      lists: listMemberships,
      copyrightNotice,
      orientation,
      canEdit: isEditable,
      editorsPick: isEditorsPick,
      publisher,
      donor,
      isFlagged,
      isGif,
      level,
      language,
      isContestStory,
      showOptions,
      storyRating
    } = book; 

    const { originalStory : { 
        name: originalTitle, 
        slug: originalSlug, 
        authors: originalAuthors
    }} = book;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--floated-cta`]: !viewport.large,
      [`${baseClassName}--offline`]: !online
    }

    const titleClasses = {
      [`${baseClassName}__title`]: true,
      [`${baseClassName}__title--bhoti`]: book.language === 'Bhoti'
    }

    const isContentManager = roles && roles.includes(availableRoles.CONTENT_MANAGER);

  
    let likeStat = null
    if (likesCount>=0 && online)  {
      likeStat = <Likes
                  parentClassName={`${baseClassName}__likes`}
                  t={t}
                  isliked={liked}
                  likesCount={likesCount}
                  onLike={() => onLikeClicked(slug)}
                  isLoggedIn={isLoggedIn}
                  openAuthModal={openAuthModal}
                  logInMsg={t('global.please-log-in', 
                    {action: t('global.like',1), content_type: t('global.story',1)})}
                />
    }

    let targetOptions;
    if (translateFilters.language) {
      targetOptions = [{ name: `${t('Translate.choose-language')}`, queryValue: '' }, ...(translateFilters.language.targetQueryValues.filter(translateLanguage => translateLanguage.name !== book.language))];
    } else {
      targetOptions = [{ name: `${t('Translate.choose-language')}`, queryValue: '' }];
    }

    let selectTranslateLanguageEl = null;

    if (viewport.medium) {
      selectTranslateLanguageEl = <SearchableSelectField
                                    parentClassName={`${baseClassName}__translate-select-field`}
                                    id="pb-book-translate-to-lang"
                                    value={targetLanguage}
                                    options={targetOptions}
                                    onChange={changeTargetLanguage}
                                  />
    }
    else {
    selectTranslateLanguageEl = <SelectField
                                  parentClassName={`${baseClassName}__translate-select-field`}
                                  id="pb-book-translate-to-lang"
                                  value={targetLanguage}
                                  options={targetOptions}
                                  onChange={changeTargetLanguage}
                                />
    }

    let translateEl = null;

    if (online) {
      translateEl = <div className={`${baseClassName}__translate-wrapper`}>
                      <List nowrap>
                        <Link fullWidth onClick={ this.onTranslateLinkClicked}>
                          { isFetchingTranslateFilters ? <Loader size="m" /> : <SvgIcon name="translate" />}
                          {t('Book.translate-story')}
                        </Link>
                        {
                          this.state.showTranslateOptions && !isFetchingTranslateFilters
                          ?
                          [ selectTranslateLanguageEl,
                            <Button
                              parentClassName={`${baseClassName}__translate-button`}
                              label= {t('global.translate')}
                              variant="primary"
                              loading={isFetchingTranslateFilters || isCheckingTranslations }
                              disabled={isFetchingTranslateFilters || targetLanguage === ''}
                              onClick={this.onTranslateBookClicked.bind(this, book.slug)}
                              size='xxl'
                            />
                          ]
                          :
                          null        
                        }
                      </List>
                    </div>
      if ( !isLoggedIn ) {
        translateEl = <AuthDropdown
                        t={t}
                        openAuthModal={openAuthModal}
                        toggleEl = { translateEl }
                        loginText = {t('global.please-log-in-action', {action: t('global.translate')})}
                      />;
      }
    }

    let readingLists = book.lists.filter( list => list.status === "published")
    
    return (
      <div className={classNames(classes)}>
        <DocumentTitle title={`${title} - ${t('global.site-title')}`} />
        <DocumentClass className={`${baseClassName}-document--offline`} remove={online} />
        <Helmet>
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={getSmallestImage(book.coverImage.sizes).url} />
          <meta property="og:url" content={window.location.href} />
          <meta name="twitter:card" content={getLargestImage(book.coverImage.sizes).url} />
        </Helmet>
        { book.status === "published" ? <StructuredDataMarkup book={book} /> : null }
        <Block>
          <div className={`${baseClassName}__wrapper`}>
            <BookBreadcrumbs offline={!online} t={t} />
            <div className={`${baseClassName}__cover-wrapper`}>
              <div className={`${baseClassName}__cover`}>
                <BookCard
                  book={book}
                  fontSize="l"
                  disabled={isFetchingAssets && !attributionLoading} 
                  loading={isFetchingAssets && !attributionLoading}
                  onClick={() => this.onReadClicked(slug, 'Book Card')}
                  shouldDisplayMenu={false}
                  noSrcSet={!online}
                />
              </div>
              <div className={`${baseClassName}__stats`}>
                {likeStat}
                <Stat
                  icon="book"
                  value={readsCount} />
              </div>
            </div>
            <div className={`${baseClassName}__content`}>
              <h1 className={classNames(titleClasses)}>{title}</h1>
              {
              roles && roles.includes(availableRoles.CONTENT_MANAGER) && storyRating
              ?
              <Rating rating={storyRating}/>
              :null
              }
              <Credits
                isTranslation={isTranslation}
                isRelevelled={isRelevelled}
                authors={authors}
                illustrators={illustrators}
                photographers={photographers}
                originalTitle={originalTitle}
                originalSlug={originalSlug}
                originalAuthors={originalAuthors}
                offline={!online}
                t={t}
                onProfileLinkClicked={this.onProfileLinkClicked}
                />
              <Publisher
                showUpdatedOnDate={isContentManager}
                status={status}
                publishedDate={publishedDate}
                updatedDate={updatedDate}
                createdDate={createdDate}
                publisher={publisher}
                offline={!online}
                />
              <div>{description}</div>
                <FloatingActionsBar float={!viewport.large}>
                  <div className={`${baseClassName}__cta-wrapper`}>
                  {
                    book.isAudio
                    ?
                    (<div className={`${baseClassName}__action-btns-container`}>
                      <Button
                        label= { viewport.medium ? t('Book.read') : <SvgIcon parentClassName={`${baseClassName}__icon`} name="read" size="m" pushRight /> }
                        variant="primary"
                        loading={isFetchingAssets && !this.state.isListenIconClicked && !attributionLoading }
                        size='xl'
                        onClick={() => this.onReadClicked(slug, 'Read Button')}
                      />
                      <Button
                        label= { viewport.medium ? t('Book.listen') : <SvgIcon parentClassName={`${baseClassName}__icon`} name="readalong" size="m" pushRight /> }
                        variant="primary"
                        loading={isFetchingAssets && this.state.isListenIconClicked}
                        size='xl'
                        onClick={() => this.onReadClicked(slug, 'Listen Button', true)}
                      />
                    </div>)
                    :
                    <Button
                      fullWidth
                      label= {t('Book.read')}
                      iconRight= { isGif ? 'gif' : null }
                      variant="primary"
                      loading={isFetchingAssets && !attributionLoading }
                      onClick={() => this.onReadClicked(slug, 'Read Button')}
                    />
                  }
                </div>
                </FloatingActionsBar>
                {
                  (book.externalLink)
                  ?
                  <p>{book.externalLink.text} <Link href={book.externalLink.link}>{t('Book.externalLink')}</Link></p>
                  :
                  null
                }
              
              <Rowifier separator borderTop>
                { translateEl }
                {
                  (!online || (isContestStory && !showOptions))
                  ?
                  null
                  :
                  <BookActions
                    title={title}
                    offline={!online}
                    onLastPageClicked={onLastPageClicked}
                    downloadLinks={downloadLinks}
                    isFetchingBookDownloadLimit={isFetchingBookDownloadLimit}
                    isFetchingUserLists={isFetchingUserLists}
                    userLists={userLists}
                    onAddToList={onAddToList}
                    onCreateList={() => this.onOpenModal('createList')}
                    onRemoveFromList={onRemoveFromList}
                    slug={slug}
                    isLoggedIn={isLoggedIn}
                    isFlagged={isFlagged}
                    isAddingOrRemovingFromList={isAddingOrRemovingFromList}
                    listMemberships={listMemberships}
                    baseClassName={baseClassName}
                    onOpenModal={this.onOpenModal}
                    isEditable={isEditable}
                    onEdit={() => status === "published" ? this.onOpenModal('confirmEdit') : onEdit()}
                    roles={roles}
                    status={status}
                    isEditorsPick={isEditorsPick}
                    onAddToEditorsPicks={onAddToEditorsPicks}
                    onRemoveFromEditorsPicks={onRemoveFromEditorsPicks}
                    isAddingToOrRemovingFromEditorsPicks={isAddingToOrRemovingFromEditorsPicks}
                    openAuthModal={openAuthModal}
                    onTranslateClicked={onTranslateClicked}
                    onRelevelClicked={onRelevelClicked}
                    addSlimNotification={addSlimNotification}
                    notifications={notifications}
                    removeNotification={removeNotification}
                    userEmail={userEmail}
                    level={level}
                    language={language}
                    recordGaEvents={recordGaEvents}
                    recordBookDownload={recordBookDownload}
                    recordBookDownloadPopUpOpened={recordBookDownloadPopUpOpened}
                    onBookDownload={this.onBookDownload}
                    isFetchingAssets={isFetchingAssets}
                    attributionLoading={attributionLoading}
                    viewport={viewport}
                    isDerivation={isRelevelled || isTranslation}
                    isReleveling={isReleveling}
                    postRelevelWorkflow={postRelevelWorkflow}
                  />
                }
                {
                  online && translations && translations.length
                  ?
                  <Translations translations={translations} versionCount={book.versionCount} languageCount={book.languageCount} offline={!online} t={t} />
                  :
                  null
                }
                {
                  process.env.REACT_APP_FEATURE_OFFLINE
                  ?
                  <OfflineActions
                    availableOffline={availableOffline}
                    onClickAddToOffline={() => { offlineBooksCount < MAX_OFFLINE_BOOKS_COUNT ? this.onAddToOfflineClicked() : this.onOpenModal('noSpaceForMoreOfflineBooks') }}
                    onClickRemoveFromOffline={() => this.onOpenModal('delete')}
                    disabled={!('serviceWorker' in navigator)}
                    isLoggedIn={isLoggedIn}
                    isSavingOffline={isSavingOffline}
                    t={t}
                    openAuthModal={openAuthModal}
                  />
                  :
                  null
                }
                <div className={`${baseClassName}__tags-wrapper`}>
                {
                    (!online || !tags  || !tags.length)
                    ?
                    null
                    :
                    <Tags tags={tags} baseClassName={baseClassName} />
                }
                {
                    (!online  || !categories  || !categories.length)
                     ?
                     null
                     :
                    <CategoryTags categories={categories} baseClassName={baseClassName} isCategoryPill={isContentManager}/>
                }
                </div>

                {
                  online && readingLists.length > 0
                  ?
                  <CollapsibleSection title={t('Book.story-is-part-of', readingLists.length)}>
                    <Sizer
                      maxHeight="l"
                      scrollY
                    >
                      <List>
                        {
                          (readingLists.map((list, i) => {
                            return <Link isInternal={true} key={i} href={links.list(list.slug)} >
                                    {i + 1}. {list.title}
                                  </Link>
                          }))
                        }
                      </List>
                    </Sizer>
                  </CollapsibleSection>
                  :
                  null
                }
                {
                  copyrightNotice
                    ?
                    <p>{copyrightNotice}</p>
                    :
                    null
                }
                { 
                  donor
                    ?
                    <Donor
                     donor={donor}
                     offline={!online}/>
                     :
                     null
                }
        
              </Rowifier>
            </div>
          </div>
        </Block>
        <SimilarBooks offline={!online} similarBooks={similarBooks} t={t} viewport={viewport} />
        <EmbedModal
          isVisible={this.state.isModalVisible.embed}
          onCloseClick={() => this.onCloseModal('embed')}
          orientation={orientation}
          slug={slug}
          viewport={viewport}
        />
        <FlagModal
          isVisible={this.state.isModalVisible.flag}
          onCloseClicked={() => this.onCloseModal('flag')}
          onFlagClicked={reasons => onFlagClicked(slug, reasons)}
          viewport={viewport}
          isFlaggingBook={isFlaggingBook}
        />
        <RelevelModal
          isVisible={this.state.isModalVisible.relevel}
          onCloseClicked={() => this.onCloseModal('relevel')}
          level={level}
          slug={slug}
          isFetchingFilters={isFetchingFilters}
          filters={filters}
          viewport={viewport}
          isReleveling={isReleveling}
          postRelevelWorkflow={postRelevelWorkflow}
          fetchAllBooksFiltersWorkflow={fetchAllBooksFiltersWorkflow}
        />
        <DownloadModal
          isVisible={this.state.isModalVisible.download}
          onCloseClicked={() => this.onCloseModal('download')}
          onFormLinkClicked={this.onFormLinkClicked}
          userEmail={userEmail}
        />
        {
          this.state.isModalVisible.confirmEdit
          ?
          <ConfirmModal
            text={t('Book.confirm-edit')}
            onConfirm={() => { this.onCloseModal('confirmEdit'); onEdit(); }}
            onClose={() => this.onCloseModal('confirmEdit')}
            viewport={viewport}
          />
          :
          null
        }
        {
          this.state.isModalVisible.createList
          ?
          <CreateListModal
            viewport={viewport}
            isCreatingReadingList={isCreatingReadingList}
            onClose={() => this.onCloseModal('createList')}
            onCreate={onCreateList}
            bookSlug={slug}
          />
          :
          null
        }
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
            onConfirm={() => {onClickRemoveFromOffline()
                              addSlimNotification({
                                  type: 'info',
                                  content: t('BookCard.removed-from-offline-library-notification'),
                              })}}
            onClose={() => this.onCloseModal('delete')}
            viewport={viewport}
            count={1}
            books={[book]}
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

Book.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  coverImage: PropTypes.object.isRequired,
  recommended: PropTypes.bool,
  online: PropTypes.bool,
  avilableOffline: PropTypes.bool,
  authors: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired
  })),
  publisher: PropTypes.object,
  donor: PropTypes.object,
  likesCount: PropTypes.number,
  readsCount: PropTypes.number,
  storyRating: PropTypes.number, 
  tags: PropTypes.array,
  translations: PropTypes.arrayOf(PropTypes.shape({
    language: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired
  })),
  downloadLinks: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired
  })),
  similarBooks: PropTypes.arrayOf(PropTypes.shape(BookCard.propTypes)),
  onReadClicked: PropTypes.func,
  onClickAddToOffline: PropTypes.func,
  onClickRemoveFromOffline: PropTypes.func,
  viewport: PropTypes.object,
  isEditable: PropTypes.bool,
  onEdit: PropTypes.func,
  isSavingOffline: PropTypes.bool,
  offlineBooksCount: PropTypes.number,
  externalLink: PropTypes.object
};

export default translate()(Book);
