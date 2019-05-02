import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-polyglot';
import { push } from 'react-router-redux';

import Modal from '../Modal';
import Button from '../Button';
import ButtonGroup from '../ButtonGroup';
import Stat from '../Stat';
import Link from '../Link';
import Loader from '../Loader';
import SvgIcon from '../SvgIcon';

import { arrayToI18nList } from '../../lib/textUtils.js';
import { links, linkType, profileTypes, gaEventCategories, gaEventActions, sectionClicked } from '../../lib/constants';
import {
  fetchNextReadBooksWorkflow,
  fetchBookAssetsWorkflow,
  openGlobalBookReader
} from '../../redux/bookActions';
import { recordGaEvents } from '../../redux/googleAnalyticsActions';

import './QuickViewModal.scss';

const makeProfileLinks = (collection, linkType, onClick) => {
  if (!collection) {
    return [];
  }
  
  return collection.map((item, i) =>
    <Link
      isInternal
      key={i}
      href={links.userProfile(item.slug)}
      onClick={onClick.bind(this,item.slug, linkType)}
    >
      {item.name}
    </Link>
  );
};


const mapStateToProps = ({ book: { isFetchingAssets }, user: { profile }}) => ({
  isFetchingAssets,
  userEmail: profile.email,
});

const mapDispatchToProps = {
  push,
  fetchBookAssetsWorkflow,
  fetchNextReadBooksWorkflow,
  openGlobalBookReader,
  recordGaEvents
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class QuickViewModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isReadNowButtonClicked: false,
      isListenIconClicked: false,
      isReadIconClicked: false
    }
}

  onReadClicked = () => {
    const {
      book,
      fetchBookAssetsWorkflow,
      fetchNextReadBooksWorkflow,
      openGlobalBookReader,
      recordGaEvents,
      userEmail,
      onCloseClicked
    } = this.props;
    this.setState(
      {isReadNowButtonClicked: true});
    fetchBookAssetsWorkflow(book.slug)
        .then(() => {
          onCloseClicked();
          openGlobalBookReader({ book });
          fetchNextReadBooksWorkflow(book.slug);
        });
    recordGaEvents({
      eventCategory: gaEventCategories.book,
      eventAction: gaEventActions.read,
      userEmail: userEmail,
      dimension2: book.level,
      dimension3: book.language,
      dimension5: book.slug,
      metric2: 1,
      eventLabel: sectionClicked.quickViewModal
    });
      
  }

  onBookReadIconClicked = () => {
    const {
      book,
      fetchBookAssetsWorkflow,
      fetchNextReadBooksWorkflow,
      openGlobalBookReader,
      recordGaEvents,
      userEmail,
      onCloseClicked
    } = this.props;
    this.setState(
      {isReadIconClicked: true});
    fetchBookAssetsWorkflow(book.slug)
        .then(() => {
          onCloseClicked();
          openGlobalBookReader({book, startPage: 1})
          fetchNextReadBooksWorkflow(book.slug);
        });
    recordGaEvents({
      eventCategory: gaEventCategories.book,
      eventAction: gaEventActions.read,
      userEmail: userEmail,
      dimension2: book && book.level,
      dimension3: book && book.language,
      dimension5: book && book.slug,
      metric2: 1,
      eventLabel: sectionClicked.quickViewModal
    });
      
  }

  onAudioReadIconClicked = () => {
    const {
      book,
      fetchBookAssetsWorkflow,
      fetchNextReadBooksWorkflow,
      openGlobalBookReader,
      recordGaEvents,
      userEmail,
      onCloseClicked
    } = this.props;
    this.setState(
      {isListenIconClicked: true});
    fetchBookAssetsWorkflow(book.slug)
        .then(() => {
          onCloseClicked();
          openGlobalBookReader({book, showAudioBookReader: true});
          fetchNextReadBooksWorkflow(book.slug);
        });
    recordGaEvents({
      eventCategory: gaEventCategories.book,
      eventAction: gaEventActions.listened,
      userEmail: userEmail,
      dimension2: book.level,
      dimension3: book.language,
      dimension5: book.slug,
      metric2: 1,
      eventLabel: sectionClicked.quickViewModal
    });
      
  }

  onViewBookDetailsClicked = () => {
    this.props.onCloseClicked();
    //this.props.push was causing problem (the page was getting redirected but to botttom of the page),
    // so used window.location.href instead, as this.props.push is being used only at this place 
    //Long term fix would be to use something like https://reacttraining.com/react-router/web/guides/scroll-restoration
    window.location.href = links.bookDetails(this.props.book.slug);
  }

  onProfileLinkClicked = (profileSlug, linkType, e) => {
    const {
      recordGaEvents,
      userEmail,
      onCloseClicked
    } = this.props;
  
    recordGaEvents({
      eventCategory: gaEventCategories.profile,
      eventAction: gaEventActions.opened,
      eventLabel: `${sectionClicked.quickViewModal} ${linkType}`,
      userEmail: userEmail,
      dimension5: profileSlug
    });
    onCloseClicked();
  }
  
  render() {
    const baseClassName = 'pb-quick-view-modal';
    let { viewport, t, book, onCloseClicked, isFetchingAssets } = this.props;
    const { isGif } = book;

    const footer = (
      <ButtonGroup mergeTop mergeBottom={!viewport.large} mergeSides>
        <Button
          variant="primary"
          fullWidth
          label={t('Book.read-now')}
          onClick={this.onReadClicked}
          loading={isFetchingAssets && this.state.isReadNowButtonClicked}
        />
        <Button
          fullWidth
          label={t('global.view-details')}
          onClick={this.onViewBookDetailsClicked}
        />
      </ButtonGroup>
    );

    const authorLinks = makeProfileLinks(book.authors, linkType.writtenBy, this.onProfileLinkClicked);
    const illustratorLinks = makeProfileLinks(book.illustrators, linkType.illustratedBy, this.onProfileLinkClicked);

    const authorsEl = <span>{t('Book.written-by')} {arrayToI18nList(authorLinks)}</span>;

    const illustratorEl = illustratorLinks.length > 0 ?
      <span>{t('Book.illustrated-by')} {arrayToI18nList(illustratorLinks)}</span>
      :
      null;

    const readAlongEl = (
      isFetchingAssets && this.state.isListenIconClicked
      ?
      <Loader size='m' />
      :
      <Link onClick={this.onAudioReadIconClicked} theme='dark'>
        <SvgIcon name= 'readalong' size="m" pushRight/>
      </Link> 
    );

    return (
      <Modal
        onClose={onCloseClicked}
        footer={footer}
      >
        <h2 className={`${baseClassName}__title`}>{book.title}</h2>
        {
          (book.isAudio || isGif) &&
            <div className={`${baseClassName}__action-icon`}>
              {
                isFetchingAssets && this.state.isReadIconClicked
                ?
                <Loader size='m' />
                :
                <Link onClick={this.onBookReadIconClicked} theme='dark'>
                  <SvgIcon name={ isGif ? 'gif' : 'read' } size="m" pushRight/>
                </Link>
              }
              { book.isAudio ? readAlongEl : null }
            </div>
        }
        <p className={`${baseClassName}__credits`}>{ authorsEl } { illustratorEl }</p>
        { book.description ? <p>{book.description}</p> : null }
        <div className={`${baseClassName}__footer`}>
          <div className={`${baseClassName}__stats`}>
            { book.likesCount ? <Stat iconVariant="accent" icon="heart" value={book.likesCount} /> : null }
            { book.readsCount ? <Stat icon="book" value={book.readsCount} /> : null }
          </div>
          <div>
            {
              book.publisher
              ?
              <Link
                href={links.profile(profileTypes.PUBLISHER, book.publisher.slug)}
                isInternal
                onClick={() => this.props.onCloseClicked()}
              >
                <img
                  className={`${baseClassName}__publisher-logo`}
                  src={book.publisher.logo}
                  alt={`${t("global.logo-of")} ${book.publisher.name}`}
                />
              </Link>
              :
              null
            }
          </div>
        </div>
      </Modal>
    );
  }
}

QuickViewModal.propTypes = {
};

export default QuickViewModal;
