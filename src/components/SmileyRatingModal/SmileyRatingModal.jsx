import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import Modal from '../Modal';
import Button from '../Button';
import Link from '../Link';
import SvgIcon from '../SvgIcon';
import LoaderBlock from '../LoaderBlock';

import ThreePointRating from '../ThreePointRating';
import FlagModal from '../Book/FlagModal';
import { gaEventCategories, gaEventActions } from '../../lib/constants';

import './SmileyRatingModal.scss';


class SmileyRatingModal extends Component {  
    constructor(props) {
      super(props);
  
      this.state = {
        selectedSmiley: null,
        isFlagModalVisible: false
      };
    }

  onCloseModal = () => {
    const {
      recordGaEvents,
      book,
      userEmail,
      removeSmileyRatingModal,
      showAudioBookReaderOnBack } = this.props;

    recordGaEvents({
      eventCategory: showAudioBookReaderOnBack ? gaEventCategories.audioSmileyRating : gaEventCategories.smileyRating,
      eventAction: gaEventActions.closed,
      userEmail: userEmail,
      dimension2: book.level,
      dimension3: book.language,
      dimension5: book.slug,
    });

    removeSmileyRatingModal();
  }

  onChange = (type) => this.setState({ selectedSmiley: type })

  onBackClicked = () => {
    const {
      openGlobalBookReader,
      lastStoryPage,
      removeSmileyRatingModal,
      recordGaEvents,
      book,
      userEmail,
      fetchBookAssetsWorkflow,
      showAudioBookReaderOnBack } = this.props;

      fetchBookAssetsWorkflow(book.slug)
      .then(response => {
        if ( response ) {
          removeSmileyRatingModal()
          openGlobalBookReader({book, showAudioBookReader: showAudioBookReaderOnBack, startPage: lastStoryPage || 1})
        }
      })

    recordGaEvents({
      eventCategory: showAudioBookReaderOnBack ? gaEventCategories.audioSmileyRating : gaEventCategories.smileyRating,
      eventAction: gaEventActions.back,
      userEmail: userEmail,
      dimension2: book.level,
      dimension3: book.language,
      dimension5: book.slug,
    });
  }

  onFlagModalOpened = () => this.setState({ isFlagModalVisible: true })

  onReportCloseClicked = () => {
    this.setState({ isFlagModalVisible: false })
    this.props.removeSmileyRatingModal();
    this.props.openNextReadSuggestions();
  }

  onNextReadClicked = () => {
    const {
      recordGaEvents,
      book,
      userEmail,
      removeSmileyRatingModal,
      fetchNextReadBooksWorkflow,
      openNextReadSuggestions,
      showAudioBookReaderOnBack } = this.props;

    recordGaEvents({
      eventCategory: showAudioBookReaderOnBack ? gaEventCategories.audioSmileyRating : gaEventCategories.smileyRating,
      eventAction: gaEventActions.skipped,
      userEmail: userEmail,
      dimension2: book.level,
      dimension3: book.language,
      dimension5: book.slug,
    });
    
    fetchNextReadBooksWorkflow(book.slug)
    .then(response => {
      if ( response ) {
        removeSmileyRatingModal();
        openNextReadSuggestions();
      }
    })
  }

  onSubmit = () => {
    const {
      postSmileyRatingWorkflow,
      fetchBookWorkflow,
      slug,
      recordGaEvents,
      book,
      userEmail,
      currentBookSlug,
      removeSmileyRatingModal,
      openNextReadSuggestions,
      fetchNextReadBooksWorkflow,
      showAudioBookReaderOnBack } = this.props;

    recordGaEvents({
      eventCategory: showAudioBookReaderOnBack ? gaEventCategories.audioSmileyRating : gaEventCategories.smileyRating,
      eventAction: gaEventActions.submit,
      eventLabel: this.state.selectedSmiley,
      userEmail: userEmail,
      dimension2: book.level,
      dimension3: book.language,
      dimension5: book.slug,
    });

    postSmileyRatingWorkflow(slug, this.state.selectedSmiley)
      .then(response => {
        if ( response ) {
          fetchNextReadBooksWorkflow(book.slug)
          .then(response => {
            if ( response ) {
              removeSmileyRatingModal();
              openNextReadSuggestions();
            }
          })
          if (currentBookSlug) {
            fetchBookWorkflow(currentBookSlug);
          }
          
        }
      })
  }


  render () {

    const {
      t,
      viewport,
      isVisible,
      slug,
      postFlagBookWorkflow,
      recordGaEvents,
      book,
      userEmail,
      isFlaggingBook,
      isLoggedIn,
      isSubmittingSmileyRating,
      isFetchingSmileyRatingBook,
      openNextReadSuggestions,
      removeSmileyRatingModal,
      isFetchingNextReadBooks } = this.props;

    const baseClassName = 'pb-smiley-rating-modal';

    if (!isVisible) {
      return null;
    }

    if (book.isFlagged) {
      removeSmileyRatingModal();
      openNextReadSuggestions();
    }

    if ( isFetchingSmileyRatingBook || isFetchingNextReadBooks ) {
      return (<Modal onClose={this.onCloseModal}>
                <LoaderBlock />
              </Modal>);
    }
    
    const header = <h2 className={`${baseClassName}__title`}>
                     {book.isLanguageReviewer ? t(`SmileyRatingModal.reviewer-title`) : t(`SmileyRatingModal.title`)}
                   </h2>;

    const submitEl = (
      <div className={`${baseClassName}__submit-wrapper`}>
        <Button 
        parentClassName={`${baseClassName}__submit`} 
        label={t('global.submit')} 
        variant="primary" 
        fullWidth 
        onClick={() => { this.onSubmit() }}
        disabled={this.state.selectedSmiley === null}
        loading={isSubmittingSmileyRating} />
      </div>
    );

    const footerEl = (
      <div className={`${baseClassName}__footer`}>
        <Link parentClassName={`${baseClassName}__link`} onClick={this.onBackClicked}>
          <SvgIcon parentClassName={`${baseClassName}__icon`} name='chevron-left' />
          {t('SmileyRatingModal.back')}
        </Link>
        {
          isLoggedIn && !book.isFlagged
          ?
          <Link parentClassName={`${baseClassName}__link`} onClick={this.onFlagModalOpened}>
            <SvgIcon parentClassName={`${baseClassName}__icon`} name='flag' />
            {t('SmileyRatingModal.footer-report')}
          </Link>
          :
          null
        }
        <Link parentClassName={`${baseClassName}__link`} onClick={this.onNextReadClicked}>
          {t('SmileyRatingModal.footer-read-more')}
          <SvgIcon parentClassName={`${baseClassName}__icon`} name='chevron-right' />
        </Link>
      </div>
    );

    const smileyRatingEl = [
        header,
        <ThreePointRating onSelect={this.onChange} />,
        submitEl
    ];

    const onFlagClicked = (slug, reasons) => {
      const flagPromise = postFlagBookWorkflow(slug, reasons)

      const recordGaEventPromise = recordGaEvents({
        eventCategory: gaEventCategories.smileyRating,
        eventAction: gaEventActions.flagged,
        userEmail: userEmail,
        dimension2: book.level,
        dimension3: book.language,
        dimension5: book.slug,
      });

      return Promise.all([flagPromise, recordGaEventPromise])
    }

    return (
      this.state.isFlagModalVisible
      ?
      <FlagModal
        isVisible={this.state.isFlagModalVisible}
        onCloseClicked={this.onReportCloseClicked}
        onFlagClicked={reasons => onFlagClicked(slug, reasons)}
        viewport={viewport}
        isFlaggingBook={isFlaggingBook[slug]}
      />
      :
      <Modal long onClose={this.onCloseModal}>
        {smileyRatingEl}
        {footerEl}
      </Modal>
    );
  }
};

export default translate()(SmileyRatingModal);