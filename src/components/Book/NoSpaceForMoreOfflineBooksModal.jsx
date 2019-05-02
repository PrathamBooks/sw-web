import React, { Component } from 'react';
import { translate } from 'react-polyglot';
import { withRouter } from "react-router-dom";

import ButtonGroup from '../ButtonGroup';
import Button from '../Button';
import Modal from '../Modal';

class NoSpaceForMoreOfflineBooksModal extends Component {  // This is potentially the longest component name I have ever come up with
  render() {
    const { onClose, viewport, t, maximum, history } = this.props
    const header = <h2>{t('NoSpaceForMoreOfflineBooksModal.title')}</h2>;
    const footer = (
      <ButtonGroup mergeTop mergeBottom={!viewport.large} mergeSides>
        <Button label={t('NoSpaceForMoreOfflineBooksModal.manage')} variant="primary" onClick={() => {
          onClose()
          history.push('/offline')
        }} />
        <Button label={t('NoSpaceForMoreOfflineBooksModal.close')} onClick={onClose} />
      </ButtonGroup>
    );

    return (
      <Modal header={header} footer={footer} onClose={onClose}>
        <p>{t("NoSpaceForMoreOfflineBooksModal.warning", maximum)}</p>
      </Modal>
    );
  }
};

export default translate()(withRouter(NoSpaceForMoreOfflineBooksModal));
