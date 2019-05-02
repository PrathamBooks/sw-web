import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import Modal from '../Modal';
import Button from '../Button';
import Link from '../Link';
import ButtonGroup from '../ButtonGroup';
import LoaderBlock from '../LoaderBlock';
import { links } from '../../lib/constants';

import './TranslationModal.scss';

class TranslationModal extends Component {

  onCloseModal = () => {
    this.props.closeTranslationModal();
  }

  onTranslateBookClicked(slug) {
    const { viewport, addSlimNotification, translateTargetLanguage, t, closeTranslationModal } = this.props;
    closeTranslationModal();
    if (viewport.medium) {
      window.location.href = links.translateBookToLanguage(slug, translateTargetLanguage)
    }
    else {
      addSlimNotification({
        id: 'Book.mobile-editor-notification',
        content: t('Book.mobile-editor-notification-text'),
      });
    }
  }

  render () {
    const {
      isVisible,
      book,
      t,
      translateTargetLanguage,
      isFetchingTranslateFilters,
      isCheckingTranslations,
      openTranslateTabLink } = this.props;
 
    if (!isVisible || !translateTargetLanguage) {
      return null;
    }

    const baseClassName = 'pb-translation-modal';

    const header = (
      <h2 className={`${baseClassName}__title`}>
        {t(`TranslationModal.title`)}
      </h2>
    );

    let footer = (
      <ButtonGroup mergeTop mergeBottom mergeSides>
        <Button
          fullWidth
          label={t(`TranslationModal.popup-footer`)}
          variant="primary"
          onClick={this.onTranslateBookClicked.bind(this, book.slug)}
        />
        <Button
          fullWidth
          label={t('global.close')}
          onClick={this.onCloseModal}
        />
      </ButtonGroup>
    );

    if ( isFetchingTranslateFilters || isCheckingTranslations ) {
      return (<Modal onClose={this.onCloseModal}>
                <LoaderBlock />
              </Modal>);
    }

    return (
    <Modal footer={footer} onClose={this.onCloseModal}>
      { header }
      <p>
        {t(`TranslationModal.popup`)}
        <Link onClick={this.onCloseModal} href={openTranslateTabLink ? links.translate() : null}>
          {t(`TranslationModal.popup-1`)}
        </Link>
        {t("TranslationModal.popup-2")}
      </p>
    </Modal>
  );
  }
};

export default translate()(TranslationModal);