import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import Modal from '../Modal';
import Button from '../Button';
import './DownloadModal.scss';

class DownloadModal extends Component {
  //Modal is used to show the google form form link when user has crossed max download limit

  render(){
    const baseClassName = 'pb-download-modal';
    const { isVisible, onCloseClicked, onFormLinkClicked, t } = this.props;

    if (!isVisible) {
      return null;
    }

    const footer = (<Button
                      fullWidth
                      label={t('DownloadModal.popup-footer')}
                      variant="primary"
                      onClick={onFormLinkClicked}
                    />);

    return (
      <Modal footer={footer} onClose={onCloseClicked}>
        <h2 className={`${baseClassName}__title`}>{t('DownloadModal.link')}</h2>
        <p>{t('DownloadModal.popup')}</p>
      </Modal>
    );
  }
};

export default translate()(DownloadModal);
