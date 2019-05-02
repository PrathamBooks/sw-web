import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { translate } from 'react-polyglot';
import u from 'updeep';
import { isEqual } from 'lodash';

import Dropdown from '../Dropdown';
import Img from '../Img';
import Link from '../Link';
import Menu from '../Menu';
import SvgIcon from '../SvgIcon';
import LazyFontLoader from '../LazyFontLoader';
import Loader from '../Loader';
import MenuLink from '../MenuLink';
import Button from '../Button';
import NoSpaceForMoreOfflineBooksModal from '../Book/NoSpaceForMoreOfflineBooksModal';
import Stat from '../Stat';

import {
  fetchBookWorkflow,
  fetchNextReadBooksWorkflow,
  fetchBookAssetsWorkflow,
  openGlobalBookReader,
  openGlobalQuickView,
  addBookToBookshelfWorkflow,
  removeBookFromBookshelfWorkflow,
} from '../../redux/bookActions';
import { saveOfflineWorkflow, unsaveOffline, isAvailableOffline } from '../../redux/offlineBooksActions';
import { recordGaEvents } from '../../redux/googleAnalyticsActions';
import { openAuthModal } from '../../redux/userActions';
import { openTranslationModal, fetchCheckTranslationsWorkflow } from '../../redux/translateActions';
import { imageSrcsetSizes, MAX_OFFLINE_BOOKS_COUNT, links, sectionClicked, gaEventCategories, gaEventActions } from '../../lib/constants';
import { getImageSize } from '../../lib/images';
import { addSlimNotification } from '../../redux/slimNotificationActions';
import { addOfflineBookModal } from '../../redux/offlineBookModalAction';
import { addNotificationModal } from '../../redux/notificationModalActions';

import './BookCard.scss';


const getIsAddedToBookshelf = (slug, profile) => {
  if (!profile || !profile.bookshelf) {
    return false;
  }

  return Boolean(profile.bookshelf.books.find(b => b.slug === slug));
};


const getIsAddingToBookshelf = (slug, isAddingOrRemovingFromBookshelf) => {
  return isAddingOrRemovingFromBookshelf.includes(slug);
};

const getMetaEls = (arr, baseClassName) => {
  if (!arr  || arr.length === 0)
    return null;

  let names = arr.map(a => {
    return (a.name)
  })
  names = names.sort();
  if (names.length === 0)
    return null;

    return (<span className={`${baseClassName}__names`}>
              { names.length === 1
                ?
                names[0]
                :
                `${names[0]} & ${names.length - 1} more`
              }
            </span>)
};


const MenuEl = ({baseClassName, 
  menu, 
  disabled, 
  viewport, 
  book, 
  onMenuButtonClick, 
  t, 
  hideMenu,
  hideQuickViewBtn,
  shouldShowReadIcon,
  showReadIconLoader,
  isFetchingAssets,
  isListenIconClicked,
  onAudioReadIconClicked,
  isReadIconClicked,
  onBookReadIconClicked,
  showTranslateButton,
  isCheckingTranslations}) => {


    const bookCardClasses = {
      [`${baseClassName}__menu`]: true,
      [`${baseClassName}__menu--hide-menu`]: hideMenu
    }

    const quickMenuClasses = {
      [`${baseClassName}__quick-menu`]: true,
      [`${baseClassName}__quick-menu--hide`]: hideQuickViewBtn
    }

    const menuLinkEl = (
      <Link
        parentClassName={`${baseClassName}__dropdown-link`}
        theme="light"
      >
        <div className={`${baseClassName}__icon`}>
          <SvgIcon name="dots" />
        </div>
      </Link>
    );

    const { isGif } = book;

    const menuDropdownEl = (
      <Dropdown
        parentClassName={`${baseClassName}__dropdown`}
        toggleEl={menuLinkEl}
        noPadding
        disabled={disabled}
        >
        {menu}
      </Dropdown>
    );

    const readAlongEl = (
     (isFetchingAssets && isListenIconClicked)
      ?
      <Loader size='m' />
      :
      <Link onClick={onAudioReadIconClicked} theme='light'>
        <SvgIcon name= 'readalong' size="m" pushRight/>
      </Link>
    );

    return (
      <div className={classNames(bookCardClasses)}>
        {
          viewport.large
          ?
          <div className={`${baseClassName}__quick-menu-wrapper`}>
            <div className={classNames(quickMenuClasses)}>
              <Button 
                parentClassName={`${baseClassName}__quick-menu-btn`}
                label={showTranslateButton ? t('global.translate') : t('Book.quick-view')}
                onClick={() => {
                  onMenuButtonClick(book)}}
                size="s"
                loading={showTranslateButton && isCheckingTranslations}
              />
              {menuDropdownEl}
            </div>
            { 
              book.isAudio || isGif || shouldShowReadIcon
              ?
              <div className={`${baseClassName}__hover-controls`}>
                {
               (isFetchingAssets && isReadIconClicked) 
                  ?
                  <Loader size='m' />
                  :
                  <Link onClick={onBookReadIconClicked} theme='light'>
                    <SvgIcon name={ isGif ? 'gif' : 'read' } size="m" pushRight/>
                  </Link>
                }
                { book.isAudio ? readAlongEl : null }
              </div>
              :
              null
            }
          </div>
          :
          menuDropdownEl
        }
      </div>
    )

};


const mapStateToProps = ({ book, offlineBooks, user: { isLoggedIn, profile }, viewport, notification, windowDimensions, translate }) => ({
  isFetchingAssets: book.isFetchingAssets,
  isAddingOrRemovingFromBookshelf: book.isAddingOrRemovingFromBookshelf,
  offlineBooks,
  isSavingOffline: offlineBooks.isSavingOffline,
  userEmail: profile.email,
  isLoggedIn,
  profile,
  viewport,
  notifications: notification.notifications,
  windowDimensions: windowDimensions,
  isCheckingTranslations: translate.isCheckingTranslations,
  targetLanguage: translate.targetLanguage,
});

const mapDispatchToProps = {
  fetchBookWorkflow,
  fetchNextReadBooksWorkflow,
  fetchBookAssetsWorkflow,
  openGlobalBookReader,
  openGlobalQuickView,
  saveOfflineWorkflow,
  unsaveOffline,
  openAuthModal,
  addBookToBookshelfWorkflow,
  removeBookFromBookshelfWorkflow,
  addOfflineBookModal,
  recordGaEvents,
  addSlimNotification,
  addNotificationModal,
  openTranslationModal,
  fetchCheckTranslationsWorkflow
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class BookCard extends Component {
  static defaultProps = {
    shouldDisplayMenu: true
  }

  constructor(props){
    super(props);
    this.state = {
      isModalVisible: {
        noSpaceForMoreOfflineBooks: false,
      },
      isListenIconClicked: false,
      isReadIconClicked: false,
      isListenLinkClicked: false,
      isReadLinkClicked: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.showReadIconLoader, nextProps.showReadIconLoader)) {
      this.setState ({ isReadIconClicked: nextProps.showReadIconLoader })
    }
  }

  handleClick = (e) => {
    if (this.props.disabled || this.props.loading) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      if (this.props.onClick) {
        // Since 'href' will be always be there for the card
        // disabled the defaults when onClick prop is present.
        e.preventDefault();
        this.props.onClick(e);
      }
    }
  }

  onReadClicked = () => {
    const {
      book,
      fetchBookAssetsWorkflow,
      fetchNextReadBooksWorkflow,
      openGlobalBookReader,
      recordGaEvents,
      profile,
      sectionClicked,
      offline
    } = this.props;
      fetchBookAssetsWorkflow(book.slug)
      .then(openGlobalBookReader({book}))
      .then(() => fetchNextReadBooksWorkflow(book.slug))
      .then(recordGaEvents({
        eventCategory: gaEventCategories.book,
        eventAction: gaEventActions.read,
        userEmail: profile.email,
        offline: offline,
        dimension2: book.level,
        dimension3: book.language,
        dimension4: offline ? 'Offline' : 'Online' ,
        dimension5: book.slug,
        eventLabel: sectionClicked,
        metric1: 1
      }))
  }

  onBookReadIconClicked(secClicked) {
    const {
      book,
      fetchBookAssetsWorkflow,
      fetchBookWorkflow,
      openGlobalBookReader,
      recordGaEvents,
      userEmail
    } = this.props;

    if ( secClicked === sectionClicked.bookCardIcon)
      this.setState({isReadIconClicked: true})
    else
      this.setState({isReadLinkClicked: true})

    fetchBookWorkflow(book.slug)
    fetchBookAssetsWorkflow(book.slug)
        .then(() => {
          openGlobalBookReader({book});
        })
        .then(() => {
          this.setState({isReadIconClicked: false, isReadLinkClicked: false})
        });
    recordGaEvents({
      eventCategory: gaEventCategories.book,
      eventAction: gaEventActions.read,
      userEmail: userEmail,
      dimension2: book.level,
      dimension3: book.language,
      dimension5: book.slug,
      metric2: 1,
      eventLabel: secClicked
    });
      
  }

  onAudioReadIconClicked(secClicked) {
    const {
      book,
      fetchBookAssetsWorkflow,
      fetchBookWorkflow,
      openGlobalBookReader,
      recordGaEvents,
      userEmail
    } = this.props;
    if (secClicked === sectionClicked.bookCardIcon)
      this.setState({isListenIconClicked: true});
    else
      this.setState({isListenLinkClicked: true});

    fetchBookWorkflow(book.slug)
    fetchBookAssetsWorkflow(book.slug)
        .then(() => {
          openGlobalBookReader({book, showAudioBookReader: true});
        })
        .then(() => {
            this.setState({isListenIconClicked: false, isListenLinkClicked: false})
        });
    recordGaEvents({
      eventCategory: gaEventCategories.book,
      eventAction: gaEventActions.listened,
      userEmail: userEmail,
      dimension2: book.level,
      dimension3: book.language,
      dimension5: book.slug,
      metric2: 1,
      eventLabel: secClicked
    });
      
  }

  onBookDetailsClicked() {
    window.location.href = links.bookDetails(this.props.book.slug);
  }

  onClickLogin = () => {
    if (process.env.REACT_APP_FEATURE_AUTH) {
      this.props.openAuthModal()
    }
    else {
    window.location.href = links.login()
    }
  }

  onAddToMyBookshelf = () => {
    const {
      isLoggedIn,
      addBookToBookshelfWorkflow,
      book: { slug },
      profile,
      addSlimNotification,
      t,
      recordGaEvents,
      openAuthModal,
      addNotificationModal
    } = this.props;

    if (!isLoggedIn || !profile || !profile.bookshelf) {

      addNotificationModal({
        title: t("global.log-in"),
        content: t("BookCard.please-log-in-notification-text"),
        additionalActions: [{
          label: t('global.log-in'),
          primary: true,
          onClick: () => { process.env.REACT_APP_FEATURE_AUTH
                           ?
                           openAuthModal()
                           :
                           window.location.href = links.login() }
        }, {
          label: t('global.sign-up'),
          onClick: () => { window.location.href = links.signup(); }
        }
      ]
      })
    }
    else {
      addBookToBookshelfWorkflow(slug, profile.bookshelf.slug)
        .then(() => addSlimNotification({
          type: 'info',
          id: 'BookCard.added-to-bookshelf-notification',
          content: t('BookCard.added-to-bookshelf-notification-text'),
        }))
        .then(() => recordGaEvents({
          eventCategory: gaEventCategories.bookShelf,
          eventAction: gaEventActions.add,
          userEmail: profile.email,
          dimension5: slug,
          eventLabel: sectionClicked.bookCard
        }));
    }
  }

  onRemoveFromMyBookshelf = () => {
    const {
      removeBookFromBookshelfWorkflow,
      book: { slug },
      profile,
      addSlimNotification,
      t,
      recordGaEvents
    } = this.props;

    removeBookFromBookshelfWorkflow(slug, profile.bookshelf.slug)
      .then(() => addSlimNotification({
        type: 'info',
        id: 'BookCard.removed-from-bookshelf-notification',
        content: t('BookCard.removed-from-bookshelf-notification-text'),
      }))
      .then(() => recordGaEvents({
        eventCategory: gaEventCategories.bookShelf,
        eventAction: gaEventActions.delete,
        userEmail: profile.email,
        dimension5: slug,
        eventLabel: sectionClicked.bookCard
      }));
  }

  onAddToOfflineClicked = (book) => {
    const {
      saveOfflineWorkflow,
      profile,
      addOfflineBookModal,
      recordGaEvents,
      userEmail,
      addSlimNotification,
      t,
      windowDimensions
    } = this.props;

    if(!profile.offlineBookPopupSeen) {
      addOfflineBookModal(userEmail);
    }
    saveOfflineWorkflow(book, getImageSize(windowDimensions.width))
      .then(() => addSlimNotification({
        type: 'info',
        content: t('BookCard.added-to-offline-library-notification'),
      }))
      .then(() => recordGaEvents({
        eventCategory: gaEventCategories.offline,
        eventAction: gaEventActions.add,
        userEmail: userEmail,
        dimension2: book.level,
        dimension3: book.language,
        dimension5: book.slug,
        metric2: 1
      })
    );
  }

  onOpenModal = (modalName) => {
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

  onTranslateBookClicked(slug) {
    const { 
      isLoggedIn,
      viewport,
      addSlimNotification,
      t, 
      book, 
      targetLanguage, 
      fetchCheckTranslationsWorkflow,
      openTranslationModal,
      openAuthModal } = this.props;
    
    if (!isLoggedIn) {
      if (process.env.REACT_APP_FEATURE_AUTH) {
        openAuthModal()
      }
      else {
        window.location.href = links.login()
      }
      return;
    }

    if (!targetLanguage) {
      document.getElementById("pb-translate-landing-to-lang").focus();
      addSlimNotification({
        id: 'Book.select-language-notification',
        type: 'danger',
        content: t('Book.select-language-notification'),
      });

      return;
    }
    
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
          openTranslationModal(book);
        }
      }
    })
  }

  render() {
    const {
      book,
      t,
      fontSize,
      disabled,
      onClick,
      loading,
      shouldDisplayMenu,
      isFetchingAssets,
      offline,
      openGlobalQuickView,
      isSavingOffline,
      unsaveOffline,
      offlineBooks,
      isLoggedIn,
      profile,
      openAuthModal,
      isAddingOrRemovingFromBookshelf,
      userEmail,
      recordGaEvents,
      viewport,
      hideMenu,
      hideQuickViewBtn,
      shouldShowReadIcon,
      showReadIconLoader,
      hideReadCountStat,
      addNotificationModal,
      addSlimNotification,
      hasOverlay,
      hasLightOverlay,
      showTranslateButton,
      isCheckingTranslations
    } = this.props;

    const {
      language,
      level,
      slug,
      coverImage,
      authors,
      illustrators,
      recommended,
      contest,
      readsCount,
      isGif
    } = book;

    const title = book.name ? book.name : book.title;

    const availableOffline = isAvailableOffline(book.id, offlineBooks)

    const baseClassName = 'pb-book-card';
    

    const isAddedToBookshelf = getIsAddedToBookshelf(slug, profile);
    const isAddingToBookshelf = getIsAddingToBookshelf(slug, isAddingOrRemovingFromBookshelf);

    let menu = null;
    
    if (shouldDisplayMenu) {
      menu = (
        <Menu>
          <MenuLink
            leftIcon={ isGif ? "gif" : "book" }
            onClick={() => this.onBookReadIconClicked('bookCardLink')}
            label={t("Book.read")}
            loading={isFetchingAssets && this.state.isReadLinkClicked}
            
          />
          {
            book.isAudio && <MenuLink
              leftIcon="readalong"
              onClick={() => this.onAudioReadIconClicked('bookCardLink')}
              label={t("Book.listen")}
              loading={isFetchingAssets && this.state.isListenLinkClicked}
            />
          }
          {
            !viewport.large || showTranslateButton
            ?
            <MenuLink
              leftIcon="quick-view"
              onClick={() => openGlobalQuickView(book)}
              label={t("Book.quick-view")}
            />
            :
            null
          }
          {
            (!isAddedToBookshelf && isLoggedIn) || !isLoggedIn
            ?
            <MenuLink
              leftIcon="plus-circle"
              onClick={this.onAddToMyBookshelf}
              label={t("global.add-to-my-bookshelf")}
              loading={isAddingToBookshelf}
            />
            :
            <MenuLink
              leftIcon="bin"
              onClick={this.onRemoveFromMyBookshelf}
              label={t("Book.remove-from-my-bookshelf")}
              loading={isAddingToBookshelf}
              theme="danger"
            />
          }
          {
            ('serviceWorker' in navigator) && process.env.REACT_APP_FEATURE_OFFLINE
            ?
            <MenuLink
              leftIcon={availableOffline ? "bin" : "offline"}
              onClick={() => {
                return availableOffline
                  ? 
                  (
                    unsaveOffline(book.id),
                    addSlimNotification({
                      type: 'info',
                      content: t('BookCard.removed-from-offline-library-notification'),
                    }),
                    recordGaEvents({
                      eventCategory: gaEventCategories.offline,
                      eventAction: gaEventActions.delete,
                      userEmail: userEmail,
                      dimension2: book.level,
                      dimension3: book.language,
                      dimension5: book.slug,
                      metric2: -1
                    })
                  )
                  : isLoggedIn
                    ? offlineBooks.books.length < MAX_OFFLINE_BOOKS_COUNT
                      ? this.onAddToOfflineClicked(book)
                      : this.onOpenModal('noSpaceForMoreOfflineBooks')
                    : addNotificationModal({
                      title: t("global.log-in"),
                      content: t("BookCard.please-log-in-notification-offline-library-text"),
                      additionalActions: [{
                        label: t('global.log-in'),
                        primary: true,
                        onClick: () => { process.env.REACT_APP_FEATURE_AUTH
                                         ?
                                         openAuthModal()
                                         :
                                         window.location.href = links.login() }
                      }, {
                        label: t('global.sign-up'),
                        onClick: () => { window.location.href = links.signup(); }
                      }
                    ]
                    })
              }}
              label={availableOffline ? t("Book.remove-from-offline") : t("Book.add-to-offline")}
              loading={isSavingOffline}
              theme={availableOffline ? "danger" : null}
              legend={
                availableOffline
                  ? null
                  : isLoggedIn
                    ? offlineBooks.books.length < MAX_OFFLINE_BOOKS_COUNT
                      ? null
                      : t("Books.no-space-save-to-offline")
                    : null
              }
            />
            :
            null
          }
        </Menu>
      )
    }
    const authorEls = getMetaEls(authors, baseClassName)

    const illustratorEls = getMetaEls(illustrators, baseClassName)

    let contestIconEl;
    if (contest && contest.won) {
      contestIconEl = <SvgIcon parentClassName={`${baseClassName}__contest-icon`} name="badge"/>
    }

    let recommendationEl;
    if (recommended) {
      recommendationEl = <div className={`${baseClassName}__recommendation`}><SvgIcon parentClassName={`${baseClassName}__recommendation-icon`} size={fontSize === 'l' ? 'm' : 's'} name="thumbs-up"/> {t("global.recommended")}</div>
    }

    const bookPath = `/stories/${slug}`;

    const classes = {
      [baseClassName]: true,
      [`${baseClassName}--level-${level}`]: level,
      [`${baseClassName}--font-size-${fontSize}`]: fontSize,
      [`${baseClassName}--disabled`]: disabled || loading,
      [`${baseClassName}--loading`]: loading,
      [`${baseClassName}--recommended`]: recommended,
      [`${baseClassName}--menu`]: menu,
      [`${baseClassName}--has-footer`]: recommended || (readsCount && !hideReadCountStat),
    }
    const titleClasses = {
      [`${baseClassName}__title`]: true,
      [`${baseClassName}__title--bhoti`]: book.language === 'Bhoti'
    }

    return (
      <div className={classNames(classes)}>
        <LazyFontLoader languages={[language]} />
        <div className={`${baseClassName}__container`}>
          <div className={`${baseClassName}__wrapper`}>
            <div className={`${baseClassName}__image-wrapper`} href={bookPath}>
              <div className={`${baseClassName}__image`}>
                <Img
                  image={coverImage}
                  alt={title}
                  lazyLoad
                  sizes={imageSrcsetSizes.grid2up6up}
                  offline={offline} />
              </div>
              {
                //After viewport large we show Quick View Button on hover, so we don't need image overlay(which comes for 3 dot menu)
                (contestIconEl || shouldDisplayMenu) && !viewport.large
                ?
                <div className={`${baseClassName}__image-overlay`}></div>
                :
                null
              }
              {contestIconEl}
            </div>

            <div className={`${baseClassName}__meta-wrapper`}>
              <div className={`${baseClassName}__level-strip`} href={bookPath}>
                {
                  language
                  ?
                  (<span className={`${baseClassName}__language`}>{language}</span>)
                  :
                  null
                }
                <span className={`${baseClassName}__level`}>{t("global.level", 1)} {level}</span>
              </div>
              <div className={`${baseClassName}__meta`}>
                <h3 className={classNames(titleClasses)}>{title}</h3>
                {authorEls}
                {illustratorEls}
                <div className={`${baseClassName}__footer`}>
                  {recommendationEl}
                  {
                    fontSize === 'l' || !readsCount || hideReadCountStat
                    ?
                    null
                    :
                    <Stat
                      parentClassName={`${baseClassName}__read-stat`}
                      icon="book"
                      value={readsCount}
                      size="s" />                    
                  }
                </div>
              </div>
            </div>
            <Link
              isInternal={onClick ? false : true}
              parentClassName={`${baseClassName}__link`}
              href={bookPath}
              title={(contest && contest.won && contest.name) ? `${t("BookCard.won")}: ${contest.name}` : null }
              onClick={onClick ? this.handleClick : null}>{title}</Link>
          </div>

            { menu
              ?
              <MenuEl
                baseClassName={baseClassName}
                menu={menu}
                disabled={disabled || loading}
                viewport={viewport}
                book={book}
                t={t}
                onMenuButtonClick={showTranslateButton ? this.onTranslateBookClicked.bind(this, slug) : openGlobalQuickView}
                hideMenu={hideMenu}
                hideQuickViewBtn={hideQuickViewBtn}
                shouldShowReadIcon={shouldShowReadIcon}
                showReadIconLoader={showReadIconLoader}
                isFetchingAssets={isFetchingAssets}
                isListenIconClicked={this.state.isListenIconClicked}
                onAudioReadIconClicked={this.onAudioReadIconClicked.bind(this, sectionClicked.bookCardIcon)}
                isReadIconClicked={this.state.isReadIconClicked}
                onBookReadIconClicked={this.onBookReadIconClicked.bind(this, sectionClicked.bookCardIcon)}
                showTranslateButton={showTranslateButton}
                isCheckingTranslations={isCheckingTranslations}
                />
              :
              null
            }

          {(hasOverlay || hasLightOverlay) && <div className={`${baseClassName}__overlay ${baseClassName}__overlay${hasLightOverlay ? '--faded' : ''}`} />}


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
        </div>
      </div>
    );
  }
}

BookCard.propTypes = {
  title: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  coverImage: PropTypes.object.isRequired,
  recommended: PropTypes.bool,
  authors: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired
  })),
  fontSize: PropTypes.oneOf([
    'm',
    'l'
  ]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  shouldDisplayMenu: PropTypes.bool,
  contest: PropTypes.object,
  offline: PropTypes.bool
};

export default BookCard;
