import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import Modal from '../Modal';
import Button from '../Button';

class DownloadModal extends Component {
  //Modal is used to show the google form form link when user has crossed max download limit

  render(){
    const { isVisible, onCloseClicked, onFormLinkClicked, t } = this.props;

    if (!isVisible) {
      return null;
    }

    const header = (
      <h2>{t('DownloadModal.illustration-link')}</h2>
    );

    const footer = (<Button
                      fullWidth
                      label={t('DownloadModal.illustration-popup-footer')}
                      variant="primary"
                      onClick={onFormLinkClicked}
                    />);

    return (
      <Modal header={header} footer={footer} onClose={onCloseClicked}>
        <p>{t('DownloadModal.illustration-popup')}</p>
      </Modal>
    );
  }
};

export default translate()(DownloadModal);
